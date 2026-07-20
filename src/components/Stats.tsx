import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const stats = [
  { value: 10000, suffix: '+', label: 'Cars Diagnosed' },
  { value: 98, suffix: '%', label: 'Accuracy' },
  { value: 500, suffix: '+', label: 'Mechanics' },
  { value: 24, suffix: '/7', label: 'Support' },
];

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1100;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="stats-section">
      <div className="section-container">
        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <strong>
                <CountUp value={stat.value} suffix={stat.suffix} />
              </strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
