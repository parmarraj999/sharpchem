import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import "./topicPage.css"
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../firebase/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import {
    resolvePracticeClassId,
    practiceTrackLabel,
    practiceQuestionsPath,
    practiceQuizListPath,
} from '../../../utils/practiceRoutes';

/** Chapter practice hub — questions & quizzes are chapter-scoped (not per topic). */
const TopicListPage = () => {
    const { id, examType, chapterId } = useParams();
    const navigate = useNavigate();
    const [chapterName, setChapterName] = useState('');
    const [loading, setLoading] = useState(true);

    const classId = resolvePracticeClassId(id, examType);

    useEffect(() => {
        const fetchChapter = async () => {
            if (!classId || !chapterId) return;
            setLoading(true);
            try {
                const snap = await getDoc(doc(db, 'class_data', classId, 'chapters', chapterId));
                setChapterName(snap.exists() ? snap.data().name || '' : '');
            } catch (error) {
                console.error("Error fetching chapter:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChapter();
    }, [classId, chapterId]);

    const handleBack = () => {
        navigate(`/class/${id}/${examType}/chapterList`);
    };

    const pageTitle = chapterName
        ? `${chapterName} – Practice`
        : `${practiceTrackLabel(id, examType)} – Practice`;

    return (
        <div className="topic-list-container">
            <header className="topic-page-header">
                <button type="button" className="topic-back-button" onClick={handleBack} aria-label="Go back">
                    <ArrowLeft size={22} />
                </button>
                <div className="topic-page-header-text">
                    <h1 className="page-title">{pageTitle}</h1>
                    <p className="page-subtitle">
                        Practice questions and quizzes for this chapter. Lessons and notes are under Academics.
                    </p>
                </div>
            </header>

            {loading ? (
                <div className="loading-container">
                    <p>Loading…</p>
                </div>
            ) : (
                <div className="topics-grid">
                    <div className="topic-card">
                        <h2 className="topic-title">Practice Questions</h2>
                        <p className="topic-description">
                            Drill chapter questions with instant feedback.
                        </p>
                        <div className="button-group">
                            <button
                                type="button"
                                className="start-button"
                                onClick={() => navigate(practiceQuestionsPath(id, examType, chapterId))}
                            >
                                Start Questions
                                <span className="button-arrow">→</span>
                            </button>
                        </div>
                    </div>
                    <div className="topic-card">
                        <h2 className="topic-title">Quizzes</h2>
                        <p className="topic-description">
                            Timed chapter quizzes to check your understanding.
                        </p>
                        <div className="button-group">
                            <button
                                type="button"
                                className="quiz-button"
                                onClick={() => navigate(practiceQuizListPath(id, examType, chapterId))}
                            >
                                Take Quiz
                                <span className="button-arrow">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopicListPage;
