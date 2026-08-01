import React, { useState } from 'react';
import './navbar.css';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/** Practice routes: /practice or /class/:id/(standard|jee|neet)/... */
const isPracticePath = (pathname) =>
  pathname === '/practice' ||
  pathname.startsWith('/practice/') ||
  /^\/class\/[^/]+\/(standard|jee|neet)(\/|$)/i.test(pathname);

/** Academics: hub, class lists, chapter lessons (not practice drills) */
const isAcademicsPath = (pathname) => {
  if (pathname === '/academic' || pathname.startsWith('/academic/')) return true;
  if (isPracticePath(pathname)) return false;
  if (pathname.startsWith('/class/')) return true;
  if (pathname.startsWith('/chapter/')) return true;
  return false;
};

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const { pathname } = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header
      className="navbar"
      style={
        pathname.startsWith('/profile/') ||
        pathname === '/student-detail' ||
        pathname === '/signup' ||
        pathname === '/login'
          ? { display: 'none' }
          : undefined
      }
    >
      <div className="navbar-container">
        <Link to="/" className="logo">
          SharpChem.in
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'menu-open' : ''}`}>
          <NavLink to="/" end className={navClass} onClick={closeMobileMenu}>
            Home
          </NavLink>
          <Link
            to="/academic"
            className={isAcademicsPath(pathname) ? 'nav-link active' : 'nav-link'}
            onClick={closeMobileMenu}
            aria-current={isAcademicsPath(pathname) ? 'page' : undefined}
          >
            Academics
          </Link>
          <Link
            to="/practice"
            className={isPracticePath(pathname) ? 'nav-link active' : 'nav-link'}
            onClick={closeMobileMenu}
            aria-current={isPracticePath(pathname) ? 'page' : undefined}
          >
            Practice
          </Link>
          <NavLink to="/blog" className={navClass} onClick={closeMobileMenu}>
            Blog
          </NavLink>
          <NavLink to="/about" className={navClass} onClick={closeMobileMenu}>
            About
          </NavLink>
          <NavLink to="/contact" className={navClass} onClick={closeMobileMenu}>
            Contact
          </NavLink>
        </nav>
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <Link
              to={`/profile/${currentUser.uid}`}
              style={{ width: '45px', height: '45px', borderRadius: '50%' }}
            >
              <img
                src={
                  currentUser.photoURL ||
                  'https://i.pinimg.com/1200x/38/6c/52/386c5283f14bdca0fa14e28dd18fb574.jpg'
                }
                alt="Profile"
                style={{ borderRadius: '50%', width: '100%', height: '100%' }}
              />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <Link to="/login" className="auth-button">
              Login / Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
