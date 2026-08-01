import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, ChevronDown, ChevronUp, CheckCircle, Info } from 'lucide-react';
import './questionsPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../firebase/firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { resolvePracticeClassId, practiceTrackLabel } from '../../../utils/practiceRoutes';

const QuestionsPage = () => {
  const { id, examType, chapterId, topicId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSolutions, setExpandedSolutions] = useState({});

  const classId = resolvePracticeClassId(id, examType);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!classId || !chapterId || !topicId) return;
      setLoading(true);
      try {
        const questionsRef = collection(db, 'class_data', classId, 'chapters', chapterId, 'topics', topicId, 'questions');
        const querySnapshot = await getDocs(questionsRef);
        
        const questionsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionsData);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [classId, chapterId, topicId]);

  const toggleSolution = (questionId) => {
    setExpandedSolutions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const pageTitle = `${practiceTrackLabel(id, examType)} – Practice Questions`;

  if (loading) return <div className="loading-container"><p>Loading questions...</p></div>;

  return (
    <div className="questions-container">
      <div className="page-header">
        <button className="que-back-button" onClick={handleBack} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">{pageTitle}</h1>
        <div className="questions-count">
          <CheckCircle size={18} color="#4CAF50" />
          <span>{questions.length} Practice Questions</span>
        </div>
      </div>

      <div className="questions-list">
        {questions.length > 0 ? (
          questions.map((question, index) => (
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
                  
                  {/* Options Display */}
                  {question.options && Array.isArray(question.options) && (
                    <div className="options-grid">
                      {question.options.map((option, optIdx) => (
                        <div key={option.id || optIdx} className="option-item">
                          <span className="option-label">{String.fromCharCode(65 + optIdx)}.</span>
                          <span className="option-text">{option.text}</span>
                          {option.image && <img src={option.image} alt="option" className="option-image" />}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.difficulty && (
                    <div className="difficulty-badge">
                      Difficulty: {question.difficulty}
                    </div>
                  )}
                </div>
              </div>

              <button 
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

              <div className={`solution-section ${expandedSolutions[question.id] ? 'expanded' : ''}`}>
                <div className="solution-content">
                  <div className="solution-label">
                    <CheckCircle size={16} />
                    Correct Answer: {question.correctAnswer}
                  </div>
                  <div className="explanation-label">
                    <Info size={16} />
                    Explanation
                  </div>
                  <p className="solution-text">{question.explanation || "No explanation provided."}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-questions">
            <p>No practice questions available for this topic yet.</p>
          </div>
        )}
      </div>

      {questions.length > 0 && (
        <div className="download-section">
          <h2 className="download-title">Need Offline Practice?</h2>
          <p className="download-subtitle">Study materials are being prepared for download.</p>
          <button className="download-btn" disabled>
            <Download size={22} />
            Download coming soon
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;