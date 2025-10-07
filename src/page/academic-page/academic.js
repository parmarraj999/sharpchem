import React, { useState } from 'react';
import './academic.css';
import { Link } from 'react-router-dom';

const AcademicsPage = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  const classData = {
    9: {
      title: "Class 9 Chemistry",
      description: "Learn basic concepts and experiments",
      topics: [
        "Matter in Our Surroundings",
        "Is Matter Around Us Pure?",
        "Atoms and Molecules",
        "Structure of the Atom",
        "The Fundamental Unit of Life"
      ],
      color: "#1e88e5"
    },
    10: {
      title: "Class 10 Chemistry",
      description: "Build your chemical reactions foundation",
      topics: [
        "Chemical Reactions and Equations",
        "Acids, Bases and Salts",
        "Metals and Non-metals",
        "Carbon and its Compounds",
        "Periodic Classification of Elements"
      ],
      color: "#1976d2"
    },
    11: {
      title: "Class 11 Chemistry",
      description: "Dive into advanced concepts and theories",
      topics: [
        "Some Basic Concepts of Chemistry",
        "Structure of Atom",
        "Classification of Elements",
        "Chemical Bonding",
        "States of Matter",
        "Thermodynamics",
        "Equilibrium",
        "Redox Reactions",
        "Organic Chemistry Basics",
        "Hydrocarbons"
      ],
      color: "#1565c0"
    },
    12: {
      title: "Class 12 Chemistry",
      description: "Master Chemistry for competitive exams",
      topics: [
        "Solutions",
        "Electrochemistry",
        "Chemical Kinetics",
        "Surface Chemistry",
        "General Principles of Isolation of Elements",
        "p-Block Elements",
        "d and f Block Elements",
        "Coordination Compounds",
        "Haloalkanes and Haloarenes",
        "Alcohols, Phenols and Ethers",
        "Aldehydes, Ketones and Carboxylic Acids",
        "Amines",
        "Biomolecules",
        "Polymers"
      ],
      color: "#0d47a1"
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
    const toggleMobileMenu = () => {
      setMobileMenuOpen(!mobileMenuOpen);
    };

  return (
    <div className="academics-page">
      {/* Navbar */}
  

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1 className="hero-title">Explore Class-wise Chemistry Topics</h1>
          <p className="hero-subtitle">Build your Chemistry foundation step by step.</p>
          <div className="hero-icons">
            <span className="hero-icon">🧪</span>
            <span className="hero-icon">⚛️</span>
            <span className="hero-icon">🔬</span>
          </div>
        </div>
      </section>

      {/* Class Grid Section */}
      <section className="class-grid-section">
        <div className="container">
          <h2 className="section-title">Choose Your Class</h2>
          <div className="class-grid">
            {Object.entries(classData).map(([classNum, data]) => (
              <div key={classNum} className="class-card">
                <div className="card-header">
                  <div className="class-badge">Class {classNum}</div>
                  <div className="chemistry-icon">⚗️</div>
                </div>
                <h3 className="card-title">{data.title}</h3>
                <p className="card-description">{data.description}</p>
                <div className="card-stats">
                  <span className="stat">
                    <span className="stat-icon">📚</span>
                    {data.topics.length} Topics
                  </span>
                  <span className="stat">
                    <span className="stat-icon">✅</span>
                    Interactive
                  </span>
                </div>
                <button 
                  className="view-topics-btn"
                  onClick={() => setSelectedClass(classNum)}
                >
                  View Topics
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Modal */}
      {selectedClass && (
        <div className="modal-overlay" onClick={() => setSelectedClass(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedClass(null)}>×</button>
            <h2 className="modal-title">{classData[selectedClass].title}</h2>
            <p className="modal-subtitle">{classData[selectedClass].description}</p>
            <div className="topics-list">
              {classData[selectedClass].topics.map((topic, index) => (
                <div key={index} className="topic-item">
                  <span className="topic-number">{index + 1}</span>
                  <span className="topic-name">{topic}</span>
                  <button className="topic-btn">Start Learning →</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Section */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-content">
            <div className="featured-icon">✨</div>
            <h2 className="featured-title">What Makes Our Content Special?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">📝</div>
                <h3>Interactive Notes</h3>
                <p>Comprehensive and easy-to-understand study materials</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <h3>Topic-wise Quizzes</h3>
                <p>Test your knowledge after each chapter</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <h3>Chapter Summaries</h3>
                <p>Quick revision notes for exam preparation</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎓</div>
                <h3>Expert Guidance</h3>
                <p>Learn from experienced Chemistry educators</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3 className="footer-logo">
              <span className="logo-icon">⚗️</span>
              SharpChem.in
            </h3>
            <p className="footer-desc">Your complete Chemistry learning platform</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#academics">Academics</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#practice">Practice Papers</a></li>
              <li><a href="#tests">PYQs & Tests</a></li>
              <li><a href="#mechanisms">Mechanisms</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="#" className="social-icon">📘</a>
              <a href="#" className="social-icon">📷</a>
              <a href="#" className="social-icon">🐦</a>
              <a href="#" className="social-icon">📧</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 SharpChem.in. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AcademicsPage;