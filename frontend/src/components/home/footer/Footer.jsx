import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="hymnify-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <i className="bi bi-music-note-beamed"></i>
              <span>Hymnify</span>
            </div>
            <p className="footer-vision">
              Preserving Ethiopia's gospel music legacy by building a unified digital archive of church and public gospel songs.
            </p>
          </div>
          
          <div className="footer-links-group">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/features">Features</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Open Source</h4>
            <ul className="footer-links">
              <li>
                <a href="https://github.com/yabuz87/hymnify" target="_blank" rel="noopener noreferrer" className="github-link">
                  <i className="bi bi-github"></i> GitHub Repository
                </a>
              </li>
              <li><a href="#">Contribute</a></li>
              <li><a href="#">MIT License</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; {currentYear} Hymnify. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
