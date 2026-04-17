import React, { useEffect, useState } from 'react';
import './about.css';
import FunctionalityCarousel from './carousel/FunctionalityCarousel';
import { axiosInstance } from '../../libs/utils.js';

function About() {
  const [stats, setStats] = useState({ churchCount: 0, songCount: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);


  return (
    <div className="about-page">
      {/* ── Hero Section ── */}
      <section className="about-hero">
        <div className="hero-background"></div>
        <div className="container hero-container">
          <div className="hero-content fade-in">
            <div className="hero-badge">Enhancing Worship through Technology</div>
            <h1 className="hero-title">Preserving the Heartbeat of <span className="text-highlight">Gospel Music</span></h1>
            <p className="hero-subtitle">
              Hymnify is the digital sanctuary for Ethiopia's rich gospel heritage. We empower choirs to archive, organize, and share their spiritual legacy with the world.
            </p>
            <div className="hero-actions">
              <a href="/signup" className="btn-primary-large">Get Started Now</a>
              <a href="#vision" className="btn-secondary-large">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="stats-row">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item fade-in">
              <span className="stat-number">{stats.churchCount}+</span>
              <span className="stat-label">Churches Registered</span>
            </div>
            <div className="stat-item fade-in delay-1">
              <span className="stat-number">{stats.songCount}+</span>
              <span className="stat-label">Songs Preserved</span>
            </div>

            <div className="stat-item fade-in delay-2">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Global Access</span>
            </div>
            <div className="stat-item fade-in delay-3">
              <span className="stat-number">100%</span>
              <span className="stat-label">Heritage Protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section id="vision" className="about-section mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-text fade-in">
              <span className="badge">Project Purpose</span>
              <h2>Digital Sanctuary for Worship</h2>
              <p>
                This project aims to serve the church music community and songwriters by providing a cloud-based platform for storing and accessing song lyrics. It is especially designed to support local church choirs by enabling them to securely upload and manage their lyrics, with access limited to members within their group.
              </p>
              <p>
                Through this system, choir members can easily retrieve shared resources anytime, improving collaboration and organization. Ultimately, the project seeks to digitize the song rehearsal process and ensure that musical content is preserved in a reliable digital format.
              </p>
            </div>
            <div className="mission-image fade-in delay-1">
              <div className="abstract-shape"></div>
              <i className="bi bi-cloud-check-fill icon-large"></i>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Benefits (Simpler Impact) ── */}
      <section className="about-section impact-background">
        <div className="container">
          <div className="section-header-centered fade-in">
            <span className="badge">Our Mission</span>
            <h2>Core Benefits</h2>
            <p>Hymnify simplifies gospel music management for churches and believers.</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card fade-in">
              <i className="bi bi-shield-check"></i>
              <h3>Endless Preservation</h3>
              <p>Your choir's spiritual legacy is securely organized and archived in a digital vault that never fades or gets lost.</p>
            </div>
            <div className="benefit-card fade-in delay-1">
              <i className="bi bi-people"></i>
              <h3>Global Community</h3>
              <p>Connect with other choirs, share public albums, and inspire believers across the globe with regional gospel lyrics.</p>
            </div>
            <div className="benefit-card fade-in delay-2">
              <i className="bi bi-search"></i>
              <h3>Instant Access</h3>
              <p>Find any verse or chorus instantly with our optimized search and categorization system across all your devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Functionalities (Carousel) ── */}
      <section className="about-section functionality-section bg-subtle">
        <div className="container">
          <div className="section-header-centered fade-in">
            <span className="badge">Platform Features</span>
            <h2>How it Works</h2>
            <p>Explore the powerful tools designed for modern gospel preservation.</p>
          </div>
          
          <FunctionalityCarousel />
        </div>
      </section>

      {/* ── Community & Future ── */}
      <section className="about-section community-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-block fade-in">
              <h3>Future Vision</h3>
              <ul className="simple-list">
                <li><i className="bi bi-check-circle"></i> Audio & Video Playback</li>
                <li><i className="bi bi-check-circle"></i> Multi-language support</li>
                <li><i className="bi bi-check-circle"></i> AI-Powered Search</li>
              </ul>
            </div>
            <div className="footer-block fade-in delay-1">
              <h3>Join Us</h3>
              <p>We welcome gospel enthusiasts, choirs, and contributors to join our mission.</p>
              <div className="community-links">
                <a href="#" className="btn-social-minimal "><i className="bi bi-telegram"></i></a>
                <a href="#" className="btn-social-minimal"><i className="bi bi-discord"></i></a>
                <a href="https://github.com/yabuz87/hymnify" className="btn-social-minimal"><i className="bi bi-github"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
