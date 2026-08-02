import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Target, ChevronRight } from 'lucide-react';
import {
  PRACTICE_TRACKS,
  academicsClassPath,
} from '../../utils/practiceRoutes';
import '../practice/PracticeHub.css';
import './academic.css';

const TrackCard = ({ track, accent, onOpen }) => (
  <button type="button" className={`ph-card ph-card--${accent}`} onClick={onOpen}>
    <div className="ph-card-top">
      <span className="ph-card-badge">{track.label}</span>
      <ChevronRight size={20} className="ph-card-chevron" />
    </div>
    <p className="ph-card-blurb">{track.learnBlurb || track.blurb}</p>
    <span className="ph-card-cta">View chapters</span>
  </button>
);

const AcademicsPage = () => {
  const navigate = useNavigate();

  const openTrack = (track) => {
    navigate(academicsClassPath(track.firestoreId));
  };

  return (
    <div className="academics-page">
      <section className="hero-banner hero-banner--compact">
        <div className="hero-content">
          <p className="hero-eyebrow">Learn mode</p>
          <h1 className="hero-title">Explore Class-wise Chemistry Topics</h1>
          <p className="hero-subtitle">Build your Chemistry foundation step by step.</p>
          <div className="hero-icons" aria-hidden="true">
            <span className="hero-icon">🧪</span>
            <span className="hero-icon">⚛️</span>
            <span className="hero-icon">🔬</span>
          </div>
        </div>
      </section>

      <div className="practice-hub academics-hub">
        <div className="practice-hub-inner">
          <p className="academics-hub-lead">
            Pick a board or competitive track, open a chapter, then study each topic with video and notes.
            Practice questions and quizzes live under Practice.
          </p>

          <section className="ph-section">
            <div className="ph-section-head">
              <div className="ph-section-icon ph-section-icon--board">
                <BookOpen size={22} />
              </div>
              <div>
                <h2>Board classes</h2>
                <p>Class 9–12 standard syllabus lessons</p>
              </div>
            </div>
            <div className="ph-grid">
              {PRACTICE_TRACKS.board.map((track) => (
                <TrackCard
                  key={track.firestoreId}
                  track={track}
                  accent="board"
                  onOpen={() => openTrack(track)}
                />
              ))}
            </div>
          </section>

          <section className="ph-section">
            <div className="ph-section-head">
              <div className="ph-section-icon ph-section-icon--comp">
                <Target size={22} />
              </div>
              <div>
                <h2>Competitive exams</h2>
                <p>JEE &amp; NEET chapter lessons and notes</p>
              </div>
            </div>
            <div className="ph-grid">
              {PRACTICE_TRACKS.competitive.map((track) => (
                <TrackCard
                  key={track.firestoreId}
                  track={track}
                  accent="comp"
                  onOpen={() => openTrack(track)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

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
