import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, HelpCircle, ChevronRight } from 'lucide-react';
import './quizListPage.css';

const QuizListPage = () => {
    const { id, examType, chapterId, topicId } = useParams();
    const navigate = useNavigate();

    // Dummy quizzes data
    const quizzes = [
        {
            id: '1',
            title: "Physics Fundamentals Quiz",
            questions: 10,
            duration: "15 mins",
            difficulty: "Easy",
            attempts: 1240
        },
        {
            id: '2',
            title: "Advanced Mechanics Quiz",
            questions: 15,
            duration: "25 mins",
            difficulty: "Medium",
            attempts: 856
        },
        {
            id: '3',
            title: "Final Assessment",
            questions: 20,
            duration: "40 mins",
            difficulty: "Hard",
            attempts: 423
        }
    ];

    const handleBack = () => {
        navigate(-1);
    };

    const handleStartQuiz = (quizId) => {
        navigate(`/class/${id}/${examType}/chapter/${chapterId}/topic/${topicId}/quiz/${quizId}`);
    };

    return (
        <div className="quiz-list-page">
            <div className="quiz-list-container">
                {/* Floating Back Button */}
                <button className="back-button" onClick={handleBack} aria-label="Go back">
                    <ArrowLeft size={24} />
                </button>

                {/* Header Section */}
                <div className="header-section">
                    <div className="header-icon">
                        <BookOpen size={40} />
                    </div>
                    <div className="header-text">
                        <h1 className="page-title">Available Quizzes</h1>
                        <p className="page-subtitle">Class {id} • {examType.toUpperCase()} • Topic {topicId}</p>
                    </div>
                </div>

                <div className="quiz-grid">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="quiz-card" onClick={() => handleStartQuiz(quiz.id)}>
                            <div className="quiz-card-content">
                                <div className="quiz-info-main">
                                    <h2 className="quiz-name">{quiz.title}</h2>
                                    <div className="quiz-tags">
                                        <span className={`difficulty-tag ${quiz.difficulty.toLowerCase()}`}>
                                            {quiz.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <div className="quiz-meta-grid">
                                    <div className="meta-item">
                                        <HelpCircle size={16} />
                                        <span>{quiz.questions} Questions</span>
                                    </div>
                                    <div className="meta-item">
                                        <Clock size={16} />
                                        <span>{quiz.duration}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="quiz-card-footer">
                                <span className="attempts-text">{quiz.attempts} students attempted</span>
                                <button className="start-quiz-btn">
                                    Start Quiz
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuizListPage;
