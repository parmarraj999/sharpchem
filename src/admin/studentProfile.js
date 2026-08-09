import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  User,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  FileText,
  Edit,
  Zap,
  Mail,
  Phone,
  ChevronRight,
  MapPin,
  School,
  LayoutDashboard,
  LogOut,
  Bell
} from 'lucide-react';
import './studentProfile.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebase.config';
import { useAuth } from '../context/AuthContext';
import {
  buildDashboardStats,
  buildWeeklyPerformance,
  fetchAttemptsForUser,
} from '../utils/quizAttempts';
import { practiceQuizPathFromFirestore } from '../utils/practiceRoutes';

const formatAttemptWhen = (createdAt) => {
  if (!createdAt) return '';
  const date = typeof createdAt.toDate === 'function' ? createdAt.toDate() : new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const StudentProfile = () => {
  const { id: routeUid } = useParams();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Only allow viewing own dashboard for now
      if (routeUid && routeUid !== currentUser.uid) {
        navigate(`/profile/${currentUser.uid}`, { replace: true });
        return;
      }

      setLoading(true);
      try {
        let profile = null;
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) profile = userDoc.data();
        } catch (error) {
          console.error('Error fetching user data:', error);
        }

        const merged = {
          name: profile?.name || currentUser.displayName || 'Student',
          email: profile?.email || currentUser.email || '',
          contactNumber: profile?.contactNumber || '',
          city: profile?.city || '',
          state: profile?.state || '',
          schoolName: profile?.schoolName || '',
          currentClass: profile?.currentClass || '',
          examType: profile?.examType || profile?.goal || '',
          profilePhoto: profile?.profilePhoto || currentUser.photoURL || '',
        };

        const history = await fetchAttemptsForUser(currentUser.uid, {
          email: merged.email,
          max: 80,
        });

        if (!cancelled) {
          setUserData(merged);
          setAttempts(history);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser, routeUid, navigate]);

  const stats = useMemo(() => buildDashboardStats(attempts), [attempts]);
  const performanceData = useMemo(() => buildWeeklyPerformance(attempts), [attempts]);
  const recentAttempts = useMemo(() => attempts.slice(0, 5), [attempts]);

  const handleLogout = async () => {
    await signOut(auth);
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

  const avatarUrl =
    userData?.profilePhoto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || 'Student')}&background=4f46e5&color=fff`;

  const firstName = (userData?.name || 'Student').split(' ')[0];

  return (
    <div className="dashboard-root">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <LayoutDashboard size={24} />
          <span>SharpChem</span>
        </div>
        <nav className="sidebar-nav">
          <Link to={`/profile/${currentUser?.uid}`} className="nav-item active">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/academic" className="nav-item">
            <BookOpen size={20} /> Academics
          </Link>
          <Link to="/practice" className="nav-item">
            <Target size={20} /> Practice
          </Link>
          <Link to="/" className="nav-item">
            <FileText size={20} /> Home
          </Link>
          <div className="nav-divider"></div>
          <button type="button" onClick={handleLogout} className="nav-item logout-btn">
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-top-bar">
          <div className="welcome-text">
            <h1>
              {greeting}, {firstName}!
            </h1>
            <p>Your quiz history and progress, updated from real attempts.</p>
          </div>
          <div className="top-bar-actions">
            <button type="button" className="icon-btn" aria-label="Notifications" disabled>
              <Bell size={20} />
            </button>
            <div className="user-mini-profile">
              <img src={avatarUrl} alt="" />
              <div className="user-info-text">
                <span className="user-name">{userData?.name}</span>
                <span className="user-role">{userData?.currentClass || 'Student'}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content-grid">
          <section className="stats-row">
            <div className="stat-card glass-morph">
              <div className="stat-icon purple">
                <FileText size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.quizzesAttempted}</span>
                <span className="stat-label">Attempts</span>
              </div>
            </div>
            <div className="stat-card glass-morph">
              <div className="stat-icon blue">
                <BookOpen size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.questionsSolved}</span>
                <span className="stat-label">Correct answers</span>
              </div>
            </div>
            <div className="stat-card glass-morph">
              <div className="stat-icon green">
                <Target size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.accuracy}%</span>
                <span className="stat-label">Accuracy</span>
              </div>
            </div>
            <div className="stat-card glass-morph">
              <div className="stat-icon orange">
                <Clock size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.studyTimeLabel}</span>
                <span className="stat-label">Quiz time</span>
              </div>
            </div>
          </section>

          <div className="content-columns">
            <section className="chart-section glass-morph">
              <div className="section-title">
                <TrendingUp size={20} />
                <h3>Last 7 days</h3>
              </div>
              <div className="chart-container">
                {performanceData.every((d) => d.attempts === 0) ? (
                  <p className="dash-empty">No quiz attempts in the last week yet. Take a practice quiz to see your trend.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                      />
                      <YAxis domain={[0, 100]} hide />
                      <Tooltip
                        formatter={(value, _name, props) => [
                          `${value}% avg`,
                          props?.payload?.attempts
                            ? `${props.payload.attempts} attempt(s)`
                            : 'Score',
                        ]}
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        }}
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
                )}
              </div>
            </section>

            <section className="recent-activity glass-morph">
              <div className="section-title">
                <Zap size={20} />
                <h3>Recent quizzes</h3>
              </div>
              <div className="activity-list">
                {recentAttempts.length === 0 ? (
                  <p className="dash-empty">No attempts yet. Head to Practice and finish a quiz.</p>
                ) : (
                  recentAttempts.map((a) => {
                    const href = practiceQuizPathFromFirestore(
                      a.classId,
                      a.chapterId,
                      a.quizId
                    );
                    return (
                      <Link key={a.id} to={href} className="activity-item activity-item-link">
                        <div className="activity-thumb">
                          <TrendingUp size={18} />
                        </div>
                        <div className="activity-info">
                          <h4>{a.quizTitle || 'Quiz'}</h4>
                          <p>
                            {a.percent ?? 0}% · {a.score}/{a.total}
                            {formatAttemptWhen(a.createdAt)
                              ? ` · ${formatAttemptWhen(a.createdAt)}`
                              : ''}
                          </p>
                          <div className="mini-progress">
                            <div className="fill" style={{ width: `${Math.min(100, a.percent ?? 0)}%` }} />
                          </div>
                        </div>
                        <ChevronRight size={18} className="arrow" />
                      </Link>
                    );
                  })
                )}
              </div>
              <Link to="/practice" className="view-all-btn">
                Go to Practice
              </Link>
            </section>
          </div>

          <section className="profile-summary-section glass-morph">
            <div className="user-profile-identity">
              <img src={avatarUrl} alt="" />
              <div className="identity-text">
                <h3>{userData?.name}</h3>
                <p>
                  {[userData?.currentClass, userData?.examType].filter(Boolean).join(' · ') ||
                    'Student'}
                </p>
              </div>
              <button
                type="button"
                className="edit-btn"
                onClick={() => navigate('/student-detail')}
              >
                <Edit size={16} /> Edit
              </button>
            </div>
            <div className="profile-details-grid">
              <div className="pd-item">
                <Mail size={16} />
                <span>{userData?.email || '—'}</span>
              </div>
              <div className="pd-item">
                <Phone size={16} />
                <span>{userData?.contactNumber || 'Add phone'}</span>
              </div>
              <div className="pd-item">
                <MapPin size={16} />
                <span>
                  {[userData?.city, userData?.state].filter(Boolean).join(', ') || 'Add location'}
                </span>
              </div>
              <div className="pd-item">
                <School size={16} />
                <span>{userData?.schoolName || 'Not specified'}</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <nav className="mobile-nav-bar">
        <Link to={`/profile/${currentUser?.uid}`} className="active">
          <LayoutDashboard size={20} />
        </Link>
        <Link to="/academic">
          <BookOpen size={20} />
        </Link>
        <Link to="/practice">
          <Target size={20} />
        </Link>
        <Link to="/">
          <User size={20} />
        </Link>
      </nav>
    </div>
  );
};

export default StudentProfile;
