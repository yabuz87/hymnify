import React, { useState, useEffect } from 'react';
import './carousel.css';

const functionalities = [
  {
    icon: 'bi-shield-lock',
    title: 'Private Choir Archives',
    description: 'Securely preserve your church\'s legacy. Private songs are only accessible by authorized members of your choir, ensuring spiritual heritage stays within the community.'
  },
  {
    icon: 'bi-globe-central-south-asia',
    title: 'Public Gospel Library',
    description: 'Contribute to the global gospel community. Upload public songs that can be rated, liked, and shared by believers worldwide to inspire and connect.'
  },
  {
    icon: 'bi-gear-wide-connected',
    title: 'Full Uploader Control',
    description: 'Total management of your repertoire. Add, edit, or delete songs with powerful CRUD functionalities designed for choir leaders and administrators.'
  },
  {
    icon: 'bi-stars',
    title: 'Smart Recommendations',
    description: 'Discover more of what you love. Our intelligent system suggests songs based on genre, choir style, and your personal preferences.'
  }
];

const FunctionalityCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % functionalities.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % functionalities.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + functionalities.length) % functionalities.length);

  return (
    <div className="functionality-carousel">
      <div className="carousel-track">
        {functionalities.map((func, index) => {
          let position = 'next';
          if (index === activeIndex) position = 'active';
          if (index === (activeIndex - 1 + functionalities.length) % functionalities.length) position = 'prev';

          return (
            <div key={index} className={`carousel-card ${position}`}>
              <div className="card-icon">
                <i className={`bi ${func.icon}`}></i>
              </div>
              <h3 className="card-title">{func.title}</h3>
              <p className="card-description">{func.description}</p>
            </div>
          );
        })}
      </div>
      
      <div className="carousel-controls">
        <button className="control-btn prev" onClick={handlePrev} aria-label="Previous">
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className="carousel-indicators">
          {functionalities.map((_, index) => (
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
  );
};

export default FunctionalityCarousel;
