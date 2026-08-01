import React, { useEffect, useState } from 'react';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase.config';
import './topicNotesPage.css';

const isHttpUrl = (value) =>
    typeof value === 'string' &&
    (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('www.'));

const normalizeUrl = (value) =>
    value?.startsWith('www.') ? `https://${value}` : value;

const isProbablyPdf = (url) => /\.pdf(\?|#|$)/i.test(url) || /application%2Fpdf/i.test(url);

const isProbablyImage = (url) => /\.(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(url);

const TopicNotesPage = () => {
    const { id, examType, chapterId, topicId } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchTopic = async () => {
            setLoading(true);
            try {
                const classId = `${id}_${examType.toLowerCase()}`;
                const topicRef = doc(db, 'class_data', classId, 'chapters', chapterId, 'topics', topicId);
                const snap = await getDoc(topicRef);
                if (!cancelled) {
                    setTopic(snap.exists() ? { id: snap.id, ...snap.data() } : null);
                }
            } catch (error) {
                console.error('Error fetching topic notes:', error);
                if (!cancelled) setTopic(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (id && examType && chapterId && topicId) {
            fetchTopic();
        }

        return () => { cancelled = true; };
    }, [id, examType, chapterId, topicId]);

    const fileUrl = topic?.noteUrl ? normalizeUrl(topic.noteUrl) : null;
    const notesIsLink = isHttpUrl(topic?.notes);
    const notesLink = notesIsLink ? normalizeUrl(topic.notes) : null;
    const markdownNotes = !notesIsLink && topic?.notes?.trim() ? topic.notes : null;
    const hasContent = Boolean(fileUrl || notesLink || markdownNotes);

    return (
        <div className="topic-notes-page">
            <div className="topic-notes-container">
                <button
                    type="button"
                    className="topic-notes-back"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    <ArrowLeft size={22} />
                </button>

                <header className="topic-notes-header">
                    <div className="topic-notes-icon">
                        <FileText size={36} />
                    </div>
                    <div>
                        <h1 className="topic-notes-title">
                            {topic?.name || 'Topic notes'}
                        </h1>
                        <p className="topic-notes-subtitle">
                            Study notes for this topic
                        </p>
                    </div>
                </header>

                {loading ? (
                    <div className="topic-notes-empty">
                        <p>Loading notes…</p>
                    </div>
                ) : !topic ? (
                    <div className="topic-notes-empty">
                        <p>Topic not found.</p>
                    </div>
                ) : !hasContent ? (
                    <div className="topic-notes-empty">
                        <p>No notes available for this topic yet.</p>
                    </div>
                ) : (
                    <div className="topic-notes-body">
                        {fileUrl && (
                            <section className="topic-notes-section">
                                <div className="topic-notes-section-head">
                                    <h2>Attached notes</h2>
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="topic-notes-open-link"
                                    >
                                        Open in new tab
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                                {isProbablyPdf(fileUrl) ? (
                                    <iframe
                                        className="topic-notes-frame"
                                        title={`${topic.name} PDF notes`}
                                        src={fileUrl}
                                    />
                                ) : isProbablyImage(fileUrl) ? (
                                    <img
                                        className="topic-notes-image"
                                        src={fileUrl}
                                        alt={`${topic.name} notes`}
                                    />
                                ) : (
                                    <p className="topic-notes-fallback">
                                        Preview is not available for this file type. Use “Open in new tab”.
                                    </p>
                                )}
                            </section>
                        )}

                        {notesLink && (
                            <section className="topic-notes-section">
                                <div className="topic-notes-section-head">
                                    <h2>External notes</h2>
                                    <a
                                        href={notesLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="topic-notes-open-link"
                                    >
                                        Open link
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                                <p className="topic-notes-fallback">
                                    Notes are hosted externally. Open the link above to view them.
                                </p>
                            </section>
                        )}

                        {markdownNotes && (
                            <section className="topic-notes-section">
                                <div className="topic-notes-section-head">
                                    <h2>Written notes</h2>
                                </div>
                                <article className="topic-notes-markdown">
                                    <ReactMarkdown>{markdownNotes}</ReactMarkdown>
                                </article>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopicNotesPage;
