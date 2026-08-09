import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Download, Target, FileText } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.config';
import {
  resolvePracticeClassId,
  practiceQuestionsPath,
  academicsChapterPath,
  parseFirestoreClassId,
} from '../../utils/practiceRoutes';
import './topicLesson.css';

const isProbablyPdf = (url) => /\.pdf(\?|#|$)/i.test(url) || /application%2Fpdf/i.test(url);
const isProbablyImage = (url) => /\.(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(url);

const getEmbedUrl = (url) => {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
  } else if (url.includes('v=')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  } else if (url.includes('embed/')) {
    videoId = url.split('embed/')[1]?.split(/[?&]/)[0];
  } else {
    return url;
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

const TopicLessonPage = () => {
  const { id, examType, chapterId, topicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const firestoreClassId = useMemo(
    () => resolvePracticeClassId(id, examType) || location.state?.classId || null,
    [id, examType, location.state?.classId]
  );

  const [topic, setTopic] = useState(
    location.state?.topic && location.state.topic.id === topicId
      ? location.state.topic
      : null
  );
  const [loading, setLoading] = useState(!topic);

  useEffect(() => {
    let cancelled = false;

    const fetchTopic = async () => {
      if (!firestoreClassId || !chapterId || !topicId) {
        setLoading(false);
        setTopic(null);
        return;
      }

      setLoading(true);
      try {
        const topicRef = doc(
          db,
          'class_data',
          firestoreClassId,
          'chapters',
          chapterId,
          'topics',
          topicId
        );
        const snap = await getDoc(topicRef);
        if (!cancelled) {
          setTopic(snap.exists() ? { id: snap.id, ...snap.data() } : null);
        }
      } catch (error) {
        console.error('Error fetching topic lesson:', error);
        if (!cancelled) setTopic(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTopic();
    return () => { cancelled = true; };
  }, [firestoreClassId, chapterId, topicId]);

  const handleBack = () => {
    const track =
      id && examType
        ? { id, examType }
        : parseFirestoreClassId(firestoreClassId);
    if (track) {
      navigate(academicsChapterPath(track.id, track.examType, chapterId));
      return;
    }
    navigate('/academic');
  };

  const handlePractice = () => {
    if (!id || !examType || !chapterId) return;
    navigate(practiceQuestionsPath(id, examType, chapterId));
  };

  if (loading) {
    return (
      <div className="topic-lesson-page">
        <div className="topic-lesson-inner">
          <p className="topic-lesson-loading">Loading topic...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="topic-lesson-page">
        <div className="topic-lesson-inner">
          <p className="topic-lesson-loading">Topic not found.</p>
          <button type="button" className="topic-lesson-back-inline" onClick={handleBack}>
            Back to chapter
          </button>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(topic.videoUrl);
  const noteUrl = topic.noteUrl || '';

  return (
    <div className="topic-lesson-page">
      <div className="topic-lesson-inner">
        <header className="topic-lesson-header">
          <button type="button" className="topic-lesson-back" onClick={handleBack} aria-label="Back to chapter">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="topic-lesson-title">{topic.name}</h1>
            {topic.description && (
              <p className="topic-lesson-desc">{topic.description}</p>
            )}
          </div>
        </header>

        <section className="topic-lesson-section">
          <h2 className="topic-lesson-section-title">Video Lesson</h2>
          {embedUrl ? (
            <div className="topic-lesson-video">
              <iframe
                src={embedUrl}
                title={topic.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="topic-lesson-empty">
              <p>No video uploaded for this topic yet.</p>
            </div>
          )}
        </section>

        <section className="topic-lesson-section">
          <h2 className="topic-lesson-section-title">Notes</h2>
          {noteUrl ? (
            <div className="topic-lesson-notes">
              <div className="topic-lesson-notes-copy">
                <p className="topic-lesson-notes-title">
                  <FileText size={18} /> Topic notes available
                </p>
                <p className="topic-lesson-notes-sub">Open or download the PDF / image for this topic.</p>
              </div>
              <a
                className="topic-lesson-notes-btn"
                href={noteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={18} />
                Open Notes
              </a>
              {isProbablyPdf(noteUrl) && (
                <iframe className="topic-lesson-notes-frame" title={`${topic.name} notes`} src={noteUrl} />
              )}
              {isProbablyImage(noteUrl) && (
                <img className="topic-lesson-notes-image" src={noteUrl} alt={`${topic.name} notes`} />
              )}
            </div>
          ) : (
            <div className="topic-lesson-empty">
              <p>No notes uploaded for this topic yet.</p>
            </div>
          )}
        </section>

        <section className="topic-lesson-practice">
          <div>
            <h2 className="topic-lesson-section-title">Practice</h2>
            <p className="topic-lesson-notes-sub">
              Try practice questions for this topic when you are ready.
            </p>
          </div>
          <button type="button" className="topic-lesson-practice-btn" onClick={handlePractice}>
            <Target size={18} />
            Practice questions
          </button>
        </section>
      </div>
    </div>
  );
};

export default TopicLessonPage;
