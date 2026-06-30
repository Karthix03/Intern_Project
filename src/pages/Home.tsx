import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';
import './Home.css';

export const Home: React.FC = () => {
  const { products } = useProducts();
  const [isPlaying, setIsPlaying] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(18).fill(10));
  const animationRef = useRef<number | null>(null);

  // Filter featured products
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  // Handle visualizer bar animations when active
  useEffect(() => {
    if (isPlaying) {
      const updateBars = () => {
        setBars(prev =>
          prev.map(() => Math.floor(Math.random() * 85) + 15) // Random heights between 15% and 100%
        );
        animationRef.current = requestAnimationFrame(updateBars);
      };
      animationRef.current = requestAnimationFrame(updateBars);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Calm animation down slowly
      setBars(Array(18).fill(10));
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: "url('/images/hero.png')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <span className="hero-tagline">ARTISAN AUDIO EQUIPMENT</span>
          <h1 className="hero-title">
            Sound Made <span>Organic.</span>
          </h1>
          <p className="hero-description">
            Handcrafted vacuum tube amplifiers, customized walnut mechanical keyboards, and reference-grade wood headphones. Assembled in limited micro-batches for design purists and sound collectors.
          </p>
          <div className="hero-buttons">
            <Link to="/catalog" className="btn-primary">
              Explore Catalog
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link to="/philosophy" className="btn-secondary">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2>The Artisan Collection</h2>
            <p className="section-subtitle">Curated masterpieces from our latest bench release.</p>
          </div>
          <Link to="/catalog" className="view-all-link">
            View All Products
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Acoustic Showcase Section */}
      <section className="showcase-section">
        <div className="container showcase-grid">
          <div className="showcase-content">
            <h2 className="gradient-text">Uncompromising Analog Presence</h2>
            <p className="showcase-desc">
              We design in pure cycles. By matching responsibly harvested hardwoods with precision-machined metals, each product acts as a unique acoustic instrument, radiating organic, distortion-free presence.
            </p>
            <div className="showcase-features">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Precision Acoustic Dampening</h3>
                  <p>Specially routed brass core plates eliminate chassis vibrations.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                </div>
                <div className="feature-text">
                  <h3>Single-Ended Class-A Valves</h3>
                  <p>Bespoke tube architecture producing rich second-harmonic frequencies.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="visualizer-card glass-panel-heavy">
            <div className="visualizer-header">
              <span className="visualizer-title">Acoustic Shimmer Waveform</span>
              <div className="visualizer-status">
                <span className={`status-dot ${isPlaying ? '' : 'status-dot-paused'}`} style={{ backgroundColor: isPlaying ? 'var(--color-success)' : 'var(--text-muted)' }}></span>
                <span style={{ color: isPlaying ? 'var(--color-success)' : 'var(--text-secondary)' }}>
                  {isPlaying ? 'ACTIVE STAGE' : 'STANDBY'}
                </span>
              </div>
            </div>

            <div className="visualizer-bars">
              {bars.map((height, i) => (
                <div
                  key={i}
                  className="vis-bar"
                  style={{
                    height: `${height}%`,
                    transition: isPlaying ? 'height 0.1s ease-in-out' : 'height 0.4s ease-out'
                  }}
                ></div>
              ))}
            </div>

            <div className="visualizer-controls">
              <button
                className={`vis-btn ${isPlaying ? 'vis-btn-active' : ''}`}
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause Visualizer' : 'Play Visualizer'}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
