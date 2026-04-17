import React, { useState, useEffect } from 'react';
import './carousel.css';

const steps = [
  {
    icon: 'bi-person-plus-fill',
    title: '1. Create Choir Account',
    description: 'Sign up as a choir administrator to unlock your secure digital sanctuary and start managing your musical heritage.'
  },
  {
    icon: 'bi-cloud-upload-fill',
    title: '2. Upload Songs',
    description: 'Add individual tracks or full albums seamlessly. Fill in the title, artist, and set the visibility to public or private.'
  },
  {
    icon: 'bi-file-earmark-text-fill',
    title: '3. Format Lyrics Easily',
    description: 'When pasting lyrics, simply use a comma (,) at the end of each line. Our system will automatically format them into perfect verse line breaks!'
  }
];

const HowItWorksCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % steps.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);

  return (
    <section className="how-it-works-section" style={{ padding: '6rem 0', background: 'var(--bg-subtle)' }}>
      <div className="container">
        <div className="section-header text-center fade-in">
          <h2>How It <span className="text-highlight">Works</span></h2>
          <p>Master the platform in three simple steps</p>
        </div>
        
        <div className="functionality-carousel" style={{ marginTop: '2rem' }}>
          <div className="carousel-track">
            {steps.map((step, index) => {
              let position = 'next';
              if (index === activeIndex) position = 'active';
              if (index === (activeIndex - 1 + steps.length) % steps.length) position = 'prev';

              return (
                <div key={index} className={`carousel-card ${position}`}>
                  <div className="card-icon">
                    <i className={`bi ${step.icon}`}></i>
                  </div>
                  <h3 className="card-title">{step.title}</h3>
                  <p className="card-description">
                    {index === 2 ? (
                      <>
                        When pasting lyrics, simply use a comma (<strong>,</strong>) at the end of each line for perfect rendering!
                      </>
                    ) : (
                      step.description
                    )}
                  </p>
                </div>
              );
            })}
          </div>
          
          <div className="carousel-controls">
            <button className="control-btn prev" onClick={handlePrev} aria-label="Previous">
              <i className="bi bi-chevron-left"></i>
            </button>
            <div className="carousel-indicators">
              {steps.map((_, index) => (
                <span 
                  key={index} 
                  className={`indicator ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                ></span>
              ))}
            </div>
            <button className="control-btn next" onClick={handleNext} aria-label="Next">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksCarousel;
