import React, { useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import "./topicPage.css"
import { useNavigate } from 'react-router-dom';

const TopicListPage = () => {
    // Simulated URL params (in real app, these would come from React Router)
    const [urlParams] = useState({
        id: '11',
        examType: 'jee',
        chapterId: '1'
    });

    // Dummy topic data
    const topics = [
        {
            id: 1,
            title: "Introduction to Mechanics",
            description: "Understand the fundamental concepts of motion, force, and energy in classical mechanics."
        },
        {
            id: 2,
            title: "Newton's Laws of Motion",
            description: "Explore the three laws that form the foundation of classical mechanics and their real-world applications."
        },
        {
            id: 3,
            title: "Work, Energy and Power",
            description: "Learn about different forms of energy, work-energy theorem, and power calculations."
        },
        {
            id: 4,
            title: "Friction and its Applications",
            description: "Study static and kinetic friction, their causes, and how they affect motion in everyday scenarios."
        },
        {
            id: 5,
            title: "Circular Motion",
            description: "Understand centripetal force, angular velocity, and the physics behind rotational movement."
        },
        {
            id: 6,
            title: "Gravitation",
            description: "Explore universal law of gravitation, gravitational potential energy, and orbital mechanics."
        }
    ];

    const navigate = useNavigate();

    const handleStartQuestions = (topicId) => {
        navigate(`/class/${urlParams.id}/${urlParams.examType}/chapter/${urlParams.chapterId}/topic/${topicId}/questions`);
    };
    const handleStartQuize = (topicId) => {
        navigate(`/class/${urlParams.id}/${urlParams.examType}/chapter/${urlParams.chapterId}/topic/${topicId}/quizes`);
    };

    const handleBack = () => {
        alert('Going back to previous page');
        // In real app: navigate(-1);
    };

    // Format the page title
    const pageTitle = `Class ${urlParams.id} – ${urlParams.examType.toUpperCase()} – Physics Chapter ${urlParams.chapterId} Topics`;

    return (
        <>
            <div className="topic-list-container">
                {/* Floating Back Button */}
                <button className="back-button" onClick={handleBack} aria-label="Go back">
                    <ArrowLeft size={24} />
                </button>

                {/* Header Section */}
                <div className="header-section">
                    <div className="header-icon">
                        <BookOpen size={40} />
                    </div>
                    <h1 className="page-title">{pageTitle}</h1>
                </div>

                {/* Topics Grid */}
                <div className="topics-grid">
                    {topics.map((topic) => (
                        <div key={topic.id} className="topic-card">
                            <h2 className="topic-title">{topic.title}</h2>
                            <p className="topic-description">{topic.description}</p>
                            <button
                                className="start-button"
                                onClick={() => handleStartQuestions(topic.id)}
                            >
                                Start Questions
                                <span className="button-arrow">→</span>
                            </button>
                            <button
                                className="quize-button"
                                onClick={() => handleStartQuize(topic.id)}
                            >
                                Quizes
                                <span className="button-arrow">→</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default TopicListPage;