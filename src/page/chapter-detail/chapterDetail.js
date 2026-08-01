import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import './chapterDetail.css'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../../firebase/firebase.config';
import { doc, getDoc } from 'firebase/firestore';

const ChapterDetailPage = () => {
  const { classId: paramClassId, chapterId: paramChapterId, id: legacyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const classId = paramClassId || location.state?.classId;
  const chapterId = paramChapterId || legacyId;

  const [chapter, setChapter] = useState(
    location.state?.chapter && location.state.chapter.id === chapterId
      ? location.state.chapter
      : null
  );
  const [loading, setLoading] = useState(!chapter);

  useEffect(() => {
    let cancelled = false;

    const fetchChapter = async () => {
      if (!classId || !chapterId) {
        setLoading(false);
        setChapter(null);
        return;
      }

      // Prefer fresh fetch so shared URLs always work; use state only as optional seed
      setLoading(true);
      try {
        const chapterRef = doc(db, 'class_data', classId, 'chapters', chapterId);
        const docSnap = await getDoc(chapterRef);
        if (!cancelled) {
          if (docSnap.exists()) {
            setChapter({ id: docSnap.id, ...docSnap.data() });
          } else {
            setChapter(null);
          }
        }
      } catch (error) {
        console.error('Error fetching chapter detail:', error);
        if (!cancelled) setChapter(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchChapter();
    return () => { cancelled = true; };
  }, [classId, chapterId]);

  const handleBackClick = () => {
    if (classId) {
      // Standard tracks use /class/9 style URLs; Firestore ids are class_9
      const studentClassPath = classId.startsWith('class_')
        ? classId.replace('class_', '')
        : classId;
      navigate(`/class/${studentClassPath}`);
      return;
    }
    navigate(-1);
  };

  const handleDownloadNotes = () => {
    if (chapter?.noteUrl) {
      window.open(chapter.noteUrl, '_blank');
    }
  };

  if (loading) return <div className="loading-container"><p>Loading chapter details...</p></div>;
  if (!classId || !chapterId) {
    return (
      <div className="error-container">
        <p>Missing class or chapter in the URL.</p>
        <button className="download-button" type="button" onClick={() => navigate('/academic')}>
          Go to Academics
        </button>
      </div>
    );
  }
  if (!chapter) return <div className="error-container"><p>Chapter not found.</p></div>;

  const getEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="chapter-detail-page">
      <div className="chapter-container">
        <header className="header">
          <button className="back-button" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="header-title">{chapter.name}</h1>
        </header>

        <div className="content">
          <section className="section">
            <h2 className="section-title">Chapter Description</h2>
            <p className="description-text">
              {chapter.description || 'No description available for this chapter.'}
            </p>
          </section>

          {chapter.noteUrl && (
            <section className="section">
              <h2 className="section-title">Notes</h2>
              <div className="notes-container">
                <div className="notes-info">
                  <p className="notes-text">Chapter notes are available for download</p>
                  <p className="notes-subtext">Click the button to view or download the PDF/Image notes.</p>
                </div>
                <button className="download-button" onClick={handleDownloadNotes}>
                  <Download size={20} />
                  Download Notes
                </button>
              </div>
            </section>
          )}

          {chapter.videoUrl && (
            <section className="section">
              <h2 className="section-title">Video Lesson</h2>
              <div className="video-container">
                <iframe
                  src={getEmbedUrl(chapter.videoUrl)}
                  title={chapter.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterDetailPage;
