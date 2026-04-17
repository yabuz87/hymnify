import React, { useState, useEffect } from 'react';
import './contact.css';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        
        {/* Info Section */}
        <div className="contact-info-section">
          <div>
            <h1>We'd love to <br/> hear from you.</h1>
            <p className="lead">
              Have questions about setting up your choir account? Or just want to 
              say hello? Our team is here to help you get the most out of Hymnify.
            </p>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <i className="bi bi-envelope-at"></i>
            </div>
            <div className="info-content">
              <h4>Email us</h4>
              <p>support@hymnify.app</p>
              <p>info@hymnify.app</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <i className="bi bi-geo-alt"></i>
            </div>
            <div className="info-content">
              <h4>Our Location</h4>
              <p>Addis Ababa, Ethiopia</p>
              <p>Bole Sub-city, Street 12</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <i className="bi bi-chat-dots"></i>
            </div>
            <div className="info-content">
              <h4>Social Channels</h4>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <i className="bi bi-facebook" style={{ cursor: 'pointer', fontSize: '1.2rem' }}></i>
                <i className="bi bi-telegram" style={{ cursor: 'pointer', fontSize: '1.2rem' }}></i>
                <i className="bi bi-twitter-x" style={{ cursor: 'pointer', fontSize: '1.2rem' }}></i>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="contact-form-card">
          {submitted && (
            <div className="success-banner">
              <i className="bi bi-check-circle-fill"></i>
              <span>Thank you! Your message has been sent successfully.</span>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name" 
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com" 
              />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                name="subject" 
                required 
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?" 
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea 
                name="message" 
                required 
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <button type="submit" className="btn-send" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  Sending...
                </>
              ) : (
                <>
                  Send Message <i className="bi bi-send-fill"></i>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
