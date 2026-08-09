import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, ChevronDown, ChevronUp, CheckCircle, Info, XCircle } from 'lucide-react';
import './questionsPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../firebase/firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { resolvePracticeClassId, practiceTrackLabel } from '../../../utils/practiceRoutes';

/** Normalize option id (admin uses a/b/c/d) */
const optionKey = (option, optIdx) => {
  if (option?.id != null && String(option.id).trim() !== '') {
    return String(option.id).toLowerCase();
  }
  return String.fromCharCode(97 + optIdx); // a, b, c…
};

const isCorrectOption = (question, option, optIdx) => {
  const correct = String(question.correctAnswer ?? '').trim().toLowerCase();
  if (!correct) return false;
  const key = optionKey(option, optIdx);
  if (key === correct) return true;
  // Allow "A" / "Option A" style answers
  if (correct === String.fromCharCode(65 + optIdx).toLowerCase()) return true;
  return false;
};

const QuestionsPage = () => {
  const { id, examType, chapterId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSolutions, setExpandedSolutions] = useState({});
  /** questionId → selected option key */
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const classId = resolvePracticeClassId(id, examType);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!classId || !chapterId) return;
      setLoading(true);
      try {
        const chapterPath = collection(
          db,
          'class_data',
          classId,
          'chapters',
          chapterId,
          'questions'
        );
        const chapterSnap = await getDocs(chapterPath);
        let questionsData = chapterSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        // Legacy fallback: older topic-scoped question banks
        if (questionsData.length === 0) {
          const topicsSnap = await getDocs(
            collection(db, 'class_data', classId, 'chapters', chapterId, 'topics')
          );
          const legacy = [];
          for (const topicDoc of topicsSnap.docs) {
            const legacySnap = await getDocs(
              collection(
                db,
                'class_data',
                classId,
                'chapters',
                chapterId,
                'topics',
                topicDoc.id,
                'questions'
              )
            );
            legacySnap.docs.forEach((docSnap) => {
              legacy.push({ id: docSnap.id, ...docSnap.data() });
            });
          }
          questionsData = legacy;
        }

        setQuestions(questionsData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [classId, chapterId]);

  const toggleSolution = (questionId) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSelectOption = (question, option, optIdx) => {
    if (selectedAnswers[question.id] != null) return; // locked after first pick
    const key = optionKey(option, optIdx);
    setSelectedAnswers((prev) => ({ ...prev, [question.id]: key }));
    // Auto-open explanation after answering
    setExpandedSolutions((prev) => ({ ...prev, [question.id]: true }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const pageTitle = `${practiceTrackLabel(id, examType)} – Practice Questions`;

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="questions-container">
      <div className="page-header">
        <button type="button" className="que-back-button" onClick={handleBack} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">{pageTitle}</h1>
        <div className="questions-count">
          <CheckCircle size={18} color="#4CAF50" />
          <span>{questions.length} Practice Questions</span>
        </div>
        <p className="practice-hint">Tap an option to check your answer.</p>
      </div>

      <div className="questions-list">
        {questions.length > 0 ? (
          questions.map((question, index) => {
            const selectedKey = selectedAnswers[question.id];
            const hasAnswered = selectedKey != null;
            const selectedIdx = hasAnswered
              ? (question.options || []).findIndex((o, i) => optionKey(o, i) === selectedKey)
              : -1;
            const pickedCorrect =
              selectedIdx >= 0 &&
              isCorrectOption(question, question.options[selectedIdx], selectedIdx);

            return (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <div className="question-number">Q{index + 1}</div>
                  <div className="question-content">
                    <p className="question-text">{question.questionText}</p>
                    {question.questionImage && (
                      <img
                        src={question.questionImage}
                        alt={`Question ${index + 1}`}
                        className="question-image"
                      />
                    )}

                    {question.options && Array.isArray(question.options) && (
                      <div className="options-grid" role="group" aria-label={`Options for question ${index + 1}`}>
                        {question.options.map((option, optIdx) => {
                          const key = optionKey(option, optIdx);
                          const correct = isCorrectOption(question, option, optIdx);
                          const isSelected = selectedKey === key;

                          let stateClass = 'option-item--idle';
                          if (hasAnswered) {
                            if (correct) stateClass = 'option-item--correct';
                            else if (isSelected) stateClass = 'option-item--incorrect';
                            else stateClass = 'option-item--dimmed';
                          }

                          return (
                            <button
                              key={option.id || optIdx}
                              type="button"
                              className={`option-item ${stateClass} ${hasAnswered ? 'option-item--locked' : 'option-item--clickable'}`}
                              onClick={() => handleSelectOption(question, option, optIdx)}
                              disabled={hasAnswered}
                              aria-pressed={isSelected}
                            >
                              <span className="option-label">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="option-text">{option.text}</span>
                              {option.image && (
                                <img src={option.image} alt="" className="option-image" />
                              )}
                              {hasAnswered && correct && (
                                <CheckCircle size={18} className="option-feedback-icon" aria-hidden />
                              )}
                              {hasAnswered && isSelected && !correct && (
                                <XCircle size={18} className="option-feedback-icon" aria-hidden />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {hasAnswered && (
                      <p className={`answer-result ${pickedCorrect ? 'answer-result--ok' : 'answer-result--bad'}`}>
                        {pickedCorrect
                          ? 'Correct!'
                          : 'Incorrect — the right answer is highlighted in green.'}
                      </p>
                    )}

                    {question.difficulty && (
                      <div className="difficulty-badge">Difficulty: {question.difficulty}</div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="show-solution-btn"
                  onClick={() => toggleSolution(question.id)}
                >
                  {expandedSolutions[question.id] ? (
                    <>
                      Hide Answer & Explanation
                      <ChevronUp size={20} />
                    </>
                  ) : (
                    <>
                      Show Answer & Explanation
                      <ChevronDown size={20} />
                    </>
                  )}
                </button>

                <div
                  className={`solution-section ${expandedSolutions[question.id] ? 'expanded' : ''}`}
                >
                  <div className="solution-content">
                    <div className="solution-label">
                      <CheckCircle size={16} />
                      Correct Answer:{' '}
                      {String(question.correctAnswer || '').toUpperCase()}
                    </div>
                    <div className="explanation-label">
                      <Info size={16} />
                      Explanation
                    </div>
                    <p className="solution-text">
                      {question.explanation || 'No explanation provided.'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-questions">
            <p>No practice questions available for this chapter yet.</p>
          </div>
        )}
      </div>

      {questions.length > 0 && (
        <div className="download-section">
          <h2 className="download-title">Need Offline Practice?</h2>
          <p className="download-subtitle">Study materials are being prepared for download.</p>
          <button type="button" className="download-btn" disabled>
            <Download size={22} />
            Download coming soon
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
