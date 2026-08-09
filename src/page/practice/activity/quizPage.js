import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ArrowLeft, Clock, CheckCircle, Award } from 'lucide-react';
import './quizPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../firebase/firebase.config';
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { resolvePracticeClassId } from '../../../utils/practiceRoutes';
import { saveQuizAttempt } from '../../../utils/quizAttempts';

const QuizPage = () => {
  const { id, examType, chapterId, topicId, quizId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const classId = useMemo(
    () => resolvePracticeClassId(id, examType),
    [id, examType]
  );

  const [quizMetadata, setQuizMetadata] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [saveError, setSaveError] = useState('');
  const [savingAttempt, setSavingAttempt] = useState(false);

  const startedAtRef = useRef(Date.now());
  const timeLimitSecRef = useRef(900);
  const submittedRef = useRef(false);
  const selectedAnswersRef = useRef({});
  const questionsRef = useRef([]);
  const quizMetaRef = useRef(null);

  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    quizMetaRef.current = quizMetadata;
  }, [quizMetadata]);

  const resetAttemptState = useCallback((durationMinutes) => {
    submittedRef.current = false;
    startedAtRef.current = Date.now();
    const limit = (durationMinutes ? parseInt(durationMinutes, 10) : 15) * 60;
    timeLimitSecRef.current = limit;
    setTimeLeft(limit);
    setSelectedAnswers({});
    setShowResults(false);
    setSaveError('');
  }, []);

  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      submittedRef.current = false;
      try {
        const quizRef = doc(db, 'quizzes', quizId);
        const quizSnap = await getDoc(quizRef);

        let duration = 15;
        if (quizSnap.exists()) {
          const meta = quizSnap.data();
          setQuizMetadata(meta);
          quizMetaRef.current = meta;
          if (meta.duration) duration = parseInt(meta.duration, 10);
        }

        const questionsRefPath = collection(db, 'quizzes', quizId, 'questions');
        const q = query(questionsRefPath, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const questionsData = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setQuestions(questionsData);
        questionsRef.current = questionsData;
        resetAttemptState(duration);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) fetchQuizData();
  }, [quizId, resetAttemptState]);

  const calculateScoreFrom = (answers, qs) => {
    let correct = 0;
    qs.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) correct += 1;
    });
    return correct;
  };

  const persistAttempt = useCallback(
    async (status) => {
      const qs = questionsRef.current;
      const answers = selectedAnswersRef.current;
      const meta = quizMetaRef.current;
      if (!currentUser?.uid || !qs.length) return;

      const score = calculateScoreFrom(answers, qs);
      const answersByQuestionId = {};
      qs.forEach((question, index) => {
        if (answers[index] != null) {
          answersByQuestionId[question.id] = answers[index];
        }
      });

      const durationSec = Math.max(
        0,
        Math.round((Date.now() - startedAtRef.current) / 1000)
      );

      setSavingAttempt(true);
      setSaveError('');
      try {
        await saveQuizAttempt({
          uid: currentUser.uid,
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          quizId,
          quizTitle: meta?.title || '',
          classId,
          chapterId,
          topicId,
          examType,
          score,
          total: qs.length,
          answers: answersByQuestionId,
          durationSec,
          timeLimitSec: timeLimitSecRef.current,
          status,
        });
      } catch (error) {
        console.error('Failed to save quiz attempt:', error);
        setSaveError('Score shown locally, but could not save to your history.');
      } finally {
        setSavingAttempt(false);
      }
    },
    [currentUser, quizId, classId, chapterId, topicId, examType]
  );

  const finishQuiz = useCallback(
    async (status = 'completed') => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await persistAttempt(status);
    },
    [persistAttempt]
  );

  // Timer countdown
  useEffect(() => {
    if (showResults || loading) return undefined;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz('timed_out');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults, loading, finishQuiz]);

  const handleOptionSelect = (questionIndex, optionId) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionId,
    }));
  };

  const handleSubmitQuiz = () => {
    finishQuiz('completed');
  };

  const calculateScore = () => calculateScoreFrom(selectedAnswers, questions);

  const handleBack = () => {
    if (!showResults && Object.keys(selectedAnswers).length > 0) {
      const leave = window.confirm('Leave this quiz? Your progress will not be saved until you submit.');
      if (!leave) return;
    }
    navigate(-1);
  };

  const handleBackToTopic = () => {
    navigate(`/class/${id}/${examType}/chapter/${chapterId}/topics`);
  };

  const handleRetakeQuiz = () => {
    resetAttemptState(quizMetadata?.duration);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading quiz questions...</p>
      </div>
    );
  }
  if (questions.length === 0) {
    return (
      <div className="error-container">
        <p>No questions found for this quiz.</p>
      </div>
    );
  }

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;
  const score = calculateScore();
  const percent = Math.round((score / questions.length) * 100);
  const pageTitle = `${quizMetadata?.title || 'Quiz'} - ${examType?.toUpperCase()}`;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="header-top">
          <button type="button" className="quiz-back-button" onClick={handleBack}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="quiz-title">{pageTitle}</h1>
          <div className="timer">
            <Clock size={18} />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <div className="progress-info">
          <span>
            Answered: {Object.keys(selectedAnswers).length}/{questions.length}
          </span>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%`,
              }}
            />
          </div>
          <span>
            {Math.round((Object.keys(selectedAnswers).length / questions.length) * 100)}%
          </span>
        </div>
      </div>

      {showResults && (
        <div className="results-summary">
          <div className={`results-icon ${percent >= 60 ? 'success-icon' : 'fail-icon'}`}>
            {percent >= 60 ? <CheckCircle size={40} /> : <Award size={40} />}
          </div>
          <h2 className="results-title">{percent >= 60 ? 'Great Job!' : 'Keep Learning!'}</h2>
          <div className="results-score">{percent}%</div>
          <div className="results-details">
            <div className="detail-item">
              <div className="detail-label">Correct</div>
              <div className="detail-value" style={{ color: '#4caf50' }}>{score}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Incorrect</div>
              <div className="detail-value" style={{ color: '#f44336' }}>
                {questions.length - score}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Total</div>
              <div className="detail-value">{questions.length}</div>
            </div>
          </div>
          {savingAttempt && <p className="attempt-save-status">Saving your attempt…</p>}
          {saveError && <p className="attempt-save-error">{saveError}</p>}
          {!savingAttempt && !saveError && (
            <p className="attempt-save-status attempt-save-status--ok">Attempt saved to your history.</p>
          )}
          <div className="results-actions">
            <button type="button" className="retake-btn" onClick={handleRetakeQuiz}>
              Retake Quiz
            </button>
            <button type="button" className="back-topic-btn" onClick={handleBackToTopic}>
              Back to topics
            </button>
          </div>
        </div>
      )}

      <div className="questions-list">
        {questions.map((question, index) => {
          const isCorrect = showResults && selectedAnswers[index] === question.correctAnswer;
          const isIncorrect =
            showResults &&
            selectedAnswers[index] &&
            selectedAnswers[index] !== question.correctAnswer;

          return (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <div className="question-number">Question {index + 1}</div>
                {showResults && (
                  <div
                    className={`result-badge ${
                      isCorrect ? 'correct-badge' : isIncorrect ? 'incorrect-badge' : ''
                    }`}
                  >
                    {isCorrect ? 'Correct' : isIncorrect ? 'Incorrect' : 'Not Answered'}
                  </div>
                )}
              </div>
              <div className="question-content">
                <div className="question-text">{question.questionText}</div>
                {question.questionImage && (
                  <img src={question.questionImage} alt="Question" className="question-image" />
                )}
              </div>
              <div className="options-container">
                {question.options?.map((option, optIdx) => {
                  const optionId = option.id || String.fromCharCode(97 + optIdx);
                  const isSelected = selectedAnswers[index] === optionId;
                  const isCorrectOption = showResults && optionId === question.correctAnswer;
                  const isWrongSelection =
                    showResults && isSelected && optionId !== question.correctAnswer;

                  return (
                    <div
                      key={optionId}
                      className={`option ${isSelected ? 'selected' : ''} ${
                        isCorrectOption ? 'correct' : ''
                      } ${isWrongSelection ? 'incorrect' : ''} ${showResults ? 'disabled' : ''}`}
                      onClick={() => handleOptionSelect(index, optionId)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleOptionSelect(index, optionId);
                        }
                      }}
                      role="button"
                      tabIndex={showResults ? -1 : 0}
                    >
                      <div className="option-label">{optionId.toUpperCase()}</div>
                      <div className="option-content">
                        <div className="option-text">{option.text}</div>
                        {option.image && (
                          <img src={option.image} alt="Option" className="option-image" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {showResults && (
                <div className="explanation">
                  <div className="explanation-title">
                    <Award size={18} /> Explanation
                  </div>
                  <div className="explanation-text">
                    {question.explanation || 'No explanation provided.'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showResults && (
        <div className="submit-section">
          <div className={`submit-info ${allAnswered ? 'complete' : ''}`}>
            {allAnswered
              ? '✓ All questions answered!'
              : `Please answer all questions (${Object.keys(selectedAnswers).length}/${questions.length})`}
          </div>
          <button
            type="button"
            className="submit-btn"
            onClick={handleSubmitQuiz}
            disabled={!allAnswered}
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
