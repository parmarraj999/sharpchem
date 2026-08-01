import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, Award } from 'lucide-react';
import './quizPage.css'
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../firebase/firebase.config';
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';

const QuizPage = () => {
  const { examType, quizId } = useParams();
  const navigate = useNavigate();
  
  const [quizMetadata, setQuizMetadata] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      try {
        // Fetch Metadata
        const quizRef = doc(db, 'quizzes', quizId);
        const quizSnap = await getDoc(quizRef);
        
        if (quizSnap.exists()) {
          const meta = quizSnap.data();
          setQuizMetadata(meta);
          if (meta.duration) {
            setTimeLeft(parseInt(meta.duration) * 60);
          } else {
            setTimeLeft(900); // Default 15 mins
          }
        }

        // Fetch Questions
        const questionsRef = collection(db, 'quizzes', quizId, 'questions');
        const q = query(questionsRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        
        const questionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionsData);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuizData();
    }
  }, [quizId]);

  // Timer countdown
  useEffect(() => {
    if (showResults || loading || !timeLeft) return;

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
  }, [showResults, loading, timeLeft]);

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
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    if (quizMetadata?.duration) {
        setTimeLeft(parseInt(quizMetadata.duration) * 60);
    } else {
        setTimeLeft(900);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="loading-container"><p>Loading quiz questions...</p></div>;
  if (questions.length === 0) return <div className="error-container"><p>No questions found for this quiz.</p></div>;

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;
  const pageTitle = `${quizMetadata?.title || 'Quiz'} - ${examType?.toUpperCase()}`;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="header-top">
          <button className="quiz-back-button" onClick={handleBack}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="quiz-title">{pageTitle}</h1>
          <div className="timer">
            <Clock size={18} />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <div className="progress-info">
          <span>Answered: {Object.keys(selectedAnswers).length}/{questions.length}</span>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}
            />
          </div>
          <span>{Math.round((Object.keys(selectedAnswers).length / questions.length) * 100)}%</span>
        </div>
      </div>

      {showResults && (
        <div className="results-summary">
          <div className={`results-icon ${calculateScore() >= questions.length * 0.6 ? 'success-icon' : 'fail-icon'}`}>
            {calculateScore() >= questions.length * 0.6 ? <CheckCircle size={40} /> : <Award size={40} />}
          </div>
          <h2 className="results-title">
            {calculateScore() >= questions.length * 0.6 ? 'Great Job!' : 'Keep Learning!'}
          </h2>
          <div className="results-score">
            {Math.round((calculateScore() / questions.length) * 100)}%
          </div>
          <div className="results-details">
            <div className="detail-item">
              <div className="detail-label">Correct</div>
              <div className="detail-value" style={{ color: '#4caf50' }}>{calculateScore()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Incorrect</div>
              <div className="detail-value" style={{ color: '#f44336' }}>{questions.length - calculateScore()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Total</div>
              <div className="detail-value">{questions.length}</div>
            </div>
          </div>
          <button className="retake-btn" onClick={handleRetakeQuiz}>Retake Quiz</button>
        </div>
      )}

      <div className="questions-list">
        {questions.map((question, index) => {
          const isCorrect = showResults && selectedAnswers[index] === question.correctAnswer;
          const isIncorrect = showResults && selectedAnswers[index] && selectedAnswers[index] !== question.correctAnswer;

          return (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <div className="question-number">Question {index + 1}</div>
                {showResults && (
                  <div className={`result-badge ${isCorrect ? 'correct-badge' : isIncorrect ? 'incorrect-badge' : ''}`}>
                    {isCorrect ? 'Correct' : isIncorrect ? 'Incorrect' : 'Not Answered'}
                  </div>
                )}
              </div>
              <div className="question-content">
                <div className="question-text">{question.questionText}</div>
                {question.questionImage && <img src={question.questionImage} alt="Question" className="question-image" />}
              </div>
              <div className="options-container">
                {question.options?.map((option, optIdx) => {
                  const optionId = option.id || String.fromCharCode(97 + optIdx); // fallback to a, b, c, d
                  const isSelected = selectedAnswers[index] === optionId;
                  const isCorrectOption = showResults && optionId === question.correctAnswer;
                  const isWrongSelection = showResults && isSelected && optionId !== question.correctAnswer;

                  return (
                    <div
                      key={optionId}
                      className={`option ${isSelected ? 'selected' : ''} ${isCorrectOption ? 'correct' : ''} ${isWrongSelection ? 'incorrect' : ''} ${showResults ? 'disabled' : ''}`}
                      onClick={() => handleOptionSelect(index, optionId)}
                    >
                      <div className="option-label">{optionId.toUpperCase()}</div>
                      <div className="option-content">
                        <div className="option-text">{option.text}</div>
                        {option.image && <img src={option.image} alt="Option" className="option-image" />}
                      </div>
                    </div>
                  );
                })}
              </div>
              {showResults && (
                <div className="explanation">
                  <div className="explanation-title"><Award size={18} /> Explanation</div>
                  <div className="explanation-text">{question.explanation || "No explanation provided."}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showResults && (
        <div className="submit-section">
          <div className={`submit-info ${allAnswered ? 'complete' : ''}`}>
            {allAnswered ? '✓ All questions answered!' : `Please answer all questions (${Object.keys(selectedAnswers).length}/${questions.length})`}
          </div>
          <button className="submit-btn" onClick={handleSubmitQuiz} disabled={!allAnswered}>Submit Quiz</button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;