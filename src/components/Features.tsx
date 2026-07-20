import React from 'react';
import { motion } from 'motion/react';
import { Brain, MapPinned, Route, Activity } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Diagnosis',
    description: 'Instantly analyzes vehicle symptoms and gives you a clear next step.',
  },
  {
    icon: MapPinned,
    title: 'Nearby Mechanics',
    description: 'Find trusted mechanics nearby with ratings, availability, and specialties.',
  },
  {
    icon: Route,
    title: 'Repair Guidance',
    description: 'Follow step-by-step recommendations before you spend money at a shop.',
  },
  {
    icon: Activity,
    title: 'Maintenance Tracking',
    description: 'Keep your vehicle healthy with proactive care and repair context.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Features() {
  return (
    <section className="section-padding" style={{ background: '#fff' }}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">Platform</span>
          <h2>Everything you need to fix with confidence</h2>
          <p>Smart diagnostics, practical repair guidance, and mechanic booking in one polished workflow.</p>
        </motion.div>

        <div className="feature-grid">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="landing-card feature-card"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.01 }}
            >
              <div className="icon-box" style={{ marginBottom: '1.25rem' }}>
                <feature.icon size={24} />
              </div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--gray-900)' }}>{feature.title}</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem', margin: 0 }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
