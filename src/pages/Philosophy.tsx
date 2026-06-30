import React, { useState } from 'react';
import './Philosophy.css';

export const Philosophy: React.FC = () => {
  const [activeCurve, setActiveCurve] = useState<'aether' | 'reference'>('aether');

  // Curve paths for SVG drawing
  // clinical reference curve: fairly flat line with slight high-end dip
  const referenceCurvePath = "M 0 150 Q 80 140 160 148 T 320 152 T 480 150 T 640 160 T 800 150";
  // Aether signature curve: boosted warm low-end bass, smooth lush mids, extended treble response
  const aetherCurvePath = "M 0 100 Q 80 90 160 130 T 320 150 T 480 145 T 640 120 T 800 95";

  return (
    <div className="philosophy-page container">
      {/* Narrative Section */}
      <section className="philosophy-hero">
        <span className="hero-tagline" style={{ color: 'var(--accent-copper)' }}>Our Manifesto</span>
        <h1 className="gradient-text">Organic Timber, Precision Copper</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: '1.6', marginTop: '16px' }}>
          We believe high-fidelity sound is not just a calculation, but an physical experience. By matching raw organic wood with digital circuits, we create sound instruments.
        </p>
      </section>

      <div className="story-grid">
        <div className="story-img-container">
          <img src="/images/keyboard.png" alt="Custom wood carving" className="story-img" />
        </div>
        <div className="story-text">
          <h2>The Bench Philosophy</h2>
          <p>
            Every housing we cut from North American Walnut is unique. Wood is not a passive material; it breathes and vibrates. Its structural cell grain absorbs high-frequency glare and resonates warm lower-mid ranges, delivering an organic timber signature that artificial materials cannot replicate.
          </p>
          <p>
            We balance this raw resonance with precision-machined solid brass chassis plates and oxygen-free copper paths. The results are acoustic instruments that don't just sit on your desk, but bring depth, space, and life to every note played.
          </p>
        </div>
      </div>

      {/* Interactive Frequency response chart */}
      <section className="response-section glass-panel">
        <h3>Acoustic Tuning Signature</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Visualize the tuning response curves of our systems. Toggle below to compare our warm, tube-like signature against typical clinical monitors.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
          <button
            className={`btn-secondary ${activeCurve === 'aether' ? 'variant-btn-active' : ''}`}
            onClick={() => setActiveCurve('aether')}
            style={{ padding: '8px 20px', borderRadius: 'var(--border-radius-full)', fontSize: '13px' }}
          >
            Aether Organic Curve
          </button>
          <button
            className={`btn-secondary ${activeCurve === 'reference' ? 'variant-btn-active' : ''}`}
            onClick={() => setActiveCurve('reference')}
            style={{ padding: '8px 20px', borderRadius: 'var(--border-radius-full)', fontSize: '13px' }}
          >
            Clinical Reference Line
          </button>
        </div>

        <div className="graph-container">
          {/* Axis Labels */}
          <div className="graph-axis-y">
            <span>+10 dB</span>
            <span>0 dB (Flat)</span>
            <span>-10 dB</span>
          </div>

          <div className="graph-canvas">
            {/* Horizontal Grid lines */}
            <div className="grid-line grid-line-h" style={{ top: '25%' }}></div>
            <div className="grid-line grid-line-h" style={{ top: '50%' }}></div>
            <div className="grid-line grid-line-h" style={{ top: '75%' }}></div>
            
            {/* Vertical Grid lines */}
            <div className="grid-line grid-line-v" style={{ left: '20%' }}></div>
            <div className="grid-line grid-line-v" style={{ left: '40%' }}></div>
            <div className="grid-line grid-line-v" style={{ left: '60%' }}></div>
            <div className="grid-line grid-line-v" style={{ left: '80%' }}></div>

            {/* Curve line */}
            <svg
              className="wave-path"
              viewBox="0 0 800 300"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={activeCurve === 'aether' ? aetherCurvePath : referenceCurvePath}
                fill="none"
                stroke={activeCurve === 'aether' ? 'var(--accent-gold)' : 'var(--text-muted)'}
                strokeWidth="3.5"
                style={{
                  transition: 'd 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease',
                  filter: activeCurve === 'aether' ? 'drop-shadow(0 0 6px var(--accent-gold-glow))' : 'none'
                }}
              />
            </svg>
          </div>

          <div className="graph-axis-x">
            <span>Sub-Bass (20Hz)</span>
            <span>Mids (1kHz)</span>
            <span>Treble (20kHz)</span>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Philosophy;
