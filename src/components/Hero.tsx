import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Users } from 'lucide-react';
import { heroSlides } from '../data/vehicleData';

const trustBadges = ['AI Powered', '24/7 Assistance', 'Trusted Mechanics', 'Instant Diagnosis'];

const floatingCards = [
  { label: 'Engine Health', value: '92%', style: { top: '8%', left: '-7%' } },
  { label: 'Battery', value: 'Healthy', style: { top: '36%', right: '-10%' } },
  { label: 'Estimated Cost', value: '$180', style: { bottom: '18%', left: '-5%' } },
  { label: 'Diagnosis', value: 'Completed', style: { bottom: '7%', right: '5%' } },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Hero({ onBooking }: { onBooking: () => void }) {
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlideIdx((i) => (i + 1) % heroSlides.length), 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="grid-pattern" style={{ position: 'relative', overflow: 'hidden', paddingTop: '96px', scrollMarginTop: '96px' }}>
      <div className="hero-glow" />

      <div className="section-container hero-layout">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ flex: '1 1 420px', maxWidth: '590px' }}
        >
          <span className="section-label">AI-Powered Car Diagnostics</span>
          <h1 style={{ color: 'var(--gray-900)', marginBottom: '1.25rem', marginTop: '1rem' }}>
            Fix Smarter. <span style={{ color: 'var(--primary)' }}>Drive Farther.</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--gray-600)', marginBottom: '2rem', maxWidth: '540px' }}>
            Diagnose car problems in seconds, understand likely repair costs, and connect with trusted mechanics when your vehicle needs expert hands.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn-primary btn-large" onClick={() => scrollTo('diagnosis')}>
              Start Free Diagnosis
              <ArrowRight size={18} />
            </button>
            <button type="button" className="btn-secondary btn-large" onClick={onBooking}>
              <Users size={18} />
              Book Mechanic
            </button>
          </div>

          <div className="hero-badges">
            {trustBadges.map((badge) => (
              <span key={badge}>
                <CheckCircle2 size={16} />
                {badge}
              </span>
            ))}
          </div>

          <div className="hero-stats">
            {[
              { value: '10K+', label: 'Cars Diagnosed' },
              { value: '<30s', label: 'Avg. Diagnosis Time' },
              { value: '4.9/5', label: 'User Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>{stat.value}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="hero-visual"
        >
          <div className="hero-image-shell">
            <img
              src={heroSlides[slideIdx]}
              alt="Mechanic repairing a modern vehicle"
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.6s' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="hero-image-shade" />
            <div className="hero-dots">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlideIdx(i)}
                  aria-label={`Show hero image ${i + 1}`}
                  className={i === slideIdx ? 'active' : ''}
                />
              ))}
            </div>
          </div>

          {floatingCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
              className="floating-metric-card"
              style={{
                ...card.style,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <p>{card.label}</p>
              <strong>{card.value}</strong>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
