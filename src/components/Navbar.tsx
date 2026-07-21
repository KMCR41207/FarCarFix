import React, { useEffect, useState } from 'react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'AI Diagnosis', href: '#diagnosis' },
  { name: 'Mechanics', href: '#mechanic' },
  { name: 'About', href: '#about' },
];

export default function Navbar({ onBooking, onProfile, isAuthenticated }: { onBooking: () => void; onProfile: () => void; isAuthenticated?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const sectionIds = ['home', 'diagnosis', 'mechanic', 'about'];
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
      const current = sectionIds.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });
      if (current) setActive(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    const id = href.replace('#', '') || 'home';
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(255,255,255,0.86)' : 'rgba(255,255,255,0.32)',
      backdropFilter: scrolled ? 'blur(18px)' : 'blur(4px)',
      borderBottom: scrolled ? '1px solid var(--gray-200)' : '1px solid transparent',
      boxShadow: scrolled ? '0 12px 32px rgba(15,23,42,0.08)' : 'none',
      transition: 'all 0.25s ease',
    }}>
      <div className="section-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          <button type="button" onClick={() => handleNav('#home')} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', background: 'transparent', border: 0, cursor: 'pointer', padding: 0 }}>
            <img
              src="/images/logo.png"
              alt="Far Car Fix Logo"
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span style={{ color: 'var(--gray-900)', fontWeight: 700, fontSize: '1.125rem' }}>
              Far Car <span style={{ color: 'var(--primary)' }}>Fix</span>
            </span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            {navLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() => handleNav(link.href)}
                style={{
                  color: active === link.href.replace('#', '') ? 'var(--primary)' : 'var(--gray-600)',
                  background: active === link.href.replace('#', '') ? 'rgba(33,150,243,0.09)' : 'transparent',
                  border: 0,
                  borderRadius: '999px',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = active === link.href.replace('#', '') ? 'var(--primary)' : 'var(--gray-600)'; }}
              >
                {link.name}
              </button>
            ))}
            <button type="button" onClick={() => handleNav('#diagnosis')} className="btn-primary" style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}>
              Start Diagnosis
            </button>
            <button type="button" onClick={onBooking} className="btn-secondary" style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}>
              Book Mechanic
            </button>
            <button type="button" onClick={onProfile}
              style={{ background: isAuthenticated ? 'rgba(33,150,243,0.12)' : 'transparent', border: isAuthenticated ? '1.5px solid rgba(33,150,243,0.4)' : '1.5px solid var(--gray-200)', borderRadius: '999px', width: 38, height: 38, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }} aria-label="My Profile">
              {isAuthenticated ? '✅' : '👤'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--gray-900)',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {open
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              }
            </svg>
          </button>
        </div>

        {open && (
          <div style={{ paddingBottom: '1.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--gray-200)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => handleNav(link.href)}
                  style={{ color: 'var(--gray-600)', background: 'transparent', border: 0, textAlign: 'left', padding: '0.5rem 0', fontWeight: 600, fontSize: '1rem' }}
                >
                  {link.name}
                </button>
              ))}
              <button type="button" className="btn-primary" onClick={() => handleNav('#diagnosis')} style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                Start Diagnosis
              </button>
              <button type="button" className="btn-secondary" onClick={onBooking} style={{ textAlign: 'center' }}>
                Book Mechanic
              </button>
              <button type="button" style={{ background: 'transparent', border: 0, padding: '0.5rem 0', fontWeight: 600, fontSize: '1rem', color: 'var(--gray-600)', textAlign: 'left', cursor: 'pointer' }} onClick={onProfile}>
                👤 My Profile
              </button>
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
