import React, { useState, useEffect } from 'react';
import './classPage.css'
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase.config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const ClassDetail = () => {
  const [classDataGrouped, setClassDataGrouped] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const classes = [
    { id: 'class_9', name: 'Class 9 (Standard)', description: 'Core School Foundation' },
    { id: 'class_10', name: 'Class 10 (Standard)', description: 'Secondary Board Prep' },
    { id: 'class_11', name: 'Class 11 (Standard)', description: 'Senior Secondary Core' },
    { id: 'class_12', name: 'Class 12 (Standard)', description: 'Higher Secondary Board' },
    { id: '11_jee', name: 'Class 11 JEE', description: 'JEE Main & Advanced' },
    { id: '11_neet', name: 'Class 11 NEET', description: 'NEET Medical Entrance' },
    { id: '12_jee', name: 'Class 12 JEE', description: 'Advanced Engineering Finals' },
    { id: '12_neet', name: 'Class 12 NEET', description: 'Medical Entrance Finals' }
  ];

  useEffect(() => {
    const fetchAllChapters = async () => {
      setLoading(true);
      try {
        const groupedData = [];

        await Promise.all(classes.map(async (cls) => {
          const chaptersRef = collection(db, 'class_data', cls.id, 'chapters');
          const q = query(chaptersRef, orderBy('order', 'asc'));
          const querySnapshot = await getDocs(q);
          
          const chaptersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          if (chaptersData.length > 0) {
            groupedData.push({
              classInfo: cls,
              chapters: chaptersData
            });
          }
        }));

        // Sort groupedData to maintain the original order defined in `classes` array
        groupedData.sort((a, b) => {
          const indexA = classes.findIndex(c => c.id === a.classInfo.id);
          const indexB = classes.findIndex(c => c.id === b.classInfo.id);
          return indexA - indexB;
        });

        setClassDataGrouped(groupedData);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllChapters();
  }, []);

  const handleLearnNow = (chapter, classId) => {
    navigate(`/chapter/${chapter.id}`, { state: { chapter, classId } });
  };

  return (
    <div className="chapters-page">
      <header className="chapters-header">
        <div className="header-content">
          <h1 className="class-title">All Classes Chemistry</h1>
          <p className="class-subtitle">Explore comprehensive chapters grouped by class</p>
        </div>
      </header>

      <section className="chapters-section">
        <div className="chapters-container">
          {loading ? (
            <div className="loading-container">
              <p>Loading classes and chapters...</p>
            </div>
          ) : classDataGrouped.length > 0 ? (
            classDataGrouped.map((group) => (
              <div key={group.classInfo.id} className="class-group-section">
                <div className="class-group-header">
                  <h2>{group.classInfo.name}</h2>
                  <p>{group.classInfo.description}</p>
                </div>
                <div className="chapters-grid">
                  {group.chapters.map((chapter, index) => (
                    <div key={chapter.id} className="chapter-card">
                      <div className="chapter-number">Chapter {chapter.order || index + 1}</div>
                      <h3 className="chapter-title">{chapter.name}</h3>
                      <p className="chapter-desc">{chapter.description}</p>
                      <button className="learn-btn" onClick={() => handleLearnNow(chapter, group.classInfo.id)}>
                        Learn Now →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="no-chapters">
              <p>No chapters available across any class.</p>
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