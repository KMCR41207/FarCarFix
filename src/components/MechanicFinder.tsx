import React, { useState } from 'react';

const mechanics = [
  { name: 'Alex Rodriguez', specialty: 'Engine & Transmission', rating: 4.9, reviews: 312, distance: '0.8 mi', available: true, badge: 'Top Rated' },
  { name: 'Sarah Chen', specialty: 'Electrical Systems', rating: 4.8, reviews: 245, distance: '1.2 mi', available: true, badge: 'Fast Response' },
  { name: 'Marcus Johnson', specialty: 'Brakes & Suspension', rating: 4.7, reviews: 189, distance: '2.1 mi', available: false, badge: 'Expert' },
  { name: 'Emily Davis', specialty: 'General Repairs', rating: 4.9, reviews: 421, distance: '1.5 mi', available: true, badge: 'Most Booked' },
];

export default function MechanicFinder() {
  const [location, setLocation] = useState('');
  const [searched, setSearched] = useState(false);

  return (
    <section id="mechanic" style={{ padding: '6rem 1rem', background: '#f9fafb', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '384px', height: '384px', background: 'rgba(14,165,233,0.05)', borderRadius: '50%', filter: 'blur(64px)' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '384px', height: '384px', background: 'rgba(0,0,0,0.03)', borderRadius: '50%', filter: 'blur(64px)' }} />

      <div style={{ maxWidth: '1152px', margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ color: '#0a0a0a', marginBottom: '1rem' }}>
            Find a <span style={{ color: '#0EA5E9' }}>Mechanic</span>
          </h2>
          <p style={{ color: '#374151', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            ASE-certified professionals available on-demand, wherever you are
          </p>
        </div>

        {/* Search bar */}
        <div style={{ maxWidth: '600px', margin: '0 auto 3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Enter your location or zip code..."
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{
              flex: 1, minWidth: '200px', padding: '14px 18px', borderRadius: '12px',
              border: '2px solid #e5e7eb', outline: 'none', fontSize: '1rem',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor = '#0EA5E9')}
            onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
          />
          <button
            onClick={() => setSearched(true)}
            style={{
              background: '#0EA5E9', color: '#fff', border: 'none',
              borderRadius: '12px', padding: '14px 28px', fontSize: '1rem',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 0 20px rgba(14,165,233,0.3)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#0284c7')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0EA5E9')}
          >
            Search
          </button>
        </div>

        {/* Mechanic cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {mechanics.map((m, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: '16px', padding: '1.5rem',
              border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'none'; }}
            >
              {/* Avatar + badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0EA5E9, #0284c7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '1.2rem', flexShrink: 0,
                }}>
                  {m.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, margin: 0, color: '#0a0a0a' }}>{m.name}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>{m.specialty}</p>
                </div>
                <span style={{
                  background: m.available ? '#dcfce7' : '#f3f4f6',
                  color: m.available ? '#15803d' : '#6b7280',
                  fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: '20px',
                }}>
                  {m.available ? 'Available' : 'Busy'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <span style={{ color: '#eab308', fontSize: '1rem' }}>★</span>
                <span style={{ fontWeight: 600, color: '#0a0a0a' }}>{m.rating}</span>
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>({m.reviews} reviews)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>📍 {m.distance} away</span>
                <span style={{
                  background: 'rgba(14,165,233,0.1)', color: '#0EA5E9',
                  fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                }}>{m.badge}</span>
              </div>

              <button
                disabled={!m.available}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px',
                  background: m.available ? '#0EA5E9' : '#e5e7eb',
                  color: m.available ? '#fff' : '#9ca3af',
                  border: 'none', fontWeight: 600, cursor: m.available ? 'pointer' : 'not-allowed',
                  fontSize: '0.9rem', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (m.available) e.currentTarget.style.background = '#0284c7'; }}
                onMouseLeave={e => { if (m.available) e.currentTarget.style.background = '#0EA5E9'; }}
              >
                {m.available ? 'Book Now' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
