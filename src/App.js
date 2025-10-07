import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './page/home-page/homePage';
import AcademicsPage from './page/academic-page/academic';
import Navbar from './page/navbar/navbar';
import Login from './page/auth/login';
import Signup from './page/auth/signup';

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
        </Routes>
      </BrowserRouter>
     {/* <HomePage/> */}
    </div>
  );
}

export default App;
