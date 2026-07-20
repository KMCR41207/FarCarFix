import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: 'The AI correctly identified my battery issue before I visited the garage. The repair estimate was almost exact.',
    author: 'Sarah M.',
    role: 'Toyota Camry owner',
    image: '/images/slide1.jpg',
  },
  {
    quote: 'Far Car Fix saved me hundreds by catching a simple sensor problem I would have overpaid for.',
    author: 'James K.',
    role: 'Ford F-150 owner',
    image: '/images/slide4.jpg',
  },
  {
    quote: 'Very simple and surprisingly accurate. I use it before every mechanic visit now.',
    author: 'David L.',
    role: 'Honda Civic owner',
    image: '/images/slide2.jpg',
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding" style={{ background: 'var(--gray-50)' }}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Testimonials</span>
          <h2>Loved by drivers everywhere</h2>
          <p>Real car owners use Far Car Fix to feel prepared before the repair bill arrives.</p>
        </motion.div>

        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              className="landing-card testimonial-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem' }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={18} fill="var(--primary)" color="var(--primary)" />
                ))}
              </div>
              <p style={{ color: 'var(--gray-900)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="testimonial-author">
                <img src={t.image} alt={`${t.author} customer`} />
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--gray-900)', margin: 0 }}>{t.author}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', margin: '0.25rem 0 0' }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
