import { BrowserRouter, Route, Routes, Navigate, useParams } from 'react-router-dom';
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

/** Legacy class-level /quizzes URL had no quizId — send users to chapter list instead. */
const RedirectToChapterList = () => {
  const { id, examType } = useParams();
  return <Navigate to={`/class/${id}/${examType}/chapterList`} replace />;
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
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />

            {/* Protected Routes */}
            <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path='/profile/:id' element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path='/student-detail' element={<ProtectedRoute><StudentDetailsForm /></ProtectedRoute>} />
            <Route path='/academic' element={<ProtectedRoute><AcademicsPage /></ProtectedRoute>} />
            <Route path='/practice' element={<ProtectedRoute><PracticeHub /></ProtectedRoute>} />
            <Route path='/blog' element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
            <Route path='/about' element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
            <Route path='/contact' element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
            <Route path='/class/:id' element={<ProtectedRoute><ClassDetail /></ProtectedRoute>} />
            <Route path='/class/:id/:examType/quizzes' element={<ProtectedRoute><RedirectToChapterList /></ProtectedRoute>} />
            <Route path='/class/:id/:examType/chapterList' element={<ProtectedRoute><ChapterListPage /></ProtectedRoute>} />
            <Route path='/class/:id/:examType/chapter/:chapterId/topics' element={<ProtectedRoute><TopicListPage /></ProtectedRoute>} />
            <Route path='/class/:id/:examType/chapter/:chapterId/topic/:topicId/quizzes' element={<ProtectedRoute><QuizListPage /></ProtectedRoute>} />
            <Route path='/class/:id/:examType/chapter/:chapterId/topic/:topicId/quiz/:quizId' element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            <Route path='/class/:id/:examType/chapter/:chapterId/topic/:topicId/questions' element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
            <Route path='/class/:classId/chapter/:chapterId/learn/:topicId' element={<ProtectedRoute><TopicLessonPage /></ProtectedRoute>} />
            <Route path='/class/:classId/chapter/:chapterId' element={<ProtectedRoute><ChapterDetailPage /></ProtectedRoute>} />
            <Route path='/chapter/:id' element={<ProtectedRoute><ChapterDetailPage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
