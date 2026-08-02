import React, { useState, useEffect, useMemo } from 'react';
import './classPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/firebase.config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import {
  resolvePracticeClassId,
  practiceTrackLabel,
  academicsChapterPath,
  allSyllabusTracks,
} from '../../utils/practiceRoutes';

const ClassDetail = () => {
  const { id, examType } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const firestoreId = useMemo(
    () => resolvePracticeClassId(id, examType),
    [id, examType]
  );

  const trackMeta = useMemo(
    () => allSyllabusTracks().find((t) => t.firestoreId === firestoreId),
    [firestoreId]
  );

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      try {
        if (!firestoreId) {
          setChapters([]);
          return;
        }

        const chaptersRef = collection(db, 'class_data', firestoreId, 'chapters');
        const q = query(chaptersRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        setChapters(
          querySnapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [firestoreId]);

  const handleLearnNow = (chapter) => {
    navigate(academicsChapterPath(id, examType, chapter.id), {
      state: { chapter, classId: firestoreId },
    });
  };

  const pageTitle = trackMeta?.label || practiceTrackLabel(id, examType);
  const pageSubtitle =
    trackMeta?.learnBlurb || trackMeta?.description || 'Explore chapters for this track';

  return (
    <div className="chapters-page">
      <header className="chapters-header">
        <div className="header-content">
          <h1 className="class-title">{pageTitle}</h1>
          <p className="class-subtitle">{pageSubtitle}</p>
        </div>
      </header>

      <section className="chapters-section">
        <div className="chapters-container">
          {loading ? (
            <div className="loading-container">
              <p>Loading classes and chapters...</p>
            </div>
          ) : !firestoreId ? (
            <div className="no-chapters">
              <p>Unknown track. Open Academics and pick a board or JEE/NEET class.</p>
            </div>
          ) : chapters.length > 0 ? (
            <div className="chapters-grid">
              {chapters.map((chapter, index) => (
                <div key={chapter.id} className="chapter-card">
                  <div className="chapter-number">Chapter {chapter.order || index + 1}</div>
                  <h3 className="chapter-title">{chapter.name}</h3>
                  <p className="chapter-desc">{chapter.description}</p>
                  <button type="button" className="learn-btn" onClick={() => handleLearnNow(chapter)}>
                    Learn Now →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-chapters">
              <p>No chapters available for {pageTitle} yet.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} SharpChem.in | Empowering Chemistry Education</p>
        </div>
      </footer>
    </div>
  );
};

export default ClassDetail;
