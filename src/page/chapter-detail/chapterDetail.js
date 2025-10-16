import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import './chapterDetail.css'
import { useNavigate } from 'react-router-dom';

const ChapterDetailPage = () => {

    const navigate = useNavigate();

  const handleBackClick = () => {
    // Navigate to chapter list page
    console.log('Navigate to chapter list');
    navigate(-1)
  };

  const handleDownloadNotes = () => {
    // Handle notes download
    console.log('Download notes');
  };

  return (
    <div className="chapter-detail-page">

      <div className="chapter-container">
        <header className="header">
          <button className="back-button" onClick={handleBackClick}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="header-title">Chapter 1: Introduction to React</h1>
        </header>

        <div className="content">
          {/* Description Section */}
          <section className="section">
            <h2 className="section-title">Chapter Description</h2>
            <p className="description-text">
              This chapter introduces you to the fundamentals of React, a powerful JavaScript library 
              for building user interfaces. You'll learn about component-based architecture, JSX syntax, 
              and how React efficiently updates the DOM using its virtual DOM implementation. We'll explore 
              the core concepts that make React one of the most popular frontend frameworks today, including 
              props, state management, and the component lifecycle. By the end of this chapter, you'll have 
              a solid foundation to start building your own React applications and understand why React has 
              become the go-to choice for modern web development.
            </p>
          </section>

          {/* Notes Section */}
          <section className="section">
            <h2 className="section-title">Notes</h2>
            <div className="notes-container">
              <div className="notes-info">
                <p className="notes-text">Chapter notes are available for download</p>
                <p className="notes-subtext">PDF format • Last updated: Oct 2025</p>
              </div>
              <button className="download-button" onClick={handleDownloadNotes}>
                <Download size={20} />
                Download Notes
              </button>
            </div>
          </section>

          {/* Video Section */}
          <section className="section">
            <h2 className="section-title">YouTube Video</h2>
            <div className="video-container">
              <iframe
                src="https://www.youtube.com/embed/SqcY0GlETPk"
                title="React Tutorial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetailPage;