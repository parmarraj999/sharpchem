import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import "./topicPage.css"
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../firebase/firebase.config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const TopicListPage = () => {
    const { id, examType, chapterId } = useParams();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            setLoading(true);
            try {
                const classId = `${id}_${examType.toLowerCase()}`;
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

        if (id && examType && chapterId) {
            fetchTopics();
        }
    }, [id, examType, chapterId]);

    const handleStartQuestions = (topicId) => {
        navigate(`/class/${id}/${examType}/chapter/${chapterId}/topic/${topicId}/questions`);
    };

    const handleStartQuize = (topicId) => {
        navigate(`/class/${id}/${examType}/chapter/${chapterId}/topic/${topicId}/quizzes`);
    };

    const handleStartNotes = (topic) => {
        // Check for PDF/Link noteUrl first (added in Admin)
        if (topic.noteUrl) {
            window.open(topic.noteUrl, '_blank');
            return;
        }

        // Fallback to markdown notes
        if (topic.notes && (topic.notes.startsWith('http') || topic.notes.startsWith('www'))) {
            window.open(topic.notes, '_blank');
        } else {
            alert("Notes: " + (topic.notes || "No notes available."));
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const pageTitle = `Class ${id} – ${examType.toUpperCase()} – Chapter Topics`;

    return (
        <>
            <div className="topic-list-container">
                <button className="back-button" onClick={handleBack} aria-label="Go back">
                    <ArrowLeft size={24} />
                </button>

                <div className="header-section">
                    <div className="header-icon">
                        <BookOpen size={40} />
                    </div>
                    <h1 className="page-title">{pageTitle}</h1>
                </div>

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
                                        className="quize-button"
                                        onClick={() => handleStartQuize(topic.id)}
                                    >
                                        Take Quiz
                                        <span className="button-arrow">→</span>
                                    </button>
                                    <button
                                        className="notes-button"
                                        onClick={() => handleStartNotes(topic)}
                                    >
                                        Notes
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
        </>
    );
};

export default TopicListPage;