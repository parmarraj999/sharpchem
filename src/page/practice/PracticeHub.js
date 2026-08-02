import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Target, ChevronRight } from 'lucide-react';
import {
  PRACTICE_TRACKS,
  practiceChapterListPath,
} from '../../utils/practiceRoutes';
import './PracticeHub.css';

const TrackCard = ({ track, accent, onOpen }) => (
  <button type="button" className={`ph-card ph-card--${accent}`} onClick={onOpen}>
    <div className="ph-card-top">
      <span className="ph-card-badge">{track.label}</span>
      <ChevronRight size={20} className="ph-card-chevron" />
    </div>
    <p className="ph-card-blurb">{track.blurb}</p>
    <span className="ph-card-cta">Open chapters</span>
  </button>
);

const PracticeHub = () => {
  const navigate = useNavigate();

  const openTrack = (track) => {
    navigate(practiceChapterListPath(track.id, track.examType));
  };

  return (
    <div className="practice-hub">
      <div className="practice-hub-inner">
        <header className="ph-hero">
          <p className="ph-eyebrow">Drill mode</p>
          <h1 className="ph-title">Practice</h1>
          <p className="ph-subtitle">
            Pick a track, choose a chapter and topic, then work through practice questions or timed quizzes.
            Lessons (video &amp; notes) live under Academics → chapter → topic.
          </p>
        </header>

        <section className="ph-section">
          <div className="ph-section-head">
            <div className="ph-section-icon ph-section-icon--board">
              <BookOpen size={22} />
            </div>
            <div>
              <h2>Board classes</h2>
              <p>Class 9–12 standard syllabus practice</p>
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
              <p>JEE &amp; NEET chapter drills and quizzes</p>
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
  );
};

export default PracticeHub;
