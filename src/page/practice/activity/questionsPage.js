import React, { useState } from 'react';
import { ArrowLeft, Download, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import './questionsPage.css';
import { useNavigate } from 'react-router-dom';

const QuestionsPage = () => {
  // Simulated URL params (in real app, these would come from React Router)
  const [urlParams] = useState({
    id: '12',
    examType: 'neet',
    chapterId: '3',
    topicId: '5'
  });

  // Track which solutions are expanded
  const [expandedSolutions, setExpandedSolutions] = useState({});

  // Dummy questions data
  const questions = [
    {
      id: 1,
      questionText: "What is the normal resting heart rate for a healthy adult?",
      questionImage: null,
      solutionText: "The normal resting heart rate for a healthy adult ranges from 60 to 100 beats per minute (bpm). Athletes and people who are physically fit may have a lower resting heart rate, sometimes as low as 40 bpm. The heart rate can be influenced by factors such as age, fitness level, medications, and emotional state.",
      solutionImage: null
    },
    {
      id: 2,
      questionText: "Identify the parts of the human heart labeled A, B, C, and D in the diagram below:",
      questionImage: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=600&h=400&fit=crop",
      solutionText: "A = Right Atrium, B = Left Ventricle, C = Aorta, D = Pulmonary Artery. The right atrium receives deoxygenated blood from the body, while the left ventricle pumps oxygenated blood to the entire body through the aorta.",
      solutionImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop"
    },
    {
      id: 3,
      questionText: "Describe the pathway of blood flow through the human heart, starting from the vena cava.",
      questionImage: null,
      solutionText: "Blood flow pathway: 1) Deoxygenated blood enters the right atrium via superior and inferior vena cava. 2) Blood flows through the tricuspid valve into the right ventricle. 3) From the right ventricle, blood is pumped through the pulmonary valve into the pulmonary artery to the lungs for oxygenation. 4) Oxygenated blood returns via pulmonary veins to the left atrium. 5) Blood passes through the mitral (bicuspid) valve into the left ventricle. 6) Finally, blood is pumped through the aortic valve into the aorta for systemic circulation.",
      solutionImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop"
    },
    {
      id: 4,
      questionText: "Which chamber of the heart has the thickest wall and why?",
      questionImage: null,
      solutionText: "The left ventricle has the thickest myocardial wall among all heart chambers. This is because the left ventricle must generate enough pressure to pump oxygenated blood throughout the entire systemic circulation - to all organs and tissues of the body. The wall thickness is typically 8-12mm, which is about three times thicker than the right ventricle, which only needs to pump blood the short distance to the lungs (pulmonary circulation).",
      solutionImage: null
    },
    {
      id: 5,
      questionText: "Observe the ECG trace shown below. What cardiac event does the P wave represent?",
      questionImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
      solutionText: "The P wave represents atrial depolarization, which causes the atria to contract. This wave occurs just before the atria push blood into the ventricles. A normal P wave is smooth, rounded, and precedes the QRS complex by about 0.12-0.20 seconds.",
      solutionImage: "https://images.unsplash.com/photo-1582719366355-cdfe19f71f1c?w=600&h=400&fit=crop"
    },
    {
      id: 6,
      questionText: "What is the function of the sinoatrial (SA) node in the heart?",
      questionImage: null,
      solutionText: "The sinoatrial (SA) node, located in the right atrium near the opening of the superior vena cava, serves as the heart's natural pacemaker. It spontaneously generates electrical impulses at a rate of 60-100 times per minute under normal resting conditions. These impulses spread through the atrial muscle causing atrial contraction, then travel to the atrioventricular (AV) node, which delays the signal briefly before it passes to the ventricles, coordinating the heart's rhythmic contractions.",
      solutionImage: null
    }
  ];

  // Chapter and topic names (would normally come from API/database)
  const chapterName = "Human Physiology";
  const topicName = "Heart Structure and Function";

  const toggleSolution = (questionId) => {
    setExpandedSolutions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleDownloadPDF = () => {
    alert('Downloading PDF with all questions and solutions...\n\nIn production, this would generate and download a PDF file.');
    // In real app: implement PDF generation using libraries like jsPDF or pdfmake
  };

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const pageTitle = `Class ${urlParams.id} – ${urlParams.examType.toUpperCase()} – Chapter ${urlParams.chapterId}: ${chapterName} – Topic: ${topicName}`;

  return (
    <>

      <div className="questions-container">
        {/* Floating Back Button */}

        {/* Page Header */}
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

        {/* Questions List */}
        <div className="questions-list">
          {questions.map((question) => (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <div className="question-number">Q{question.id}</div>
                <div className="question-content">
                  <p className="question-text">{question.questionText}</p>
                  {question.questionImage && (
                    <img 
                      src={question.questionImage} 
                      alt={`Question ${question.id}`} 
                      className="question-image"
                    />
                  )}
                </div>
              </div>

              <button 
                className="show-solution-btn"
                onClick={() => toggleSolution(question.id)}
              >
                {expandedSolutions[question.id] ? (
                  <>
                    Hide Solution
                    <ChevronUp size={20} />
                  </>
                ) : (
                  <>
                    Show Solution
                    <ChevronDown size={20} />
                  </>
                )}
              </button>

              <div className={`solution-section ${expandedSolutions[question.id] ? 'expanded' : ''}`}>
                <div className="solution-content">
                  <div className="solution-label">
                    <CheckCircle size={16} />
                    Solution
                  </div>
                  <p className="solution-text">{question.solutionText}</p>
                  {question.solutionImage && (
                    <img 
                      src={question.solutionImage} 
                      alt={`Solution ${question.id}`} 
                      className="solution-image"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Download Section */}
        <div className="download-section">
          <h2 className="download-title">Get Complete Study Material</h2>
          <p className="download-subtitle">Download all questions and solutions in PDF format</p>
          <button className="download-btn" onClick={handleDownloadPDF}>
            <Download size={22} />
            Download Full Questions & Solutions
          </button>
        </div>
      </div>
    </>
  );
};

export default QuestionsPage;