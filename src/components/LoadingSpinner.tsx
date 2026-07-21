import React from 'react';
import { motion } from 'motion/react';

interface Props {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE = { sm: 32, md: 56, lg: 80 };

export default function LoadingSpinner({ message = 'Loading…', size = 'md' }: Props) {
  const px = SIZE[size];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem',
      }}
      role="status"
      aria-label={message}
    >
      <div
        style={{
          width: px,
          height: px,
          border: `${size === 'sm' ? 3 : 4}px solid rgba(33,150,243,0.2)`,
          borderTop: `${size === 'sm' ? 3 : 4}px solid #2196F3`,
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
        }}
      />
      {message && (
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
          {message}
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
