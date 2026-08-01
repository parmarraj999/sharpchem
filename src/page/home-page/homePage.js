import React, { useState, useEffect } from 'react';
import './homePage.css';
import { Link, useNavigate } from 'react-router-dom';

import InitialPopup from '../../components/initial-popup/InitialPopup';

const HomePage = () => {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowWelcomePopup(true);
  }, []);

  return (
    <div className="homepage">
      <InitialPopup
        isOpen={showWelcomePopup}
        onClose={() => setShowWelcomePopup(false)}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Master Chemistry the Smart Way 🚀</h1>
          <p className="hero-subtitle">Concepts, Practice & Revision — All in one place.</p>
          <div className="hero-buttons">
            <Link to='/academic' className="btn btn-primary">Start Learning</Link>
            <Link to='/practice' className="btn btn-secondary">Take a Free Test</Link>
          </div>
        </div>
      </section>

      {/* Academics Section */}
      <section className="academics-section" id="academics">
        <div className="container">
          <h2 className="section-title">Learn Class-Wise Chemistry</h2>
          <div className="academics-grid">
            <div className="academic-card">
              <div className="card-icon">9</div>
              <h3>Class 9</h3>
              <p>Build strong foundations with fundamental concepts and basic reactions.</p>
              <button className="card-button" onClick={() => navigate('/class/9')}>Explore Topics</button>
            </div>
            <div className="academic-card">
              <div className="card-icon">10</div>
              <h3>Class 10</h3>
              <p>Master board exam concepts with detailed explanations and practice.</p>
              <button className="card-button" onClick={() => navigate('/class/10')}>Explore Topics</button>
            </div>
            <div className="academic-card">
              <div className="card-icon">11</div>
              <h3>Class 11</h3>
              <p>Dive deep into organic, inorganic, and physical chemistry essentials.</p>
              <button className="card-button" onClick={() => navigate('/class/11')}>Explore Topics</button>
            </div>
            <div className="academic-card">
              <div className="card-icon">12</div>
              <h3>Class 12</h3>
              <p>Ace boards and competitive exams with advanced problem-solving.</p>
              <button className="card-button" onClick={() => navigate('/class/12')}>Explore Topics</button>
            </div>
            <div className="academic-card">
              <div className="card-icon">11</div>
              <h3>Class 11 ( NEET )</h3>
              <p>Ace boards and competitive exams with advanced problem-solving.</p>
              <button className="card-button" onClick={() => navigate('/class/11/neet/chapterList')}>Explore Topics</button>
            </div>
            <div className="academic-card">
              <div className="card-icon">11</div>
              <h3>Class 11( JEE )</h3>
              <p>Ace boards and competitive exams with advanced problem-solving.</p>
              <button className="card-button" onClick={() => navigate('/class/11/jee/chapterList')}>Explore Topics</button>
            </div>
            <div className="academic-card">
              <div className="card-icon">12</div>
              <h3>Class 12 ( NEET )</h3>
              <p>Ace boards and competitive exams with advanced problem-solving.</p>
              <button className="card-button" onClick={() => navigate('/class/12/neet/chapterList')}>Explore Topics</button>
            </div>
            <div className="academic-card">
              <div className="card-icon">12</div>
              <h3>Class 12 ( JEE )</h3>
              <p>Ace boards and competitive exams with advanced problem-solving.</p>
              <button className="card-button" onClick={() => navigate('/class/12/jee/chapterList')}>Explore Topics</button>
            </div>
          </div>
        </div>
      </section>

      {/* Practice & Tests Section */}
      <section className="practice-section" id="practice">
        <div className="container">
          <h2 className="section-title">Prepare for JEE | NEET with Real Practice</h2>
          <div className="practice-grid">
            <div className="practice-card">
              <div className="practice-icon">📝</div>
              <h3>Practice Papers</h3>
              <p>Curated problem sets designed to strengthen your concepts and improve problem-solving speed for competitive exams.</p>
              <button className="card-button">View Papers</button>
            </div>
            <div className="practice-card">
              <div className="practice-icon">🎯</div>
              <h3>PYQs & Online Tests</h3>
              <p>Previous year questions from JEE and NEET with timed tests to simulate real exam conditions and track progress.</p>
              <button className="card-button">Start Testing</button>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanisms Section */}
      <section className="mechanisms-section" id="mechanisms">
        <div className="container">
          <h2 className="section-title">Understand Reaction Mechanisms Easily</h2>
          <div className="mechanisms-grid">
            <div className="mechanism-card">
              <h3>SN1 & SN2 Reactions</h3>
              <p>Learn nucleophilic substitution mechanisms with step-by-step visualizations.</p>
            </div>
            <div className="mechanism-card">
              <h3>Redox Reactions</h3>
              <p>Master oxidation-reduction with electron transfer diagrams and examples.</p>
            </div>
            <div className="mechanism-card">
              <h3>Electrophilic Substitution</h3>
              <p>Understand aromatic chemistry and reaction pathways clearly.</p>
            </div>
            <div className="mechanism-card">
              <h3>Elimination Reactions</h3>
              <p>Explore E1 and E2 mechanisms with detailed explanations and practice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog / Vision Section */}
      <section className="blog-section" id="blog">
        <div className="container">
          <h2 className="section-title">From the Desk of SharpChem</h2>
          <div className="vision-text">
            <p>My vision is to make Chemistry intuitive and exam-ready for every student. Through clear explanations, strategic practice, and visual learning, SharpChem.in aims to transform how students approach and master Chemistry for boards and competitive exams.</p>
          </div>
          <div className="blog-grid">
            <div className="blog-card">
              <div className="blog-date">Oct 5, 2025</div>
              <h3>5 Tips to Master Organic Chemistry</h3>
              <p>Discover proven strategies to understand and remember organic reactions effectively for JEE and NEET.</p>
              <Link to="/blog" className="blog-link">Read More →</Link>
            </div>
            <div className="blog-card">
              <div className="blog-date">Oct 1, 2025</div>
              <h3>How to Approach Physical Chemistry Numericals</h3>
              <p>Learn systematic methods to solve thermodynamics, equilibrium, and kinetics problems quickly.</p>
              <Link to="/blog" className="blog-link">Read More →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-links">
              <Link to="/about">About</Link>
              <Link to="/contact">Help</Link>
              <Link to="/about">FAQs</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-social">
              <Link to="/contact" className="social-link">Twitter</Link>
              <Link to="/contact" className="social-link">Instagram</Link>
              <Link to="/contact" className="social-link">YouTube</Link>
            </div>
          </div>
          <div className="footer-copyright">
            <p>Copyright © 2025 SharpChem.in. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;