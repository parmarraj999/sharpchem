import React from 'react';
import { useNavigate } from 'react-router-dom';
import './initialPopup.css';

const InitialPopup = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleNavigation = (classId, examType, type) => {
        onClose();
        if (type === 'quizzes') {
            navigate(`/class/${classId}/${examType}/quizzes`);
        } else {
            navigate(`/class/${classId}/${examType}/chapterList`);
        }
    };

    const categories = [
        { classId: '11', examType: 'jee', title: 'Class 11 (JEE)' },
        { classId: '11', examType: 'neet', title: 'Class 11 (NEET)' },
        { classId: '12', examType: 'jee', title: 'Class 12 (JEE)' },
        { classId: '12', examType: 'neet', title: 'Class 12 (NEET)' },
    ];

    return (
        <div className="initial-popup-overlay" onClick={onClose}>
            <div className="initial-popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="initial-popup-close" onClick={onClose}>&times;</button>
                <h2 className="initial-popup-title">Where would you like to start?</h2>
                <p className="initial-popup-subtitle">Select your class and goal to begin practicing.</p>

                <div className="initial-popup-grid">
                    {categories.map((cat, index) => (
                        <div key={index} className="initial-popup-card">
                            <h3 className="card-title">{cat.title}</h3>
                            <div className="card-actions">
                                <button
                                    className="action-btn quiz-btn"
                                    onClick={() => handleNavigation(cat.classId, cat.examType, 'quizzes')}
                                >
                                    Quizzes
                                </button>
                                <button
                                    className="action-btn practice-btn"
                                    onClick={() => handleNavigation(cat.classId, cat.examType, 'practice')}
                                >
                                    Practice
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InitialPopup;
