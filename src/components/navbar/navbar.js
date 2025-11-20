import React, { useEffect, useRef, useState } from 'react'
import './navbar.css'
import { Link, useLocation } from 'react-router-dom';


function Navbar() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const { pathname } = useLocation();
  const isLogIn = window.localStorage.getItem('isLogIn');

  return (

    <header className="navbar" style={pathname.startsWith('/profile/') || pathname === ('/student-detail') || pathname === ('/signup') || pathname === ('/login') ? { display: 'none' } : {}}>
      <div className="navbar-container">
        <Link to='/' className="logo">SharpChem.in</Link>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to='/' onClick={() => setMobileMenuOpen(false)} href="#home">Home</Link>
          <a href="#about">About</a>
          <Link to='/academic' href="#academics" onClick={() => setMobileMenuOpen(false)}>Academics</Link>
          <a href="#practice">Practice</a>
          <a href="#tests">PYQs & Tests</a>
          <a href="#mechanisms">Mechanisms</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>
        </nav>
        {
          isLogIn ?
            <Link to='/profile/123' style={{width:'45px',height:'45px',borderRadius:'50%'}}>
              <img src='https://i.pinimg.com/1200x/38/6c/52/386c5283f14bdca0fa14e28dd18fb574.jpg' style={{borderRadius:'50%',width:'100%',height:"100%"}} />
            </Link>
            :
            <Link to='/login' className="auth-button">Login / Register</Link>
        }
      </div>
    </header>
  )
}

export default Navbar