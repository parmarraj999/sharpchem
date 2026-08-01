import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './chapterListPage.css';
import { db } from '../../../firebase/firebase.config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import {
    resolvePracticeClassId,
    practiceTrackLabel,
} from '../../../utils/practiceRoutes';

const ChapterListPage = () => {
    const { id, examType } = useParams();
    const navigate = useNavigate();
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);

    const classId = resolvePracticeClassId(id, examType);
    const trackLabel = practiceTrackLabel(id, examType);

    useEffect(() => {
        const fetchChapters = async () => {
            if (!classId) return;
            setLoading(true);
            try {
                const chaptersRef = collection(db, 'class_data', classId, 'chapters');
                const q = query(chaptersRef, orderBy('order', 'asc'));
                const querySnapshot = await getDocs(q);

                const chaptersData = querySnapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data(),
                }));
                setChapters(chaptersData);
            } catch (error) {
                console.error('Error fetching practice chapters:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChapters();
    }, [classId]);

    const handleViewTopics = (chapterId) => {
        navigate(`/class/${id}/${examType}/chapter/${chapterId}/topics`);
    };

    const handleBack = () => {
        navigate('/practice');
    };

    return (
        <div className="chapter-list-container">
            <div className="chapter-header">
                <button type="button" className="ch-back-button" onClick={handleBack}>
                    <svg style={{ width: '25px', color: 'black' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path></svg>
                </button>
                <h1 className="page-title">
                    {trackLabel} Chapters
                </h1>
            </div>

            {loading ? (
                <div className="loading-container">
                    <p>Loading chapters...</p>
                </div>
            ) : chapters.length > 0 ? (
                <div className="chapters-grid">
                    {chapters.map((chapter) => (
                        <div key={chapter.id} className="chapter-card">
                            <div className="chapter-content">
                                <h2 className="chapter-name">{chapter.name}</h2>
                                <p className="chapter-description">{chapter.description}</p>
                            </div>
                            <button
                                type="button"
                                className="view-topics-button"
                                onClick={() => handleViewTopics(chapter.id)}
                            >
                                View Topics →
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-chapters">
                    <p>No chapters available for {trackLabel}</p>
                </div>
            )}
        </div>
    );
};

export default ChapterListPage;
