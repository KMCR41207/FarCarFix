import React, { useState, useEffect } from 'react';
import { VehicleData } from '../App';

interface HeroProps {
  onStartDiagnosis: (data: VehicleData) => void;
}

const slides = [
  '/images/slide1.jpg',
  '/images/slide2.jpg',
  '/images/slide3.jpg',
  '/images/slide4.jpg',
];

export default function Hero({ onStartDiagnosis }: HeroProps) {
  const [carBrand, setCarBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [issue, setIssue] = useState('');
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const handleStartDiagnosis = () => {
    if (!carBrand || !model || !year || !issue) {
      alert('Please fill in all fields before starting diagnosis');
      return;
    }
    onStartDiagnosis({ carBrand, model, year, issue });
    // scroll to result after a tick so it renders first
    setTimeout(() => {
      const el = document.getElementById('diagnosis-result');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleFindMechanic = () => {
    const el = document.getElementById('mechanic');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    border: '1px solid #d1d5db', outline: 'none', fontSize: '0.95rem',
    transition: 'border-color 0.2s', background: '#fff', color: '#0a0a0a',
  };

  return (
    <section style={{ position: 'relative', minHeight: '100vh', background: '#fff', overflow: 'hidden' }}>
      <div className="circuit-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

      <div style={{
        position: 'relative', maxWidth: '1152px', margin: '0 auto',
        padding: '8rem 1rem 5rem', display: 'flex',
        flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '3rem',
      }}>
        {/* Left: form */}
        <div style={{ flex: '1 1 400px', maxWidth: '600px', zIndex: 10 }}>
          <h1 style={{ color: '#0a0a0a', marginBottom: '1.5rem' }}>
            Fix smarter. <span style={{ color: '#0EA5E9' }}>Drive farther.</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#374151', marginBottom: '2rem', maxWidth: '480px' }}>
            AI-powered solutions for any car trouble — and a mechanic to your location if needed.
          </p>

          <div style={{
            background: '#fff', borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            padding: '2rem', border: '1px solid #e5e7eb',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Car Brand', placeholder: 'e.g., Toyota', value: carBrand, set: setCarBrand },
                { label: 'Model', placeholder: 'e.g., Camry', value: model, set: setModel },
                { label: 'Year', placeholder: 'e.g., 2018', value: year, set: setYear },
                { label: 'Issue', placeholder: 'e.g., Engine noise', value: issue, set: setIssue },
              ].map(({ label, placeholder, value, set }) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px', color: '#6b7280' }}>{label}</label>
                  <input type="text" placeholder={placeholder} value={value}
                    onChange={e => set(e.target.value)} style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#0EA5E9')}
                    onBlur={e => (e.target.style.borderColor = '#d1d5db')} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={handleStartDiagnosis} style={{
                flex: 1, minWidth: '160px', background: '#0a0a0a', color: '#fff',
                border: 'none', borderRadius: '12px', padding: '16px 24px',
                fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1f2937'; e.currentTarget.style.boxShadow = '0 0 20px rgba(14,165,233,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0a0a0a'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                Start Diagnosis
              </button>

              <button onClick={handleFindMechanic} style={{
                flex: 1, minWidth: '160px', background: 'transparent', color: '#0EA5E9',
                border: '2px solid #0EA5E9', borderRadius: '12px', padding: '16px 24px',
                fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0EA5E9'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0EA5E9'; }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Need a Mechanic?
              </button>
            </div>
          </div>
        </div>

        {/* Right: image carousel */}
        <div style={{ flex: '1 1 300px', maxWidth: '480px', margin: '0 auto' }}>
          <div style={{
            position: 'relative', width: '100%', height: '450px',
            borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
            border: '4px solid #0EA5E9',
          }}>
            <img src={slides[slideIdx]} alt={`Car service ${slideIdx + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.8s' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div style={{
              position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '8px',
            }}>
              {slides.map((_, i) => (
                <button key={i} onClick={() => setSlideIdx(i)} style={{
                  width: i === slideIdx ? '24px' : '8px', height: '8px',
                  borderRadius: '4px', border: 'none', cursor: 'pointer',
                  background: i === slideIdx ? '#0EA5E9' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.3s',
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
