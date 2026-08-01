import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, HelpCircle, ChevronRight } from 'lucide-react';
import './quizListPage.css';
import { db } from '../../../firebase/firebase.config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { resolvePracticeClassId } from '../../../utils/practiceRoutes';

const QuizListPage = () => {
    const { id, examType, chapterId, topicId } = useParams();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    const classId = resolvePracticeClassId(id, examType);

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!classId || !chapterId || !topicId) return;
            setLoading(true);
            try {
                const quizzesRef = collection(db, 'quizzes');
                const q = query(
                    quizzesRef, 
                    where('classId', '==', classId),
                    where('chapterId', '==', chapterId),
                    where('topicId', '==', topicId)
                );
                const querySnapshot = await getDocs(q);
                
                const quizzesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setQuizzes(quizzesData);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [classId, chapterId, topicId]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleStartQuiz = (quizId) => {
        navigate(`/class/${id}/${examType}/chapter/${chapterId}/topic/${topicId}/quiz/${quizId}`);
    };

    return (
        <div className="quiz-list-page">
            <div className="quiz-list-container">
                <header className="quiz-list-header">
                    <button type="button" className="quiz-list-back" onClick={handleBack} aria-label="Go back">
                        <ArrowLeft size={22} />
                    </button>
                    <div className="header-text">
                        <h1 className="page-title">Available Quizzes</h1>
                        <p className="page-subtitle">Class {id} • {examType.toUpperCase()} • {quizzes.length} Quizzes Found</p>
                    </div>
                </header>

                {loading ? (
                    <div className="loading-container">
                        <p>Loading quizzes...</p>
                    </div>
                ) : quizzes.length > 0 ? (
                    <div className="quiz-grid">
                        {quizzes.map((quiz) => (
                            <div key={quiz.id} className="quiz-card" onClick={() => handleStartQuiz(quiz.id)}>
                                <div className="quiz-card-content">
                                    <div className="quiz-info-main">
                                        <h2 className="quiz-name">{quiz.title}</h2>
                                        <div className="quiz-tags">
                                            {quiz.examType && (
                                                <span className="difficulty-tag easy">
                                                    {quiz.examType}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="quiz-meta-grid">
                                        <div className="meta-item">
                                            <HelpCircle size={16} />
                                            <span>Assessment</span>
                                        </div>
                                        <div className="meta-item">
                                            <Clock size={16} />
                                            <span>{quiz.duration} mins</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="quiz-card-footer">
                                    <span className="attempts-text">Ready to test your knowledge?</span>
                                    <button className="start-quiz-btn">
                                        Start Quiz
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-quizzes">
                        <p>No quizzes available for this topic yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizListPage;
