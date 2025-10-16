import React, { useState, useEffect } from 'react';
import './classPage.css'
import { useNavigate } from 'react-router-dom';

const ClassDetail = () => {
  const [classNumber, setClassNumber] = useState('9');

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/class\/(\d+)/);
    if (match) {
      setClassNumber(match[1]);
    }
  }, []);

  const chapters = {
    9: [
      { title: "Matter in Our Surroundings", desc: "States of matter and their properties." },
      { title: "Is Matter Around Us Pure?", desc: "Mixtures, compounds, and solutions." },
      { title: "Atoms and Molecules", desc: "Basic building blocks of matter." },
      { title: "Structure of the Atom", desc: "Atomic models and electron configuration." }
    ],
    10: [
      { title: "Chemical Reactions and Equations", desc: "Understanding types of chemical reactions." },
      { title: "Acids, Bases, and Salts", desc: "Properties and reactions of acids and bases." },
      { title: "Metals and Non-Metals", desc: "Properties, reactivity, and applications." },
      { title: "Carbon and Its Compounds", desc: "Organic chemistry basics and carbon bonding." }
    ],
    11: [
      { title: "Some Basic Concepts of Chemistry", desc: "Mole concept and stoichiometry." },
      { title: "Structure of Atom", desc: "Atomic models and quantum mechanics basics." },
      { title: "Classification of Elements", desc: "Modern periodic table and periodicity." },
      { title: "Chemical Bonding", desc: "Ionic, covalent, and metallic bonds." }
    ],
    12: [
      { title: "Solid State", desc: "Crystal structures and unit cells." },
      { title: "Electrochemistry", desc: "Redox reactions and electrochemical cells." },
      { title: "Chemical Kinetics", desc: "Rate of reaction and activation energy." },
      { title: "Surface Chemistry", desc: "Adsorption, colloids, and catalysis." }
    ],
  };

  const currentChapters = chapters[classNumber] || [];

  const handleBackToHome = () => {
    window.history.back();
  };

  const navigate = useNavigate();

  return (
    <div className="chapters-page">
      <header className="chapters-header">
        <div className="header-content">
          <h1 className="class-title">Class {classNumber} Chemistry</h1>
          <p className="class-subtitle">Explore comprehensive chapters designed for excellence</p>
        </div>
      </header>

      <section className="chapters-section">
        <div className="chapters-container">
          {currentChapters.length > 0 ? (
            currentChapters.map((chapter, index) => (
              <div key={index} className="chapter-card">
                <div className="chapter-number">Chapter {index + 1}</div>
                <h3 className="chapter-title">{chapter.title}</h3>
                <p className="chapter-desc">{chapter.desc}</p>
                <button className="learn-btn" onClick={()=>navigate('/chapter/123123')}>
                  Learn Now →
                </button>
              </div>
            ))
          ) : (
            <div className="no-chapters">
              <p>No chapters available for this class.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 SharpChem.in | Empowering Chemistry Education</p>
        </div>
      </footer>
    </div>
  );
};

export default ClassDetail;