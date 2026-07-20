import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, Share2, X } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'AI Diagnosis', href: '#diagnosis' },
  { label: 'Mechanics', href: '#mechanic' },
  { label: 'About', href: '#about' },
];

const legalCopy = {
  privacy: {
    title: 'Privacy Policy',
    body: 'Far Car Fix only uses diagnosis details to provide vehicle guidance and improve the product experience. We do not sell personal information.',
  },
  terms: {
    title: 'Terms',
    body: 'Far Car Fix provides AI-assisted guidance, not a replacement for professional inspection. For urgent or safety-critical issues, contact a certified mechanic.',
  },
};

const scrollTo = (href: string) => {
  document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function Footer({ onBooking, onProfile }: { onBooking: () => void; onProfile: () => void }) {
  const [legal, setLegal] = useState<keyof typeof legalCopy | null>(null);

  const shareSite = async () => {
    const shareData = {
      title: 'Far Car Fix',
      text: 'AI-powered car diagnostics and trusted mechanics.',
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard?.writeText(window.location.href);
    setLegal(null);
  };

  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-grid">
          <div>
            <button type="button" onClick={() => scrollTo('#home')} className="footer-brand">
              <img
                src="/images/logo.png"
                alt="Far Car Fix"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span>Far Car <strong>Fix</strong></span>
            </button>
            <p>AI-powered car diagnostics and trusted mechanics, helping you fix smarter and drive farther.</p>
            <div className="social-links">
              <button type="button" onClick={shareSite} aria-label="Share Far Car Fix">
                <Share2 size={18} />
              </button>
              <a href="sms:?body=Try%20Far%20Car%20Fix%20for%20AI-powered%20car%20diagnosis." aria-label="Send Far Car Fix by text message">
                <MessageCircle size={18} />
              </a>
              <a href="mailto:help@farcarfix.com" aria-label="Email Far Car Fix">
                <Mail size={18} />
              </a>
              <a href="tel:1-800-CAR-FIXX" aria-label="Call Far Car Fix">
                <Phone size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button type="button" onClick={() => scrollTo(link.href)}>{link.label}</button>
                </li>
              ))}
              <li><button type="button" onClick={onBooking}>Book a Mechanic</button></li>
              <li><button type="button" onClick={onProfile}>My Profile</button></li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li><button type="button" onClick={() => setLegal('privacy')}>Privacy Policy</button></li>
              <li><button type="button" onClick={() => setLegal('terms')}>Terms</button></li>
              <li><a href="mailto:help@farcarfix.com">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright {new Date().getFullYear()} Far Car Fix. All rights reserved.</p>
          <a href="tel:1-800-CAR-FIXX">1-800-CAR-FIXX</a>
        </div>
      </div>

      {legal && (
        <div className="footer-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="footer-modal-title">
          <div className="footer-modal">
            <button type="button" className="footer-modal-close" onClick={() => setLegal(null)} aria-label="Close">
              <X size={18} />
            </button>
            <h3 id="footer-modal-title">{legalCopy[legal].title}</h3>
            <p>{legalCopy[legal].body}</p>
            <button type="button" className="btn-primary" onClick={() => setLegal(null)}>Close</button>
          </div>
        </div>
      )}
    </footer>
  );
}
