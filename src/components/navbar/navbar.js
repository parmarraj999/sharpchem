import React, { useState } from 'react'
import './navbar.css'
import { Link } from 'react-router-dom';


function Navbar() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (

    <header className="navbar">
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

        <Link to='/login' className="auth-button">Login / Register</Link>
      </div>
    </header>
  )
}

export default Navbar