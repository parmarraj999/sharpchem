import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, HelpCircle, ChevronRight } from 'lucide-react';
import './quizListPage.css';
import { db } from '../../../firebase/firebase.config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { resolvePracticeClassId, practiceQuizPath } from '../../../utils/practiceRoutes';
import { useAuth } from '../../../context/AuthContext';
import { fetchLatestAttemptsByQuizIds } from '../../../utils/quizAttempts';

const QuizListPage = () => {
    const { id, examType, chapterId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [latestByQuiz, setLatestByQuiz] = useState({});
    const [loading, setLoading] = useState(true);

    const classId = useMemo(
        () => resolvePracticeClassId(id, examType),
        [id, examType]
    );

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (!classId || !chapterId) return;
            setLoading(true);
            try {
                const quizzesRef = collection(db, 'quizzes');
                const q = query(
                    quizzesRef,
                    where('classId', '==', classId),
                    where('chapterId', '==', chapterId)
                );
                const querySnapshot = await getDocs(q);

                const quizzesData = querySnapshot.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                }));
                setQuizzes(quizzesData);

                if (currentUser?.uid && quizzesData.length) {
                    const latest = await fetchLatestAttemptsByQuizIds(
                        currentUser.uid,
                        quizzesData.map((quiz) => quiz.id)
                    );
                    setLatestByQuiz(latest);
                } else {
                    setLatestByQuiz({});
                }
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [classId, chapterId, currentUser?.uid]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleStartQuiz = (quizId) => {
        navigate(practiceQuizPath(id, examType, chapterId, quizId));
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
                        <p className="page-subtitle">
                            Class {id} • {examType.toUpperCase()} • {quizzes.length} Quizzes Found
                        </p>
                    </div>
                </header>

                {loading ? (
                    <div className="loading-container">
                        <p>Loading quizzes...</p>
                    </div>
                ) : quizzes.length > 0 ? (
                    <div className="quiz-grid">
                        {quizzes.map((quiz) => {
                            const last = latestByQuiz[quiz.id];
                            return (
                                <div
                                    key={quiz.id}
                                    className="quiz-card"
                                    onClick={() => handleStartQuiz(quiz.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') handleStartQuiz(quiz.id);
                                    }}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="quiz-card-content">
                                        <div className="quiz-info-main">
                                            <h2 className="quiz-name">{quiz.title}</h2>
                                            <div className="quiz-tags">
                                                {quiz.examType && (
                                                    <span className="difficulty-tag easy">{quiz.examType}</span>
                                                )}
                                                {last && (
                                                    <span className="difficulty-tag last-score">
                                                        Last: {last.percent}%
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
                                        <span className="attempts-text">
                                            {last
                                                ? `Last score: ${last.percent}%`
                                                : 'Ready to test your knowledge?'}
                                        </span>
                                        <button type="button" className="start-quiz-btn">
                                            {last ? 'Retake Quiz' : 'Start Quiz'}
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="no-quizzes">
                        <p>No quizzes available for this chapter yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizListPage;
