import React, { useState } from 'react';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'AI Diagnosis', href: '#diagnosis' },
  { name: 'Mechanics', href: '#mechanic' },
  { name: 'About', href: '#about' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #e5e7eb',
    }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/images/logo.png" alt="Far Car Fix Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <h4 style={{ color: '#0a0a0a', lineHeight: 1, margin: 0 }}>
              Far Car <span style={{ color: '#0EA5E9' }}>Fix</span>
            </h4>
          </div>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} style={{
                color: '#374151', textDecoration: 'none', fontSize: '0.95rem',
                fontWeight: 500, transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0EA5E9')}
                onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
              >{link.name}</a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} style={{
            display: 'none', background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', color: '#0a0a0a',
          }} className="mobile-menu-btn">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {open
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ paddingBottom: '1.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setOpen(false)} style={{
                  color: '#374151', textDecoration: 'none', padding: '0.5rem 0',
                  fontWeight: 500,
                }}>{link.name}</a>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
