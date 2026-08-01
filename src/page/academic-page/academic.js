import React, { useEffect, useState } from 'react';
import './academic.css';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';

const CLASS_META = {
  9: {
    title: 'Class 9 Chemistry',
    description: 'Learn basic concepts and experiments',
    firestoreId: 'class_9',
    color: '#1e88e5',
  },
  10: {
    title: 'Class 10 Chemistry',
    description: 'Build your chemical reactions foundation',
    firestoreId: 'class_10',
    color: '#1976d2',
  },
  11: {
    title: 'Class 11 Chemistry',
    description: 'Dive into advanced concepts and theories',
    firestoreId: 'class_11',
    color: '#1565c0',
  },
  12: {
    title: 'Class 12 Chemistry',
    description: 'Master Chemistry for competitive exams',
    firestoreId: 'class_12',
    color: '#0d47a1',
  },
};

const AcademicsPage = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [chaptersByClass, setChaptersByClass] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchChapters = async () => {
      setLoading(true);
      try {
        const entries = await Promise.all(
          Object.entries(CLASS_META).map(async ([classNum, meta]) => {
            const chaptersRef = collection(db, 'class_data', meta.firestoreId, 'chapters');
            const q = query(chaptersRef, orderBy('order', 'asc'));
            const snap = await getDocs(q);
            const chapters = snap.docs.map((d) => ({
              id: d.id,
              ...d.data(),
              name: d.data().name || 'Untitled chapter',
            }));
            return [classNum, chapters];
          })
        );

        if (!cancelled) {
          setChaptersByClass(Object.fromEntries(entries));
        }
      } catch (error) {
        console.error('Error fetching academics chapters:', error);
        if (!cancelled) setChaptersByClass({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchChapters();
    return () => { cancelled = true; };
  }, []);

  const selectedMeta = selectedClass ? CLASS_META[selectedClass] : null;
  const selectedChapters = selectedClass ? (chaptersByClass[selectedClass] || []) : [];

  return (
    <div className="academics-page">
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Explore Class-wise Chemistry Topics</h1>
          <p className="hero-subtitle">Build your Chemistry foundation step by step.</p>
          <div className="hero-icons">
            <span className="hero-icon">🧪</span>
            <span className="hero-icon">⚛️</span>
            <span className="hero-icon">🔬</span>
          </div>
        </div>
      </section>

      <section className="class-grid-section">
        <div className="container">
          <h2 className="section-title">Choose Your Class</h2>
          <div className="class-grid">
            {Object.entries(CLASS_META).map(([classNum, data]) => {
              const chapters = chaptersByClass[classNum] || [];
              return (
                <Link to={`/class/${classNum}`} key={classNum} className="class-card">
                  <div className="card-header">
                    <div className="class-badge">Class {classNum}</div>
                    <div className="chemistry-icon">⚗️</div>
                  </div>
                  <h3 className="card-title">{data.title}</h3>
                  <p className="card-description">{data.description}</p>
                  <div className="card-stats">
                    <span className="stat">
                      <span className="stat-icon">📚</span>
                      {loading ? '…' : `${chapters.length} Chapters`}
                    </span>
                    <span className="stat">
                      <span className="stat-icon">✅</span>
                      Interactive
                    </span>
                  </div>
                  <button
                    type="button"
                    className="view-topics-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedClass(classNum);
                    }}
                  >
                    View Chapters
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {selectedClass && selectedMeta && (
        <div className="modal-overlay" onClick={() => setSelectedClass(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSelectedClass(null)}>×</button>
            <h2 className="modal-title">{selectedMeta.title}</h2>
            <p className="modal-subtitle">{selectedMeta.description}</p>
            <div className="topics-list">
              {loading ? (
                <p className="topics-loading">Loading chapters…</p>
              ) : selectedChapters.length === 0 ? (
                <p className="topics-loading">No chapters published for this class yet.</p>
              ) : (
                selectedChapters.map((chapter, index) => (
                  <div key={chapter.id} className="topic-item">
                    <span className="topic-number">{index + 1}</span>
                    <span className="topic-name">{chapter.name}</span>
                    <button
                      type="button"
                      className="topic-btn"
                      onClick={() => {
                        const classNum = selectedClass;
                        const firestoreId = CLASS_META[classNum].firestoreId;
                        setSelectedClass(null);
                        navigate(`/class/${firestoreId}/chapter/${chapter.id}`, {
                          state: { chapter, classId: firestoreId },
                        });
                      }}
                    >
                      Start Learning →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <section className="featured-section">
        <div className="container">
          <div className="featured-content">
            <div className="featured-icon">✨</div>
            <h2 className="featured-title">What Makes Our Content Special?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">📝</div>
                <h3>Interactive Notes</h3>
                <p>Comprehensive and easy-to-understand study materials</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <h3>Topic-wise Quizzes</h3>
                <p>Test your knowledge after each chapter</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <h3>Chapter Summaries</h3>
                <p>Quick revision notes for exam preparation</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎓</div>
                <h3>Expert Guidance</h3>
                <p>Learn from experienced Chemistry educators</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3 className="footer-logo">
              <span className="logo-icon">⚗️</span>
              SharpChem.in
            </h3>
            <p className="footer-desc">Your complete Chemistry learning platform</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/academic">Academics</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/practice">Practice Papers</Link></li>
              <li><Link to="/practice">PYQs & Tests</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <Link to="/contact" className="social-icon" aria-label="Contact">📧</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SharpChem.in. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AcademicsPage;
