import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import './chapterDetail.css'
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../../firebase/firebase.config';
import { doc, getDoc } from 'firebase/firestore';

const ChapterDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(location.state?.chapter || null);
  const [loading, setLoading] = useState(!location.state?.chapter);

  useEffect(() => {
    const fetchChapter = async () => {
      if (!chapter) {
        setLoading(true);
        try {
          // Note: If navigating directly, we might not have classId. 
          // For simplicity, we assume the user navigates through the class page.
          // If we need to support direct links, we'd need a better path structure or a search.
          // However, the provided schema suggests class_data/{classId}/chapters/{chapterId}
          const classId = location.state?.classId;
          if (classId) {
            const chapterRef = doc(db, 'class_data', classId, 'chapters', id);
            const docSnap = await getDoc(chapterRef);
            if (docSnap.exists()) {
              setChapter({ id: docSnap.id, ...docSnap.data() });
            }
          }
        } catch (error) {
          console.error("Error fetching chapter detail:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchChapter();
  }, [id, chapter, location.state?.classId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleDownloadNotes = () => {
    if (chapter?.noteUrl) {
      window.open(chapter.noteUrl, '_blank');
    }
  };

  if (loading) return <div className="loading-container"><p>Loading chapter details...</p></div>;
  if (!chapter) return <div className="error-container"><p>Chapter not found.</p></div>;

  // Function to extract YouTube ID and return embed URL
  const getEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1];
    } else if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1];
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
          {/* Description Section */}
          <section className="section">
            <h2 className="section-title">Chapter Description</h2>
            <p className="description-text">
              {chapter.description || "No description available for this chapter."}
            </p>
          </section>

          {/* Notes Section */}
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

          {/* Video Section */}
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