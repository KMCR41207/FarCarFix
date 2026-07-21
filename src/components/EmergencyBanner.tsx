import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onCallNow?: () => void;
}

export default function EmergencyBanner({ onCallNow }: Props) {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            background: 'linear-gradient(90deg, #dc2626, #b91c1c)',
            color: '#fff',
            padding: '0.6rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            boxShadow: '0 4px 24px rgba(220,38,38,0.45)',
          }}
          role="alert"
          aria-live="assertive"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1 }}>
            <span style={{ fontSize: '1.1rem', animation: 'pulse 1.5s infinite' }}>🚨</span>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>
              <strong>Emergency Roadside Assistance</strong> — Call <strong>1800-CAR-FIXX</strong> for 24/7 towing and breakdown support
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <a
              href="tel:18002273499"
              style={{
                background: '#fff',
                color: '#dc2626',
                border: 'none',
                borderRadius: '8px',
                padding: '0.3rem 0.85rem',
                fontWeight: 700,
                fontSize: '0.8rem',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
              onClick={onCallNow}
            >
              📞 Call Now
            </a>
            <button
              type="button"
              onClick={() => setVisible(false)}
              aria-label="Dismiss emergency banner"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                color: '#fff',
                width: 24,
                height: 24,
                cursor: 'pointer',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
