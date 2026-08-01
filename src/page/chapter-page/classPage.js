import React, { useState, useEffect, useMemo } from 'react';
import './classPage.css'
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/firebase.config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const ALL_CLASSES = [
  { id: 'class_9', name: 'Class 9 (Standard)', description: 'Core School Foundation' },
  { id: 'class_10', name: 'Class 10 (Standard)', description: 'Secondary Board Prep' },
  { id: 'class_11', name: 'Class 11 (Standard)', description: 'Senior Secondary Core' },
  { id: 'class_12', name: 'Class 12 (Standard)', description: 'Higher Secondary Board' },
  { id: '11_jee', name: 'Class 11 JEE', description: 'JEE Main & Advanced' },
  { id: '11_neet', name: 'Class 11 NEET', description: 'NEET Medical Entrance' },
  { id: '12_jee', name: 'Class 12 JEE', description: 'Advanced Engineering Finals' },
  { id: '12_neet', name: 'Class 12 NEET', description: 'Medical Entrance Finals' }
];

/** Map route param (/class/9, /class/class_9, /class/11_jee) to Firestore class entries. */
const resolveClassesForParam = (id) => {
  if (!id) return [];

  const exact = ALL_CLASSES.find((c) => c.id === id);
  if (exact) return [exact];

  if (/^\d+$/.test(id)) {
    const standard = ALL_CLASSES.find((c) => c.id === `class_${id}`);
    return standard ? [standard] : [];
  }

  return [];
};

const ClassDetail = () => {
  const { id } = useParams();
  const [classDataGrouped, setClassDataGrouped] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const classesToFetch = useMemo(() => resolveClassesForParam(id), [id]);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      try {
        if (classesToFetch.length === 0) {
          setClassDataGrouped([]);
          return;
        }

        const groupedData = [];

        await Promise.all(classesToFetch.map(async (cls) => {
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
          } else {
            // Still show the class header when empty so the filter is obvious
            groupedData.push({
              classInfo: cls,
              chapters: []
            });
          }
        }));

        groupedData.sort((a, b) => {
          const indexA = ALL_CLASSES.findIndex(c => c.id === a.classInfo.id);
          const indexB = ALL_CLASSES.findIndex(c => c.id === b.classInfo.id);
          return indexA - indexB;
        });

        setClassDataGrouped(groupedData);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [classesToFetch]);

  const handleLearnNow = (chapter, classId) => {
    navigate(`/class/${classId}/chapter/${chapter.id}`, { state: { chapter, classId } });
  };

  const pageTitle = classesToFetch.length === 1
    ? classesToFetch[0].name
    : 'Class Chemistry';
  const pageSubtitle = classesToFetch.length === 1
    ? classesToFetch[0].description
    : 'Explore chapters for this class';

  return (
    <div className="chapters-page">
      <header className="chapters-header">
        <div className="header-content">
          <h1 className="class-title">{pageTitle}</h1>
          <p className="class-subtitle">{pageSubtitle}</p>
        </div>
      </header>

      <section className="chapters-section">
        <div className="chapters-container">
          {loading ? (
            <div className="loading-container">
              <p>Loading classes and chapters...</p>
            </div>
          ) : classesToFetch.length === 0 ? (
            <div className="no-chapters">
              <p>Unknown class “{id}”. Try Class 9–12 from Academics or Home.</p>
            </div>
          ) : classDataGrouped.some((g) => g.chapters.length > 0) ? (
            classDataGrouped.map((group) => (
              <div key={group.classInfo.id} className="class-group-section">
                {classesToFetch.length > 1 && (
                  <div className="class-group-header">
                    <h2>{group.classInfo.name}</h2>
                    <p>{group.classInfo.description}</p>
                  </div>
                )}
                {group.chapters.length > 0 ? (
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
                ) : (
                  <div className="no-chapters">
                    <p>No chapters available for {group.classInfo.name} yet.</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-chapters">
              <p>No chapters available for {pageTitle} yet.</p>
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
