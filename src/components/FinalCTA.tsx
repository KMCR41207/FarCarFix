import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

function scrollToDiagnosis() {
  document.getElementById('diagnosis')?.scrollIntoView({ behavior: 'smooth' });
}

export default function FinalCTA() {
  return (
    <section style={{ padding: '0 1.5rem 6rem' }}>
      <motion.div
        className="section-container"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 50%, #0D47A1 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(3rem, 6vw, 5rem) 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Ready to Diagnose Your Car?</h2>
          <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.125rem', marginBottom: '2rem' }}>
            Start your free AI diagnosis in under a minute.
          </p>
          <button
            type="button"
            onClick={scrollToDiagnosis}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#fff',
              color: 'var(--primary)',
              border: 'none',
              borderRadius: '16px',
              padding: '1rem 2.25rem',
              fontSize: '1.0625rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Start Diagnosis
            <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
