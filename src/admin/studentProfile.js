import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { User, BookOpen, Target, Clock, TrendingUp, FileText, Lock, Edit, Download, Award, Zap, Calendar, Mail, Phone, ChevronRight, Star } from 'lucide-react';
import './studentProfile.css';
import { useLocation } from 'react-router-dom';

// Dummy data for the graph
const performanceData = [
  { day: 'Mon', score: 65, questions: 45 },
  { day: 'Tue', score: 78, questions: 52 },
  { day: 'Wed', score: 82, questions: 60 },
  { day: 'Thu', score: 75, questions: 48 },
  { day: 'Fri', score: 88, questions: 65 },
  { day: 'Sat', score: 92, questions: 70 },
  { day: 'Sun', score: 85, questions: 58 }
];

const StudentProfile = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { pathname } = useLocation();

  console.log(pathname)

  const studentData = {
    name: "Rahul Sharma",
    class: "12",
    examType: "JEE",
    email: "rahul.sharma@email.com",
    phone: "+91 98765 43210",
    joinedDate: "Jan 15, 2024",
    profilePhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
    stats: {
      quizzesAttempted: 45,
      questionsSolved: 1247,
      accuracy: 87.5,
      studyTime: "142h 30m"
    },
    recentQuizzes: [
      { id: 1, title: "Physics - Electrostatics", score: 85, date: "2 hours ago" },
      { id: 2, title: "Mathematics - Calculus", score: 92, date: "1 day ago" },
      { id: 3, title: "Chemistry - Organic", score: 78, date: "2 days ago" }
    ],
    recentChapters: [
      { id: 1, subject: "Physics", chapter: "Electromagnetic Induction", progress: 75 },
      { id: 2, subject: "Mathematics", chapter: "3D Geometry", progress: 60 },
      { id: 3, subject: "Chemistry", chapter: "Coordination Compounds", progress: 90 }
    ]
  };

  const handleDownloadReport = () => {
    alert('Downloading performance report...');
  };

  return (
    <div className="student-profile-container">
      <div className="left-panel">
        <div className="student-card">
          <div className="profile-photo-container">
            <img src={studentData.profilePhoto} alt={studentData.name} className="profile-photo" />
            <div className="status-indicator"></div>
          </div>
          
          <h2 className="student-name">{studentData.name}</h2>
          
          <div className="student-badges">
            <span className="badge badge-class">
              <Award size={14} />
              Class {studentData.class}
            </span>
            <span className="badge badge-exam">
              <Target size={14} />
              {studentData.examType}
            </span>
          </div>

          <div className="student-details">
            <div className="detail-item">
              <Mail size={18} />
              <span>{studentData.email}</span>
            </div>
            <div className="detail-item">
              <Phone size={18} />
              <span>{studentData.phone}</span>
            </div>
            <div className="detail-item">
              <Calendar size={18} />
              <span>Joined: {studentData.joinedDate}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => setShowEditModal(true)}>
              <Edit size={18} />
              Edit Profile
            </button>
            <button className="btn btn-secondary" onClick={() => setShowPasswordModal(true)}>
              <Lock size={18} />
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Track your learning journey and achieve your goals</p>
        </div>

        <div className="summary-grid">
          <div className="summary-box box-purple">
            <div className="summary-icon">
              <FileText size={28} />
            </div>
            <div className="summary-content">
              <h3>{studentData.stats.quizzesAttempted}</h3>
              <p>Quizzes Attempted</p>
            </div>
          </div>

          <div className="summary-box box-blue">
            <div className="summary-icon">
              <BookOpen size={28} />
            </div>
            <div className="summary-content">
              <h3>{studentData.stats.questionsSolved}</h3>
              <p>Questions Solved</p>
            </div>
          </div>

          <div className="summary-box box-green">
            <div className="summary-icon">
              <Target size={28} />
            </div>
            <div className="summary-content">
              <h3>N/A</h3>
              {/* <h3>{studentData.stats.accuracy}%</h3> */}
              <p>Accuracy</p>
            </div>
          </div>

          {/* <div className="summary-box box-orange">
            <div className="summary-icon">
              <Clock size={28} />
            </div>
            <div className="summary-content">
              <h3>{studentData.stats.studyTime}</h3>
              <p>Study Time</p>
            </div>
          </div> */}
        </div>

        {/* <div className="graph-section">
          <div className="section-header">
            <h2>
              <TrendingUp size={24} />
              Weekly Performance
            </h2>
            <div className="trend-badge">
              <Zap size={14} />
              +12% this week
            </div>
          </div>

          <div className="graph-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '13px', fontWeight: 600 }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '13px', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ 
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    padding: '12px 16px'
                  }}
                  labelStyle={{ fontWeight: 700, color: '#1a1a1a' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#1a1a1a" 
                  strokeWidth={3}
                  fill="url(#colorScore)"
                  dot={{ fill: '#1a1a1a', r: 6, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        <div className="activity-grid">
          <div className="activity-card">
            <h3>
              <Star size={20} />
              Recent Quizzes
            </h3>
            <div className="activity-list">
              {studentData.recentQuizzes.map(quiz => (
                <div key={quiz.id} className="activity-item">
                  <div className="activity-info">
                    <h4>{quiz.title}</h4>
                    <span className="activity-date">{quiz.date}</span>
                  </div>
                  <div className={`activity-score ${quiz.score >= 80 ? 'high' : 'medium'}`}>
                    {quiz.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="activity-card">
            <h3>
              <BookOpen size={20} />
              Recently Viewed Chapters
            </h3>
            <div className="activity-list">
              {studentData.recentChapters.map(chapter => (
                <div key={chapter.id} className="activity-item chapter-item">
                  <div className="activity-info">
                    <h4>{chapter.chapter}</h4>
                    <span className="activity-date">{chapter.subject}</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${chapter.progress}%` }}></div>
                    <span className="progress-text">{chapter.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="download-section">
          <button className="btn-download" onClick={handleDownloadReport}>
            <Download size={22} />
            Download Performance Report (PDF)
          </button>
        </div>
      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            <p>Update your personal information and preferences to keep your profile current.</p>
            <button className="btn btn-primary" onClick={() => setShowEditModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Change Password</h2>
            <p>Create a strong password to keep your account secure.</p>
            <button className="btn btn-primary" onClick={() => setShowPasswordModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;