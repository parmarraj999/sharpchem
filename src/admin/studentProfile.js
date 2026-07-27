import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  User,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  FileText,
  Lock,
  Edit,
  Download,
  Award,
  Zap,
  Calendar,
  Mail,
  Phone,
  ChevronRight,
  Star,
  MapPin,
  School,
  LayoutDashboard,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';
import './studentProfile.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase.config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const StudentProfile = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    window.localStorage.removeItem('isLogIn');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="spinner"></div>
        <p>Initializing Dashboard...</p>
      </div>
    );
  }

  // Fallback dummy data for missing stats
  const stats = userData?.stats || {
    quizzesAttempted: 0,
    questionsSolved: 0,
    accuracy: 0,
    studyTime: "0h"
  };

  const performanceData = [
    { day: 'Mon', score: 40 }, { day: 'Tue', score: 60 }, { day: 'Wed', score: 45 },
    { day: 'Thu', score: 70 }, { day: 'Fri', score: 85 }, { day: 'Sat', score: 90 },
    { day: 'Sun', score: 80 }
  ];

  return (
    <div className="dashboard-root">
      {/* Sidebar - Desktop Only */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <LayoutDashboard size={24} />
          <span>SharpChem</span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item active"><LayoutDashboard size={20} /> Dashboard</Link>
          {/* <Link to="/academic" className="nav-item"><BookOpen size={20} /> My Courses</Link> */}
          <Link to="#" className="nav-item"><Star size={20} /> Quizzes</Link>
          <Link to="#" className="nav-item"><Target size={20} /> Topics Covered</Link>
          <div className="nav-divider"></div>
          <Link to="#" className="nav-item"><Settings size={20} /> Settings</Link>
          <button onClick={handleLogout} className="nav-item logout-btn"><LogOut size={20} /> Logout</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-top-bar">
          <div className="welcome-text">
            <h1>{greeting}, {userData?.name?.split(' ')[0] || 'Student'}! 👋</h1>
            <p>Let's continue your chemistry excellence today.</p>
          </div>
          <div className="top-bar-actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="user-mini-profile">
              <img src={userData?.profilePhoto || "https://ui-avatars.com/api/?name=" + userData?.name} alt="avatar" />
              <div className="user-info-text">
                <span className="user-name">{userData?.name}</span>
                <span className="user-role">{userData?.currentClass || 'Student'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard-content-grid">

          {/* Stats Section */}
          <section className="stats-row">
            <div className="stat-card glass-morph">
              <div className="stat-icon purple"><FileText size={24} /></div>
              <div className="stat-details">
                <span className="stat-value">{stats.quizzesAttempted}</span>
                <span className="stat-label">Quizzes</span>
              </div>
            </div>
            <div className="stat-card glass-morph">
              <div className="stat-icon blue"><BookOpen size={24} /></div>
              <div className="stat-details">
                <span className="stat-value">{stats.questionsSolved}</span>
                <span className="stat-label">Questions</span>
              </div>
            </div>
            <div className="stat-card glass-morph">
              <div className="stat-icon green"><Target size={24} /></div>
              <div className="stat-details">
                <span className="stat-value">{stats.accuracy}%</span>
                <span className="stat-label">Accuracy</span>
              </div>
            </div>
            <div className="stat-card glass-morph">
              <div className="stat-icon orange"><Clock size={24} /></div>
              <div className="stat-details">
                <span className="stat-value">{stats.studyTime}</span>
                <span className="stat-label">Study Time</span>
              </div>
            </div>
          </section>

          {/* Performance Chart & Recent Activity */}
          <div className="content-columns">
            <section className="chart-section glass-morph">
              <div className="section-title">
                <TrendingUp size={20} />
                <h3>Weekly Performance</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="recent-activity glass-morph">
              <div className="section-title">
                <Zap size={20} />
                <h3>Continue Learning</h3>
              </div>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-thumb"><BookOpen size={18} /></div>
                  <div className="activity-info">
                    <h4>Atomic Structure</h4>
                    <p>Chapter 4 • 65% Completed</p>
                    <div className="mini-progress"><div className="fill" style={{ width: '65%' }}></div></div>
                  </div>
                  <ChevronRight size={18} className="arrow" />
                </div>
                <div className="activity-item">
                  <div className="activity-thumb"><TrendingUp size={18} /></div>
                  <div className="activity-info">
                    <h4>Thermodynamics Quiz</h4>
                    <p>Practice Set • Ready for review</p>
                  </div>
                  <ChevronRight size={18} className="arrow" />
                </div>
              </div>
              <button className="view-all-btn">View All Learning Path</button>
            </section>
          </div>

          {/* User Details Card */}
          <section className="profile-summary-section glass-morph">
            <div className="user-profile-identity">
              <img src={userData?.profilePhoto || "https://ui-avatars.com/api/?name=" + userData?.name} alt="profile" />
              <div className="identity-text">
                <h3>{userData?.name}</h3>
                <p>Class {userData?.currentClass} • {userData?.examType || 'Aspirant'}</p>
              </div>
              <button className="edit-btn"><Edit size={16} /> Edit</button>
            </div>
            <div className="profile-details-grid">
              <div className="pd-item">
                <Mail size={16} />
                <span>{userData?.email}</span>
              </div>
              <div className="pd-item">
                <Phone size={16} />
                <span>{userData?.contactNumber || 'Add Phone'}</span>
              </div>
              <div className="pd-item">
                <MapPin size={16} />
                <span>{userData?.city}, {userData?.state}</span>
              </div>
              <div className="pd-item">
                <School size={16} />
                <span>{userData?.schoolName || 'Not specified'}</span>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="mobile-nav-bar">
        <Link to="/" className="active"><LayoutDashboard size={20} /></Link>
        <Link to="/academic"><BookOpen size={20} /></Link>
        <Link to="#"><Target size={20} /></Link>
        <Link to="#"><User size={20} /></Link>
      </nav>
    </div>
  );
};

export default StudentProfile;
