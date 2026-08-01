import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Target } from 'lucide-react';
import './chapterDetail.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../../firebase/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { practiceTopicsPathFromFirestore } from '../../utils/practiceRoutes';

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

  const handlePracticeChapter = () => {
    const path = practiceTopicsPathFromFirestore(classId, chapterId);
    if (path) navigate(path);
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

  const practicePath = practiceTopicsPathFromFirestore(classId, chapterId);

  return (
    <div className="chapter-detail-page">
      <div className="chapter-container">
        <header className="header">
          <button type="button" className="back-button" onClick={handleBackClick}>
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

          {practicePath && (
            <section className="section practice-cta-section">
              <h2 className="section-title">Practice this chapter</h2>
              <div className="practice-cta-box">
                <div className="practice-cta-copy">
                  <p className="notes-text">Ready to test yourself?</p>
                  <p className="notes-subtext">
                    Open topics for practice questions and quizzes. Lessons and notes stay on this page.
                  </p>
                </div>
                <button type="button" className="practice-chapter-button" onClick={handlePracticeChapter}>
                  <Target size={20} />
                  Practice this chapter
                </button>
              </div>
            </section>
          )}

          <section className="section">
            <h2 className="section-title">Notes</h2>
            {chapter.noteUrl ? (
              <div className="notes-container">
                <div className="notes-info">
                  <p className="notes-text">Chapter notes are available</p>
                  <p className="notes-subtext">Open or download the PDF / image for this chapter.</p>
                </div>
                <button type="button" className="download-button" onClick={handleDownloadNotes}>
                  <Download size={20} />
                  Open Notes
                </button>
              </div>
            ) : (
              <div className="notes-container notes-container--empty">
                <div className="notes-info">
                  <p className="notes-text">No notes uploaded yet</p>
                  <p className="notes-subtext">When notes are added in admin for this chapter, they will appear here.</p>
                </div>
              </div>
            )}
          </section>

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
