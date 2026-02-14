import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const navigate = useNavigate();
  const location = useLocation();

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    // Here you would implement actual language change logic
    console.log(`Language changed to ${lang}`);
  };

  const languages = ['English', 'Spanish', 'French', 'German', 'Italian'];

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <i className="bi bi-music-note-beamed"></i>
          </div>
          <span className="logo-text">Hymnify</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
        </button>

        {/* Navigation Links */}
        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                <i className="bi bi-house-door"></i>
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/about" 
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              >
                <i className="bi bi-info-circle"></i>
                <span>About</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/features" 
                className={`nav-link ${location.pathname === '/features' ? 'active' : ''}`}
              >
                <i className="bi bi-stars"></i>
                <span>Features</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/pricing" 
                className={`nav-link ${location.pathname === '/pricing' ? 'active' : ''}`}
              >
                <i className="bi bi-currency-dollar"></i>
                <span>Pricing</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/contact" 
                className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
              >
                <i className="bi bi-envelope"></i>
                <span>Contact</span>
              </Link>
            </li>
          </ul>

          {/* Right Side Actions */}
          <div className="nav-actions">
            {/* Language Dropdown */}
            <div className="language-dropdown">
              <button className="language-btn">
                <i className="bi bi-globe2"></i>
                <span className="d-none d-lg-inline">{language}</span>
                <i className="bi bi-chevron-down"></i>
              </button>
              <div className="dropdown-content">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    className={`dropdown-item ${language === lang ? 'active' : ''}`}
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Login/Signup Buttons */}
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Log In</span>
              </Link>
              <Link to="/signup" className="btn-signup">
                <span>Sign Up</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            {/* User Profile (when logged in) - Example */}
            {/* <div className="user-profile">
              <img src="/default-avatar.png" alt="User" className="user-avatar" />
              <span className="user-name">John Doe</span>
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;