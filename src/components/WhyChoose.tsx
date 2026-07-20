import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

const benefits = [
  'Accurate AI diagnostics',
  'Plain-language repair guidance',
  'Trusted mechanics nearby',
  'Fast mobile experience',
  'Available whenever car trouble hits',
];

export default function WhyChoose() {
  return (
    <section id="about" className="section-padding" style={{ background: '#fff', scrollMarginTop: '96px' }}>
      <div className="section-container about-layout">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ flex: '1 1 360px', position: 'relative' }}
        >
          <div className="about-image">
            <img
              src="/images/slide2.jpg"
              alt="Certified mechanic working on an engine"
              onError={(e) => { (e.target as HTMLImageElement).src = '/images/slide1.jpg'; }}
            />
          </div>
          <div className="about-badge">
            <p>98%</p>
            <span>Diagnosis accuracy</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ flex: '1 1 380px' }}
        >
          <span className="section-label">About Far Car Fix</span>
          <h2 style={{ marginTop: '1rem', marginBottom: '1rem', color: 'var(--gray-900)' }}>
            Built for drivers who want clear answers
          </h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1rem', fontSize: '1.0625rem' }}>
            Our mission is to make car trouble less stressful by turning confusing symptoms into practical guidance.
          </p>
          <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', fontSize: '1.0625rem' }}>
            Far Car Fix pairs AI diagnosis with a mechanic network, giving drivers a path from problem discovery to repair with more confidence and less guesswork.
          </p>

          <ul className="benefit-list">
            {benefits.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <span>
                  <Check size={16} strokeWidth={2.5} />
                </span>
                <strong>{item}</strong>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
