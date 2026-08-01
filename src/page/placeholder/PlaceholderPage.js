import React from 'react';
import { Link } from 'react-router-dom';
import './PlaceholderPage.css';

const PlaceholderPage = ({ title, description, ctaLabel = 'Back to Home', ctaTo = '/' }) => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <p className="placeholder-eyebrow">Coming soon</p>
        <h1 className="placeholder-title">{title}</h1>
        <p className="placeholder-description">{description}</p>
        <Link to={ctaTo} className="placeholder-cta">
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
};

export const BlogPage = () => (
  <PlaceholderPage
    title="Blog"
    description="Chemistry tips, revision strategies, and exam updates are on the way. Check back soon."
  />
);

export const AboutPage = () => (
  <PlaceholderPage
    title="About SharpChem"
    description="We're building a clearer way to learn Chemistry for boards and competitive exams. More about our mission is coming here."
  />
);

export const ContactPage = () => (
  <PlaceholderPage
    title="Contact"
    description="Support and partnership contact options will appear here. In the meantime, reach out via the email listed in the project README."
  />
);

export default PlaceholderPage;
