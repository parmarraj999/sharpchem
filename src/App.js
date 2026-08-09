import { BrowserRouter, Route, Routes, Navigate, useParams, useLocation } from 'react-router-dom';
import './App.css';
import HomePage from './page/home-page/homePage';
import AcademicsPage from './page/academic-page/academic';
import Navbar from './components/navbar/navbar';
import Login from './page/auth/login';
import Signup from './page/auth/signup';
import ChapterDetailPage from './page/chapter-detail/chapterDetail';
import TopicLessonPage from './page/chapter-detail/topicLesson';
import ClassDetail from './page/chapter-page/classPage';
import QuizPage from './page/practice/activity/quizPage';
import QuestionsPage from './page/practice/activity/questionsPage';
import ChapterListPage from './page/practice/chapterList/chapterListPage';
import TopicListPage from './page/practice/topic-page/topicPage';
import QuizListPage from './page/practice/activity/quizListPage';
import ScrollToTop from './function/scrollToTop';
import StudentProfile from './admin/studentProfile';
import StudentDetailsForm from './page/details/studentDetails';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { BlogPage, AboutPage, ContactPage } from './page/placeholder/PlaceholderPage';
import PracticeHub from './page/practice/PracticeHub';
import {
  academicsChapterPath,
  academicsClassPath,
  academicsLessonPath,
  parseFirestoreClassId,
  practiceQuestionsPath,
  practiceQuizListPath,
  practiceQuizPath,
} from './utils/practiceRoutes';

/** Legacy class-level /quizzes URL had no quizId — send users to chapter list instead. */
const RedirectToChapterList = () => {
  const { id, examType } = useParams();
  return <Navigate to={`/class/${id}/${examType}/chapterList`} replace />;
};

/** Old topic-scoped practice → chapter practice */
const RedirectLegacyTopicQuestions = () => {
  const { id, examType, chapterId } = useParams();
  return <Navigate to={practiceQuestionsPath(id, examType, chapterId)} replace />;
};

const RedirectLegacyTopicQuizList = () => {
  const { id, examType, chapterId } = useParams();
  return <Navigate to={practiceQuizListPath(id, examType, chapterId)} replace />;
};

const RedirectLegacyTopicQuiz = () => {
  const { id, examType, chapterId, quizId } = useParams();
  return <Navigate to={practiceQuizPath(id, examType, chapterId, quizId)} replace />;
};

/** Old /class/class_9 or /class/11_jee → /class/9/standard or /class/11/jee */
const RedirectLegacyClassPath = () => {
  const { id } = useParams();
  const parsed = parseFirestoreClassId(id);
  if (parsed) {
    return <Navigate to={academicsClassPath(parsed)} replace />;
  }
  // Bare /class/9 → board learn path
  if (id && /^\d+$/.test(id)) {
    return <Navigate to={`/class/${id}/standard`} replace />;
  }
  return <Navigate to="/academic" replace />;
};

/** Old /class/class_9/chapter/:chapterId → clean learn URL */
const RedirectLegacyChapterPath = () => {
  const { classId, chapterId } = useParams();
  const location = useLocation();
  const parsed = parseFirestoreClassId(classId);
  if (parsed && chapterId) {
    const to = academicsChapterPath(parsed.id, parsed.examType, chapterId);
    return <Navigate to={to} replace state={location.state} />;
  }
  return <Navigate to="/academic" replace />;
};

/** Old /class/class_9/chapter/:chapterId/learn/:topicId → clean learn URL */
const RedirectLegacyLessonPath = () => {
  const { classId, chapterId, topicId } = useParams();
  const location = useLocation();
  const parsed = parseFirestoreClassId(classId);
  if (parsed && chapterId && topicId) {
    const to = academicsLessonPath(parsed.id, parsed.examType, chapterId, topicId);
    return <Navigate to={to} replace state={location.state} />;
  }
  return <Navigate to="/academic" replace />;
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/student-detail" element={<ProtectedRoute><StudentDetailsForm /></ProtectedRoute>} />
            <Route path="/academic" element={<ProtectedRoute><AcademicsPage /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><PracticeHub /></ProtectedRoute>} />
            <Route path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />

            {/* Practice (drill) — chapter-scoped; more specific paths first */}
            <Route path="/class/:id/:examType/quizzes" element={<ProtectedRoute><RedirectToChapterList /></ProtectedRoute>} />
            <Route path="/class/:id/:examType/chapterList" element={<ProtectedRoute><ChapterListPage /></ProtectedRoute>} />
            <Route path="/class/:id/:examType/chapter/:chapterId/topics" element={<ProtectedRoute><TopicListPage /></ProtectedRoute>} />
            <Route path="/class/:id/:examType/chapter/:chapterId/quizzes" element={<ProtectedRoute><QuizListPage /></ProtectedRoute>} />
            <Route path="/class/:id/:examType/chapter/:chapterId/quiz/:quizId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            <Route path="/class/:id/:examType/chapter/:chapterId/questions" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
            {/* Legacy topic-scoped practice → chapter routes */}
            <Route
              path="/class/:id/:examType/chapter/:chapterId/topic/:topicId/quizzes"
              element={<ProtectedRoute><RedirectLegacyTopicQuizList /></ProtectedRoute>}
            />
            <Route
              path="/class/:id/:examType/chapter/:chapterId/topic/:topicId/quiz/:quizId"
              element={<ProtectedRoute><RedirectLegacyTopicQuiz /></ProtectedRoute>}
            />
            <Route
              path="/class/:id/:examType/chapter/:chapterId/topic/:topicId/questions"
              element={<ProtectedRoute><RedirectLegacyTopicQuestions /></ProtectedRoute>}
            />

            {/* Academics (learn) */}
            <Route path="/class/:id/:examType/chapter/:chapterId/learn/:topicId" element={<ProtectedRoute><TopicLessonPage /></ProtectedRoute>} />
            <Route path="/class/:id/:examType/chapter/:chapterId" element={<ProtectedRoute><ChapterDetailPage /></ProtectedRoute>} />
            <Route path="/class/:id/:examType" element={<ProtectedRoute><ClassDetail /></ProtectedRoute>} />

            {/* Legacy underscore / bare class URLs */}
            <Route path="/class/:classId/chapter/:chapterId/learn/:topicId" element={<ProtectedRoute><RedirectLegacyLessonPath /></ProtectedRoute>} />
            <Route path="/class/:classId/chapter/:chapterId" element={<ProtectedRoute><RedirectLegacyChapterPath /></ProtectedRoute>} />
            <Route path="/class/:id" element={<ProtectedRoute><RedirectLegacyClassPath /></ProtectedRoute>} />
            <Route path="/chapter/:id" element={<ProtectedRoute><ChapterDetailPage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
