import React, { useState } from 'react'
import './navbar.css'
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


function Navbar() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const { pathname } = useLocation();

  return (

    <header className="navbar" style={pathname.startsWith('/profile/') || pathname === ('/student-detail') || pathname === ('/signup') || pathname === ('/login') ? { display: 'none' } : {}}>
      <div className="navbar-container">
        <Link to='/' className="logo">SharpChem.in</Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to='/' onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to='/academic' onClick={() => setMobileMenuOpen(false)}>Academics</Link>
          <Link to='/practice' onClick={() => setMobileMenuOpen(false)}>Practice</Link>
          <Link to='/blog' onClick={() => setMobileMenuOpen(false)}>Blog</Link>
          <Link to='/about' onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link to='/contact' onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </nav>
        {
          currentUser ?
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                <span></span>
                <span></span>
                <span></span>
              </button>
              <Link to={`/profile/${currentUser.uid}`} style={{ width: '45px', height: '45px', borderRadius: '50%' }}>
                <img
                  src={currentUser.photoURL || 'https://i.pinimg.com/1200x/38/6c/52/386c5283f14bdca0fa14e28dd18fb574.jpg'}
                  alt="Profile"
                  style={{ borderRadius: '50%', width: '100%', height: "100%" }}
                />
              </Link>
            </div>
            :
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                <span></span>
                <span></span>
                <span></span>
              </button>
              <Link to='/login' className="auth-button">Login / Register</Link>
            </div>
        }
      </div>
    </header>
  )
}

export default Navbar