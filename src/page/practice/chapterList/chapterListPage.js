import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './chapterListPage.css';

const ChapterListPage = () => {
    const { id, examType } = useParams();
    const navigate = useNavigate();

    // Dummy chapter data
    const chapters = {
        '11': {
            jee: [
                {
                    id: 1,
                    name: 'Sets, Relations and Functions',
                    description: 'Introduction to set theory, types of relations, and various functions including domain and range.'
                },
                {
                    id: 2,
                    name: 'Complex Numbers',
                    description: 'Understanding complex numbers, their operations, properties, and geometric representation.'
                },
                {
                    id: 3,
                    name: 'Quadratic Equations',
                    description: 'Solving quadratic equations, nature of roots, and applications in real-world problems.'
                },
                {
                    id: 4,
                    name: 'Sequences and Series',
                    description: 'Arithmetic and geometric progressions, harmonic progression, and special series.'
                },
                {
                    id: 5,
                    name: 'Permutations and Combinations',
                    description: 'Fundamental principles of counting, permutations, combinations, and their applications.'
                },
                {
                    id: 6,
                    name: 'Binomial Theorem',
                    description: 'Binomial expansion for positive integral index, general and middle terms.'
                }
            ],
            neet: [
                {
                    id: 1,
                    name: 'The Living World',
                    description: 'Introduction to biology, characteristics of living organisms, and taxonomic categories.'
                },
                {
                    id: 2,
                    name: 'Biological Classification',
                    description: 'Five kingdom classification system, hierarchy of classification, and nomenclature.'
                },
                {
                    id: 3,
                    name: 'Plant Kingdom',
                    description: 'Classification of plants, algae, bryophytes, pteridophytes, gymnosperms, and angiosperms.'
                },
                {
                    id: 4,
                    name: 'Animal Kingdom',
                    description: 'Basis of animal classification, different phyla, and their characteristics.'
                },
                {
                    id: 5,
                    name: 'Morphology of Flowering Plants',
                    description: 'Root, stem, leaf, inflorescence, flower, fruit, and seed structure and modifications.'
                }
            ]
        },
        '12': {
            jee: [
                {
                    id: 1,
                    name: 'Relations and Functions',
                    description: 'Types of relations, types of functions, composition of functions, and inverse functions.'
                },
                {
                    id: 2,
                    name: 'Inverse Trigonometric Functions',
                    description: 'Definition, domain, range, and properties of inverse trigonometric functions.'
                },
                {
                    id: 3,
                    name: 'Matrices',
                    description: 'Types of matrices, matrix operations, transpose, symmetric and skew-symmetric matrices.'
                },
                {
                    id: 4,
                    name: 'Determinants',
                    description: 'Properties of determinants, minors, cofactors, and applications in solving equations.'
                }
            ],
            neet: [
                {
                    id: 1,
                    name: 'Reproduction in Organisms',
                    description: 'Modes of reproduction, asexual and sexual reproduction in plants and animals.'
                },
                {
                    id: 2,
                    name: 'Sexual Reproduction in Flowering Plants',
                    description: 'Flower structure, pollination, fertilization, and seed development.'
                },
                {
                    id: 3,
                    name: 'Human Reproduction',
                    description: 'Male and female reproductive systems, menstrual cycle, and fertilization.'
                }
            ]
        }
    };

    const currentChapters = chapters[id]?.[examType.toLowerCase()] || [];

    const handleViewTopics = (chapterId) => {
        navigate(`/class/${id}/${examType}/chapter/${chapterId}/topics`);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="chapter-list-container">
            <div className="chapter-header">
                <button className="ch-back-button" onClick={handleBack}>
                    <svg style={{ width: '25px', color: 'black' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path></svg>
                </button>
                <h1 className="page-title">
                    Class {id} – {examType.toUpperCase()} Chapters
                </h1>
            </div>

            {currentChapters.length > 0 ? (
                <div className="chapters-grid">
                    {currentChapters.map((chapter) => (
                        <div key={chapter.id} className="chapter-card">
                            <div className="chapter-content">
                                <h2 className="chapter-name">{chapter.name}</h2>
                                <p className="chapter-description">{chapter.description}</p>
                            </div>
                            <button
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
                    <p>No chapters available for Class {id} - {examType.toUpperCase()}</p>
                </div>
            )}
        </div>
    );
};

export default ChapterListPage;