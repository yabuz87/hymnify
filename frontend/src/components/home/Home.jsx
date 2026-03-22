import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* ── Hero Section ── */}
      <section className="home-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Digital Home for your <span className="text-highlight">Choir's Heritage</span>
            </h1>
            <p className="hero-subtitle">
              Format, organize, and preserve your church's gospel music legacy with a modern cloud-based sanctuary.
            </p>
            <div className="hero-cta-group">
              <Link to="/signup" className="btn-primary-glow">Get Started Free</Link>
              <Link to="/about" className="btn-outline-white">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Highlights ── */}
      <section className="highlights-section">
        <div className="container">
          <div className="highlights-grid">
            <div className="highlight-item fade-in">
              <div className="highlight-icon">
                <i className="bi bi-cloud-check"></i>
              </div>
              <h3>Cloud Archiving</h3>
              <p>Securely store your choir's lyrics and albums in the cloud, accessible anywhere, anytime.</p>
            </div>
            <div className="highlight-item fade-in delay-1">
              <div className="highlight-icon">
                <i className="bi bi-search-heart"></i>
              </div>
              <h3>Smart Search</h3>
              <p>Find any song or verse instantly with our optimized Amharic-friendly search engine.</p>
            </div>
            <div className="highlight-item fade-in delay-2">
              <div className="highlight-icon">
                <i className="bi bi-share"></i>
              </div>
              <h3>Public Library</h3>
              <p>Share your church's public albums with the global gospel community or keep them private.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Call to Action Banner ── */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-card fade-in">
            <div className="cta-text">
              <h2>Ready to Digitalize your Choir?</h2>
              <p>Join over 100+ churches already preserving their gospel legacy with Hymnify.</p>
            </div>
            <Link to="/signup" className="btn-white-large">Create Choir Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
