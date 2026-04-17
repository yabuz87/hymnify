import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './features.css';

const Features = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featureList = [
    {
      icon: 'bi-cloud-arrow-up',
      title: 'Cloud Lyrics Repository',
      description: 'Ditch the paper and physical hymn books. Store all your church lyrics in a secure, centralized cloud database accessible from anywhere.'
    },
    {
      icon: 'bi-phone-flip',
      title: 'Seamless Mobile Sync',
      description: 'Upload on the web, view on the mobile app. All changes synchronize instantly across your choir member devices.'
    },
    {
      icon: 'bi-shield-lock',
      title: 'Privacy & Security',
      description: 'Choose between public sharing or private choir access. Your intellectual property and rehearsal materials are protected.'
    },
    {
      icon: 'bi-wifi-off',
      title: 'Full Offline Access',
      description: 'Choir members can download hymns to their mobile devices for offline use during rehearsals or services with poor connectivity.'
    },
    {
      icon: 'bi-collection-play',
      title: 'Album Grouping',
      description: 'Organize your song collection into logical albums or volumes for easier navigation and thematic grouping.'
    },
    {
      icon: 'bi-people',
      title: 'Choir Collaboration',
      description: 'Designed specifically for local church music communities to improve coordination and preservation of heritage music.'
    }
  ];

  return (
    <div className="features-page">
      <div className="features-header">
        <span className="features-badge">Platform Overview</span>
        <h1>Built for Modern <br/> Church Music Ministry</h1>
        <p className="lead">
          Hymnify provides all the tools you need to digitize your song rehearsal process 
          and ensure your musical traditions are preserved for generations.
        </p>
      </div>

      <div className="features-grid">
        {featureList.map((feature, index) => (
          <div 
            key={index} 
            className="feature-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="feature-icon-wrapper">
              <i className={`bi ${feature.icon}`}></i>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="features-cta">
        <div className="cta-content">
          <h2>Ready to transform your choir?</h2>
          <p>
            Join hundreds of churches already using Hymnify to manage their 
            musical heritage and improve rehearsal efficiency.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn-cta">
              Get Started for Free <i className="bi bi-arrow-right"></i>
            </Link>
            <Link to="/contact" className="btn-cta" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.3)' }}>
              Talk to Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
