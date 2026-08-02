import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Target, BookOpen, Video, FileText, ChevronRight } from 'lucide-react';
import './chapterDetail.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../../firebase/firebase.config';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import {
  resolvePracticeClassId,
  practiceTopicsPathFromFirestore,
  academicsClassPath,
  academicsLessonPath,
  parseFirestoreClassId,
} from '../../utils/practiceRoutes';

const ChapterDetailPage = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // /class/:id/:examType/chapter/:chapterId  OR legacy /chapter/:id
  const routeId = params.id;
  const examType = params.examType;
  const paramChapterId = params.chapterId;
  const effectiveChapterId = paramChapterId || (!examType ? routeId : null);

  const firestoreClassId = useMemo(() => {
    if (routeId && examType) return resolvePracticeClassId(routeId, examType);
    return location.state?.classId || null;
  }, [routeId, examType, location.state?.classId]);

  const [chapter, setChapter] = useState(
    location.state?.chapter && location.state.chapter.id === effectiveChapterId
      ? location.state.chapter
      : null
  );
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchChapterAndTopics = async () => {
      if (!firestoreClassId || !effectiveChapterId) {
        setLoading(false);
        setChapter(null);
        setTopics([]);
        return;
      }

      setLoading(true);
      try {
        const chapterRef = doc(db, 'class_data', firestoreClassId, 'chapters', effectiveChapterId);
        const docSnap = await getDoc(chapterRef);

        let chapterData = null;
        if (docSnap.exists()) {
          chapterData = { id: docSnap.id, ...docSnap.data() };
        }

        const topicsSnap = await getDocs(
          query(
            collection(db, 'class_data', firestoreClassId, 'chapters', effectiveChapterId, 'topics'),
            orderBy('order', 'asc')
          )
        );
        const topicsData = topicsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        if (!cancelled) {
          setChapter(chapterData);
          setTopics(topicsData);
        }
      } catch (error) {
        console.error('Error fetching chapter detail:', error);
        if (!cancelled) {
          setChapter(null);
          setTopics([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchChapterAndTopics();
    return () => { cancelled = true; };
  }, [firestoreClassId, effectiveChapterId]);

  const handleBackClick = () => {
    if (routeId && examType) {
      navigate(academicsClassPath({ id: routeId, examType }));
      return;
    }
    if (firestoreClassId) {
      navigate(academicsClassPath(firestoreClassId));
      return;
    }
    navigate('/academic');
  };

  const handleOpenTopic = (topic) => {
    const track =
      routeId && examType
        ? { id: routeId, examType }
        : parseFirestoreClassId(firestoreClassId);

    if (!track) {
      navigate('/academic');
      return;
    }

    navigate(academicsLessonPath(track.id, track.examType, effectiveChapterId, topic.id), {
      state: { topic, chapter, classId: firestoreClassId },
    });
  };

  const handlePracticeChapter = () => {
    const path = practiceTopicsPathFromFirestore(firestoreClassId, effectiveChapterId);
    if (path) navigate(path);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading chapter details...</p>
      </div>
    );
  }
  if (!firestoreClassId || !effectiveChapterId) {
    return (
      <div className="error-container">
        <p>Missing class or chapter in the URL.</p>
        <button className="download-button" type="button" onClick={() => navigate('/academic')}>
          Go to Academics
        </button>
      </div>
    );
  }
  if (!chapter) {
    return (
      <div className="error-container">
        <p>Chapter not found.</p>
      </div>
    );
  }

  const practicePath = practiceTopicsPathFromFirestore(firestoreClassId, effectiveChapterId);

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

          <section className="section">
            <h2 className="section-title">Topics</h2>
            <p className="topics-intro">
              Open a topic for its video lesson and notes. Practice questions stay under Practice.
            </p>

            {topics.length === 0 ? (
              <div className="notes-container notes-container--empty">
                <div className="notes-info">
                  <p className="notes-text">No topics yet</p>
                  <p className="notes-subtext">Topics added in admin for this chapter will appear here.</p>
                </div>
              </div>
            ) : (
              <div className="chapter-topics-list">
                {topics.map((topic, index) => (
                  <button
                    key={topic.id}
                    type="button"
                    className="chapter-topic-row"
                    onClick={() => handleOpenTopic(topic)}
                  >
                    <span className="chapter-topic-index">{index + 1}</span>
                    <span className="chapter-topic-body">
                      <span className="chapter-topic-name">{topic.name}</span>
                      {topic.description && (
                        <span className="chapter-topic-desc">{topic.description}</span>
                      )}
                      <span className="chapter-topic-meta">
                        {topic.videoUrl && (
                          <span className="chapter-topic-tag">
                            <Video size={14} /> Video
                          </span>
                        )}
                        {topic.noteUrl && (
                          <span className="chapter-topic-tag">
                            <FileText size={14} /> Notes
                          </span>
                        )}
                        {!topic.videoUrl && !topic.noteUrl && (
                          <span className="chapter-topic-tag chapter-topic-tag--muted">
                            <BookOpen size={14} /> Lesson
                          </span>
                        )}
                      </span>
                    </span>
                    <ChevronRight size={20} className="chapter-topic-chevron" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {practicePath && (
            <section className="section practice-cta-section">
              <h2 className="section-title">Practice this chapter</h2>
              <div className="practice-cta-box">
                <div className="practice-cta-copy">
                  <p className="notes-text">Ready to test yourself?</p>
                  <p className="notes-subtext">
                    Drill practice questions and quizzes for topics in this chapter.
                  </p>
                </div>
                <button type="button" className="practice-chapter-button" onClick={handlePracticeChapter}>
                  <Target size={20} />
                  Practice this chapter
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterDetailPage;
