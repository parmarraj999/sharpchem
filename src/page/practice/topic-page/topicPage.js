import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import "./topicPage.css"
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../firebase/firebase.config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { resolvePracticeClassId, practiceTrackLabel } from '../../../utils/practiceRoutes';

const TopicListPage = () => {
    const { id, examType, chapterId } = useParams();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    const classId = resolvePracticeClassId(id, examType);

    useEffect(() => {
        const fetchTopics = async () => {
            if (!classId || !chapterId) return;
            setLoading(true);
            try {
                const topicsRef = collection(db, 'class_data', classId, 'chapters', chapterId, 'topics');
                const q = query(topicsRef, orderBy('order', 'asc'));
                const querySnapshot = await getDocs(q);
                
                const topicsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTopics(topicsData);
            } catch (error) {
                console.error("Error fetching topics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, [classId, chapterId]);

    const handleStartQuestions = (topicId) => {
        navigate(`/class/${id}/${examType}/chapter/${chapterId}/topic/${topicId}/questions`);
    };

    const handleStartQuiz = (topicId) => {
        navigate(`/class/${id}/${examType}/chapter/${chapterId}/topic/${topicId}/quizzes`);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const pageTitle = `${practiceTrackLabel(id, examType)} – Chapter Topics`;

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
                        <p>Loading topics...</p>
                    </div>
                ) : topics.length > 0 ? (
                    <div className="topics-grid">
                        {topics.map((topic) => (
                            <div key={topic.id} className="topic-card">
                                <h2 className="topic-title">{topic.name}</h2>
                                <p className="topic-description">{topic.description || "Explore this topic for practice and assessment."}</p>
                                <div className="button-group">
                                    <button
                                        className="start-button"
                                        onClick={() => handleStartQuestions(topic.id)}
                                    >
                                        Practice Questions
                                        <span className="button-arrow">→</span>
                                    </button>
                                    <button
                                        className="quiz-button"
                                        onClick={() => handleStartQuiz(topic.id)}
                                    >
                                        Take Quiz
                                        <span className="button-arrow">→</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-topics">
                        <p>No topics found for this chapter.</p>
                    </div>
                )}
        </div>
    );
};

export default TopicListPage;