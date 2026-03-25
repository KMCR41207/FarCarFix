import React from 'react';

const features = [
  { icon: '🤖', title: 'AI-Powered Analysis', description: 'Advanced machine learning algorithms diagnose car issues with 94% accuracy' },
  { icon: '🔧', title: 'Expert Mechanics', description: 'ASE-certified professionals available on-demand, anywhere you are' },
  { icon: '⚡', title: 'Instant Solutions', description: 'Get diagnostic results in seconds, not hours or days' },
  { icon: '🛡️', title: 'Trusted Service', description: 'All mechanics are background-checked and insured for your safety' },
  { icon: '🕐', title: '24/7 Availability', description: 'Help is always just a click away, day or night' },
  { icon: '🎯', title: 'Precision Repairs', description: 'Data-driven approach ensures accurate fixes the first time' },
];

export default function Features() {
  return (
    <section id="about" style={{ position: 'relative', padding: '6rem 1rem', background: 'linear-gradient(135deg, #f9fafb, #fff)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '384px', height: '384px', background: 'rgba(14,165,233,0.05)', borderRadius: '50%', filter: 'blur(64px)' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '384px', height: '384px', background: 'rgba(0,0,0,0.03)', borderRadius: '50%', filter: 'blur(64px)' }} />

      <div style={{ maxWidth: '1152px', margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ color: '#0a0a0a', marginBottom: '1rem' }}>
            Where <span style={{ color: '#0EA5E9' }}>Technology</span> Meets Tradition
          </h2>
          <p style={{ color: '#374151', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
            Far Car Fix combines the wisdom of classic garage expertise with cutting-edge AI technology to deliver the future of automotive care
          </p>
        </div>

        {/* Feature grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: '16px', padding: '2rem',
              border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
              transition: 'all 0.2s', cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{
                width: '56px', height: '56px', background: 'rgba(14,165,233,0.1)',
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem', marginBottom: '1rem',
              }}>
                {f.icon}
              </div>
              <h4 style={{ color: '#0a0a0a', marginBottom: '0.5rem' }}>{f.title}</h4>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>{f.description}</p>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '2rem', marginTop: '5rem', textAlign: 'center',
        }}>
          {[
            { value: '94%', label: 'Diagnosis Accuracy' },
            { value: '50K+', label: 'Cars Diagnosed' },
            { value: '2,000+', label: 'Certified Mechanics' },
            { value: '4.9★', label: 'Average Rating' },
          ].map((s, i) => (
            <div key={i}>
              <p style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0EA5E9', margin: 0, fontFamily: 'Orbitron, sans-serif' }}>{s.value}</p>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
