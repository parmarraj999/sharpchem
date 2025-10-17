import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './page/home-page/homePage';
import AcademicsPage from './page/academic-page/academic';
import Navbar from './components/navbar/navbar';
import Login from './page/auth/login';
import Signup from './page/auth/signup';
import ChapterDetailPage from './page/chapter-detail/chapterDetail';
import ClassDetail from './page/chapter-page/classPage';
import QuizePage from './page/practice/activity/quizePage';
import QuestionsPage from './page/practice/activity/questionsPage';
import ChapterListPage from './page/practice/chapterList/chapterListPage';
import TopicListPage from './page/practice/topic-page/topicPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/academic' element={<AcademicsPage/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/class/:id' element={<ClassDetail/>} />
          <Route path='/class/:id/:examType/quizzes' element={<QuizePage/>}/>
          <Route path='/class/:id/:examType/chapterList' element={<ChapterListPage/>} />
          <Route path='/class/:id/:examType/chapter/:chapterId/topics' element={<TopicListPage/>} />
          <Route path='/class/:id/:examType/chapter/:chapterId/topic/:topicId/questions'  element={<QuestionsPage/>}/>
          <Route path='/chapter/:id' element={<ChapterDetailPage/>} />
        </Routes>
      </BrowserRouter>
     {/* <HomePage/> */}
    </div>
  );
}

export default App;
