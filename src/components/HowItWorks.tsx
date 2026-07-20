import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Cpu, MessageSquare } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: MessageSquare,
    title: 'Describe your problem',
    description: 'Share your vehicle, model year, and symptoms in plain language.',
  },
  {
    number: '2',
    icon: Cpu,
    title: 'AI analyzes your issue',
    description: 'Far Car Fix compares your symptoms with common repair patterns.',
  },
  {
    number: '3',
    icon: CheckCircle2,
    title: 'Get repair recommendations',
    description: 'Review guidance, estimated cost context, or book a trusted mechanic.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding grid-pattern" style={{ background: 'var(--gray-50)' }}>
      <div className="section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-label">How It Works</span>
          <h2>Three simple steps to a fix</h2>
          <p>From symptom to solution in under a minute, with no automotive expertise required.</p>
        </motion.div>

        <div className="steps-row">
          {steps.map((step, i) => (
            <React.Fragment key={step.title}>
              <motion.div
                className="landing-card step-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <div className="step-number">{step.number}</div>
                <div className="icon-box" style={{ margin: '0 auto 1.25rem' }}>
                  <step.icon size={22} />
                </div>
                <h3 style={{ marginBottom: '0.75rem', color: 'var(--gray-900)' }}>{step.title}</h3>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.9375rem', margin: 0 }}>{step.description}</p>
              </motion.div>

              {i < steps.length - 1 && (
                <div className="step-arrow">
                  <ArrowRight size={28} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
