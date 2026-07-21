import React from 'react';
import { motion } from 'motion/react';

interface Props {
  onBack: () => void;
}

export default function NotFound({ onBack }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        minHeight: '100vh',
        background: '#0a0f1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🚗💨</div>
      <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 6vw, 3.5rem)', margin: '0 0 0.75rem' }}>
        <span style={{ color: '#2196F3' }}>404</span> — Lost on the Road
      </h1>
      <p style={{ color: '#9ca3af', fontSize: '1.1rem', maxWidth: '420px', marginBottom: '2rem', lineHeight: 1.7 }}>
        Looks like this page broke down. Let's get you back on track.
      </p>
      <button
        type="button"
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#2196F3',
          color: '#fff',
          border: 'none',
          borderRadius: '14px',
          padding: '0.9rem 2rem',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#1976D2'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#2196F3'; e.currentTarget.style.transform = 'none'; }}
      >
        ← Back to Home
      </button>
    </motion.div>
  );
}
