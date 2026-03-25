import React from 'react';

const quickLinks = ['Home', 'AI Diagnosis', 'Find Mechanic', 'About Us', 'How It Works', 'Pricing'];
const services = ['Engine Diagnostics', 'Brake Repair', 'Oil Changes', 'Transmission Service', 'Electrical Systems', 'Emergency Roadside'];

export default function Footer() {
  return (
    <footer style={{ position: 'relative', background: '#000', color: '#fff', overflow: 'hidden' }}>
      <div className="blueprint-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />

      <div style={{ position: 'relative', maxWidth: '1152px', margin: '0 auto', padding: '4rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>
              Far Car <span style={{ color: '#0EA5E9' }}>Fix</span>
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              AI-powered automotive care meets traditional garage expertise. Your car's best friend, wherever you are.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#0EA5E9')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
                  >{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {services.map((s, i) => (
                <li key={i}>
                  <a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#0EA5E9')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
                  >{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '0 0 2px' }}>24/7 Support</p>
                <a href="tel:1-800-CAR-FIXX" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#0EA5E9')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
                >1-800-CAR-FIXX</a>
              </li>
              <li>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '0 0 2px' }}>Email</p>
                <a href="mailto:help@farcarfix.com" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#0EA5E9')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#fff')}
                >help@farcarfix.com</a>
              </li>
              <li>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '0 0 2px' }}>Headquarters</p>
                <p style={{ color: '#fff', margin: 0, fontSize: '0.9rem' }}>123 Tech Drive<br />Silicon Valley, CA 94025</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: '2rem', borderTop: '1px solid #1f2937', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>© 2025 Far Car Fix. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l, i) => (
              <a key={i} href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0EA5E9')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
