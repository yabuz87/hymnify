import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../libs/utils.js';
import './home.css';
import HowItWorksCarousel from './carousel/HowItWorksCarousel';

const Home = () => {
  const [stats, setStats] = useState({ churchCount: 0, songCount: 0 });
  const [sampleSongs, setSampleSongs] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchSampleSongs = async () => {
      try {
        const response = await axiosInstance.get('/song/all?limit=10');
        setSampleSongs(response.data.publicSongs || []);
      } catch (error) {
        console.error("Error fetching sample songs:", error);
      }
    };

    fetchStats();
    fetchSampleSongs();
  }, []);

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

      {/* ── Featured Hymns Section ── */}
      {sampleSongs.length > 0 && (
        <section className="featured-songs-section">
          <div className="container">
            <div className="section-header text-center fade-in">
              <h2>Recent Public Hymns</h2>
              <p>Explore the latest additions to the global gospel library.</p>
            </div>
            
            <div className="sample-songs-grid">
              {sampleSongs.map((song, index) => (
                <div key={song._id} className="song-sample-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="song-card-header">
                    <span className="song-category">{song.category || 'General'}</span>
                  </div>
                  <div className="song-card-body">
                    <h4 className="song-title">{song.title}</h4>
                    <p className="song-artist">{song.artist}</p>
                    {song.owner && song.owner.churchName && (
                       <p className="song-church"><i className="bi bi-bank"></i> {song.owner.churchName}</p>
                    )}
                  </div>
                  <div className="song-card-footer">
                     <Link to="/signup" className="btn-view-song">View Lyrics <i className="bi bi-arrow-right"></i></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── How It Works Carousel ── */}
      <HowItWorksCarousel />

      {/* ── Call to Action Banner ── */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-card fade-in">
            <div className="cta-text">
              <h2>Ready to Digitalize your Choir?</h2>
              <p>Join over {stats.churchCount} churches already preserving their gospel legacy with Hymnify.</p>
            </div>

            <Link to="/signup" className="btn-white-large">Create Choir Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
