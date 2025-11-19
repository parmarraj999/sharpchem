import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Award } from 'lucide-react';
import './quizePage.css'
import { useNavigate } from 'react-router-dom';

const QuizePage = () => {
  // Simulated URL params
  const [urlParams] = useState({
    id: '12',
    examType: 'jee',
    chapterId: '3',
    topicId: '5',
    quizId: '1'
  });

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  // Dummy quiz data
  const quizData = {
    title: "Physics Quiz 1",
    subject: "Physics",
    questions: [
      {
        id: 1,
        questionText: "What is Newton's Second Law of Motion?",
        questionImage: null,
        options: [
          { id: 'a', text: "F = ma", image: null },
          { id: 'b', text: "E = mc²", image: null },
          { id: 'c', text: "P = mv", image: null },
          { id: 'd', text: "W = Fd", image: null }
        ],
        correctAnswer: 'a',
        explanation: "Newton's Second Law states that Force equals mass times acceleration (F = ma). This fundamental law describes the relationship between force, mass, and acceleration."
      },
      {
        id: 2,
        questionText: "Identify the circuit diagram type shown below:",
        questionImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=300&fit=crop",
        options: [
          { id: 'a', text: "Series Circuit", image: null },
          { id: 'b', text: "Parallel Circuit", image: null },
          { id: 'c', text: "Series-Parallel Circuit", image: null },
          { id: 'd', text: "Bridge Circuit", image: null }
        ],
        correctAnswer: 'b',
        explanation: "This is a Parallel Circuit where components are connected across common points, providing multiple paths for current flow. Each component receives the full voltage."
      },
      {
        id: 3,
        questionText: "Which of the following waveforms represents a sine wave?",
        questionImage: null,
        options: [
          { id: 'a', text: "Wave A", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop" },
          { id: 'b', text: "Wave B", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=200&fit=crop" },
          { id: 'c', text: "Wave C", image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=300&h=200&fit=crop" },
          { id: 'd', text: "Wave D", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop" }
        ],
        correctAnswer: 'a',
        explanation: "Wave A shows a smooth, continuous oscillation characteristic of a sine wave. Sine waves are fundamental in physics and represent simple harmonic motion."
      },
      {
        id: 4,
        questionText: "What is the unit of electric potential?",
        questionImage: null,
        options: [
          { id: 'a', text: "Ampere (A)", image: null },
          { id: 'b', text: "Volt (V)", image: null },
          { id: 'c', text: "Ohm (Ω)", image: null },
          { id: 'd', text: "Watt (W)", image: null }
        ],
        correctAnswer: 'b',
        explanation: "The Volt (V) is the unit of electric potential. It represents the potential difference that will drive one ampere of current against one ohm of resistance."
      },
      {
        id: 5,
        questionText: "Calculate the equivalent resistance for the circuit shown:",
        questionImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&h=300&fit=crop",
        options: [
          { id: 'a', text: "10 Ω", image: null },
          { id: 'b', text: "15 Ω", image: null },
          { id: 'c', text: "20 Ω", image: null },
          { id: 'd', text: "25 Ω", image: null }
        ],
        correctAnswer: 'c',
        explanation: "The equivalent resistance is 20 Ω. For series resistors, add the values directly. For parallel resistors, use the formula 1/Req = 1/R1 + 1/R2 + ..."
      },
      {
        id: 6,
        questionText: "What is the speed of light in vacuum?",
        questionImage: null,
        options: [
          { id: 'a', text: "3 × 10⁸ m/s", image: null },
          { id: 'b', text: "3 × 10⁶ m/s", image: null },
          { id: 'c', text: "3 × 10¹⁰ m/s", image: null },
          { id: 'd', text: "3 × 10⁵ m/s", image: null }
        ],
        correctAnswer: 'a',
        explanation: "The speed of light in vacuum is approximately 3 × 10⁸ meters per second (or 300,000 km/s). This is a fundamental constant in physics."
      }
    ]
  };

  // Timer countdown
  useEffect(() => {
    if (showResults) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (questionIndex, optionId) => {
    if (!showResults) {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionIndex]: optionId
      });
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setTimeLeft(900);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allAnswered = Object.keys(selectedAnswers).length === quizData.questions.length;
  const pageTitle = `Class ${urlParams.id} – ${urlParams.examType.toUpperCase()} – ${quizData.subject} Quiz ${urlParams.quizId}`;

  return (
    <>
      <div className="quiz-container">
        {/* Sticky Header */}
        <div className="quiz-header">
          <div className="header-top">
            <button className="quize-back-button" onClick={handleBack}>
              <ArrowLeft size={20} />
            </button>
            <h1 className="quiz-title">{pageTitle}</h1>
            {/* <div className="timer">
              <Clock size={18} />
              {formatTime(timeLeft)}
            </div> */}
          </div>
          <div className="progress-info">
            <span>Answered: {Object.keys(selectedAnswers).length}/{quizData.questions.length}</span>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${(Object.keys(selectedAnswers).length / quizData.questions.length) * 100}%` }} 
              />
            </div>
            <span>{Math.round((Object.keys(selectedAnswers).length / quizData.questions.length) * 100)}%</span>
          </div>
        </div>

        {/* Results Summary (shown after submit) */}
        {showResults && (
          <div className="results-summary">
            <div className={`results-icon ${calculateScore() >= quizData.questions.length * 0.6 ? 'success-icon' : 'fail-icon'}`}>
              {calculateScore() >= quizData.questions.length * 0.6 ? 
                <CheckCircle size={40} /> : 
                <Award size={40} />
              }
            </div>
            
            <h2 className="results-title">
              {calculateScore() >= quizData.questions.length * 0.6 ? 'Great Job!' : 'Keep Learning!'}
            </h2>
            
            <div className="results-score">
              {Math.round((calculateScore() / quizData.questions.length) * 100)}%
            </div>

            <div className="results-details">
              <div className="detail-item">
                <div className="detail-label">Correct</div>
                <div className="detail-value" style={{ color: '#4caf50' }}>{calculateScore()}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Incorrect</div>
                <div className="detail-value" style={{ color: '#f44336' }}>
                  {quizData.questions.length - calculateScore()}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Total</div>
                <div className="detail-value">{quizData.questions.length}</div>
              </div>
            </div>

            <button className="retake-btn" onClick={handleRetakeQuiz}>
              Retake Quiz
            </button>
          </div>
        )}

        {/* All Questions List */}
        <div className="questions-list">
          {quizData.questions.map((question, index) => {
            const isCorrect = showResults && selectedAnswers[index] === question.correctAnswer;
            const isIncorrect = showResults && selectedAnswers[index] && selectedAnswers[index] !== question.correctAnswer;
            
            return (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <div className="question-number">
                    Question {index + 1}
                  </div>
                  {showResults && (
                    <div className={`result-badge ${isCorrect ? 'correct-badge' : isIncorrect ? 'incorrect-badge' : ''}`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle size={16} />
                          Correct
                        </>
                      ) : isIncorrect ? (
                        <>
                          <XCircle size={16} />
                          Incorrect
                        </>
                      ) : (
                        'Not Answered'
                      )}
                    </div>
                  )}
                </div>

                <div className="question-content">
                  <div className="question-text">{question.questionText}</div>
                  {question.questionImage && (
                    <img 
                      src={question.questionImage} 
                      alt="Question" 
                      className="question-image"
                    />
                  )}
                </div>

                {/* Options */}
                <div className="options-container">
                  {question.options.map((option) => {
                    const isSelected = selectedAnswers[index] === option.id;
                    const isCorrectOption = showResults && option.id === question.correctAnswer;
                    const isWrongSelection = showResults && isSelected && option.id !== question.correctAnswer;
                    
                    return (
                      <div
                        key={option.id}
                        className={`option ${isSelected ? 'selected' : ''} ${isCorrectOption ? 'correct' : ''} ${isWrongSelection ? 'incorrect' : ''} ${showResults ? 'disabled' : ''}`}
                        onClick={() => handleOptionSelect(index, option.id)}
                      >
                        <div className="option-label">{option.id.toUpperCase()}</div>
                        <div className="option-content">
                          <div className="option-text">{option.text}</div>
                          {option.image && (
                            <img 
                              src={option.image} 
                              alt={`Option ${option.id}`} 
                              className="option-image"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Show Explanation after submit */}
                {showResults && (
                  <div className="explanation">
                    <div className="explanation-title">
                      <Award size={18} />
                      Explanation
                    </div>
                    <div className="explanation-text">{question.explanation}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Section (sticky at bottom) */}
        {!showResults && (
          <div className="submit-section">
            <div className={`submit-info ${allAnswered ? 'complete' : ''}`}>
              {allAnswered ? 
                '✓ All questions answered! Ready to submit.' : 
                `Please answer all questions (${Object.keys(selectedAnswers).length}/${quizData.questions.length})`
              }
            </div>
            <button 
              className="submit-btn"
              onClick={handleSubmitQuiz}
              disabled={!allAnswered}
            >
              Submit Quiz
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizePage;