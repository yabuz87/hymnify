import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Apply theme on mount and change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
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

            {/* Theme Toggle — rightmost */}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <i className="bi bi-moon"></i>
              ) : (
                <i className="bi bi-sun"></i>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;