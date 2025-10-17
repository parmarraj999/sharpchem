import React, { useState } from 'react';
import './questionsPage.css';

const QuestionsPage = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Dummy questions data
  const questions = [
    {
      id: 1,
      questionText: "What is the chemical formula of water?",
      questionImage: null,
      difficulty: "Easy"
    },
    {
      id: 2,
      questionText: "Identify the functional group in the following compound:",
      questionImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
      difficulty: "Medium"
    },
    {
      id: 3,
      questionText: null,
      questionImage: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=300&fit=crop",
      difficulty: "Hard"
    },
    {
      id: 4,
      questionText: "Calculate the pH of a 0.1M HCl solution.",
      questionImage: null,
      difficulty: "Medium"
    },
    {
      id: 5,
      questionText: "Balance the following chemical equation:",
      questionImage: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=400&h=300&fit=crop",
      difficulty: "Easy"
    },
    {
      id: 6,
      questionText: "What is the IUPAC name of the compound CH₃-CH₂-CH₂-OH?",
      questionImage: null,
      difficulty: "Hard"
    }
  ];

  const handleBack = () => {
    window.history.back();
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return '#4caf50';
      case 'Medium': return '#ff9800';
      case 'Hard': return '#f44336';
      default: return '#1e88e5';
    }
  };

  return (
    <div className="question-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <button className="back-button" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <h1 className="hero-title">Chemistry Questions</h1>
          <p className="hero-subtitle">Master the fundamentals with our curated question set</p>
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-number">{questions.length}</span>
              <span className="stat-label">Questions</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Difficulty Levels</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Free</span>
            </div>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="float-circle circle-1"></div>
          <div className="float-circle circle-2"></div>
          <div className="float-circle circle-3"></div>
        </div>
      </div>

      {/* Questions Grid */}
      <section className="questions-container">
        {questions.map((question, index) => (
          <article 
            key={question.id} 
            className="question-card" 
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedQuestion(question.id)}
          >
            <div className="card-header">
              <div className="question-number">
                <span className="q-label">Q</span>
                <span className="q-num">{index + 1}</span>
              </div>
              <span 
                className="difficulty-badge" 
                style={{ backgroundColor: getDifficultyColor(question.difficulty) }}
              >
                {question.difficulty}
              </span>
            </div>
            
            <div className="question-content">
              {question.questionText && (
                <p className="question-text">{question.questionText}</p>
              )}
              
              {question.questionImage && (
                <div className="question-image-container">
                  <img 
                    src={question.questionImage} 
                    alt={`Question ${index + 1}`}
                    className="question-image"
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <div className="card-footer">
              <button className="action-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
                Attempt
              </button>
              <button className="icon-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                </svg>
              </button>
              <button className="icon-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1"/>
                  <circle cx="12" cy="5" r="1"/>
                  <circle cx="12" cy="19" r="1"/>
                </svg>
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Floating Action Button */}
      <button className="fab">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18"/>
        </svg>
      </button>
    </div>
  );
};

export default QuestionsPage;