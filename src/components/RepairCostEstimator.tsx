import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CostData {
  issue: string;
  confidence: number;
  diy: {
    parts: number;
    time: string;
    difficulty: string;
  };
  localGarage: {
    parts: number;
    labor: number;
    total: number;
    time: string;
  };
  authorizedCenter: {
    parts: number;
    labor: number;
    total: number;
    time: string;
  };
  causes: string[];
  disclaimer: string;
  isCritical: boolean;
}

interface Props {
  issue: string;
  confidence: number;
  carBrand: string;
  model: string;
  year: string;
  location?: string;
}

// --- Cost database keyed by issue keyword ---
function getCostData(issue: string, carBrand: string, _model: string, _year: string): CostData {
  const s = issue.toLowerCase();
  const isPremium = ['bmw', 'mercedes-benz', 'audi', 'lexus'].includes(carBrand.toLowerCase());
  const mult = isPremium ? 1.6 : 1;

  if (s.includes('brake') || s.includes('squeak') || s.includes('grind')) {
    return {
      issue: 'Brake Pad Wear / Rotor Damage',
      confidence: 92,
      diy: { parts: Math.round(1200 * mult), time: '45–90 min', difficulty: 'Moderate' },
      localGarage: { parts: Math.round(1200 * mult), labor: 800, total: Math.round((1200 + 800) * mult), time: '1–2 hours' },
      authorizedCenter: { parts: Math.round(1500 * mult), labor: 1800, total: Math.round((1500 + 1800) * mult), time: '1–3 hours' },
      causes: ['Worn brake pads (below 3mm)', 'Scored rotors', 'Caliper sticking', 'Low brake fluid'],
      disclaimer: 'Estimate based on average market prices in your area. Actual prices may vary by ±20%.',
      isCritical: true,
    };
  }
  if (s.includes('overheat') || s.includes('temperature') || s.includes('steam') || s.includes('coolant')) {
    return {
      issue: 'Engine Overheating / Coolant Leak',
      confidence: 91,
      diy: { parts: Math.round(600 * mult), time: '30–60 min', difficulty: 'Easy–Moderate' },
      localGarage: { parts: Math.round(600 * mult), labor: 700, total: Math.round((600 + 700) * mult), time: '1–2 hours' },
      authorizedCenter: { parts: Math.round(800 * mult), labor: 1500, total: Math.round((800 + 1500) * mult), time: '2–4 hours' },
      causes: ['Coolant leak in hose or radiator', 'Faulty thermostat', 'Water pump failure', 'Blocked radiator'],
      disclaimer: 'Estimate based on average market prices in your area. Actual prices may vary by ±20%.',
      isCritical: true,
    };
  }
  if (s.includes('noise') || s.includes('knock') || s.includes('sound') || s.includes('rattle')) {
    return {
      issue: 'Engine Knock / Bearing Wear',
      confidence: 87,
      diy: { parts: Math.round(900 * mult), time: '20 min (inspection)', difficulty: 'Easy' },
      localGarage: { parts: Math.round(900 * mult), labor: 700, total: Math.round((900 + 700) * mult), time: '30 min–1 hour' },
      authorizedCenter: { parts: Math.round(1000 * mult), labor: 1500, total: Math.round((1000 + 1500) * mult), time: '1–2 hours' },
      causes: ['Belt wear', 'Belt slippage', 'Improper tension', 'Bearing wear'],
      disclaimer: 'Estimate based on average market prices in your area. Actual prices may vary by ±20%.',
      isCritical: false,
    };
  }
  if (s.includes('vibrat') || s.includes('shake') || s.includes('wobble')) {
    return {
      issue: 'Wheel Imbalance / Suspension Issue',
      confidence: 83,
      diy: { parts: Math.round(400 * mult), time: '15 min (check only)', difficulty: 'Easy' },
      localGarage: { parts: Math.round(400 * mult), labor: 600, total: Math.round((400 + 600) * mult), time: '45 min–1 hour' },
      authorizedCenter: { parts: Math.round(600 * mult), labor: 1200, total: Math.round((600 + 1200) * mult), time: '1–2 hours' },
      causes: ['Unbalanced wheels', 'Worn tyres', 'Loose lug nuts', 'Worn CV joint'],
      disclaimer: 'Estimate based on average market prices in your area. Actual prices may vary by ±20%.',
      isCritical: false,
    };
  }
  if (s.includes('light') || s.includes('warning') || s.includes('check engine') || s.includes('dashboard')) {
    return {
      issue: 'Check Engine / Warning Light',
      confidence: 78,
      diy: { parts: Math.round(500 * mult), time: '10 min (scan)', difficulty: 'Easy' },
      localGarage: { parts: Math.round(500 * mult), labor: 500, total: Math.round((500 + 500) * mult), time: '30–60 min' },
      authorizedCenter: { parts: Math.round(700 * mult), labor: 1000, total: Math.round((700 + 1000) * mult), time: '1–3 hours' },
      causes: ['Faulty O2 sensor', 'Loose fuel cap', 'Catalytic converter issue', 'Spark plug misfires'],
      disclaimer: 'Estimate based on average market prices in your area. Actual prices may vary by ±20%.',
      isCritical: false,
    };
  }
  if (s.includes('battery') || s.includes('dead') || s.includes('start')) {
    return {
      issue: 'Battery / Starting System Failure',
      confidence: 88,
      diy: { parts: Math.round(3500 * mult), time: '20 min', difficulty: 'Easy' },
      localGarage: { parts: Math.round(3500 * mult), labor: 300, total: Math.round((3500 + 300) * mult), time: '30 min' },
      authorizedCenter: { parts: Math.round(4500 * mult), labor: 600, total: Math.round((4500 + 600) * mult), time: '1 hour' },
      causes: ['Old battery (3–5 yrs)', 'Alternator failure', 'Corroded terminals', 'Faulty starter motor'],
      disclaimer: 'Estimate based on average market prices in your area. Actual prices may vary by ±20%.',
      isCritical: false,
    };
  }
  // Default / generic
  return {
    issue: 'General Vehicle Inspection Required',
    confidence: 65,
    diy: { parts: 0, time: '30 min (inspection)', difficulty: 'Easy' },
    localGarage: { parts: 500, labor: 600, total: 1100, time: '1–2 hours' },
    authorizedCenter: { parts: 700, labor: 1200, total: 1900, time: '2–4 hours' },
    causes: ['Unidentified fault', 'Multiple potential causes', 'Professional diagnosis recommended'],
    disclaimer: 'Estimate based on average market prices in your area. Actual prices may vary by ±20%.',
    isCritical: false,
  };
}

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

const SEVERITY_COLOR = {
  green: { bg: '#dcfce7', border: '#86efac', text: '#15803d', dot: '#22c55e' },
  yellow: { bg: '#fefce8', border: '#fde047', text: '#854d0e', dot: '#eab308' },
  red: { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b', dot: '#ef4444' },
};

export default function RepairCostEstimator({ issue, confidence, carBrand, model, year }: Props) {
  const [activeTab, setActiveTab] = useState<'diy' | 'garage' | 'center'>('garage');
  const [expanded, setExpanded] = useState(false);

  const data = getCostData(issue, carBrand, model, year);
  const severity = data.isCritical ? 'red' : confidence >= 85 ? 'yellow' : 'green';
  const colors = SEVERITY_COLOR[severity];

  const tabs: { key: typeof activeTab; label: string; icon: string }[] = [
    { key: 'diy', label: 'DIY Repair', icon: '🔧' },
    { key: 'garage', label: 'Local Garage', icon: '🏪' },
    { key: 'center', label: 'Service Center', icon: '🏢' },
  ];

  const tabData = {
    diy: {
      headline: fmt(data.diy.parts),
      rows: [
        { label: 'Parts / Materials', value: fmt(data.diy.parts) },
        { label: 'Labor Cost', value: 'Your time' },
        { label: 'Estimated Time', value: data.diy.time },
        { label: 'Difficulty', value: data.diy.difficulty },
      ],
    },
    garage: {
      headline: fmt(data.localGarage.total),
      rows: [
        { label: 'Parts', value: fmt(data.localGarage.parts) },
        { label: 'Labor', value: fmt(data.localGarage.labor) },
        { label: 'Total', value: fmt(data.localGarage.total) },
        { label: 'Estimated Time', value: data.localGarage.time },
      ],
    },
    center: {
      headline: fmt(data.authorizedCenter.total),
      rows: [
        { label: 'Parts', value: fmt(data.authorizedCenter.parts) },
        { label: 'Labor', value: fmt(data.authorizedCenter.labor) },
        { label: 'Total', value: fmt(data.authorizedCenter.total) },
        { label: 'Estimated Time', value: data.authorizedCenter.time },
      ],
    },
  };

  const active = tabData[activeTab];

  return (
    <motion.div
      className="rce-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* Header */}
      <div className="rce-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="rce-icon-box">💰</span>
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.125rem' }}>AI Repair Cost Estimator</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>
              {year} {carBrand} {model}
            </p>
          </div>
        </div>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: colors.bg, border: `1px solid ${colors.border}`,
            borderRadius: 999, padding: '4px 10px',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors.dot, display: 'inline-block' }} />
          <span style={{ color: colors.text, fontSize: '0.75rem', fontWeight: 700 }}>
            {data.isCritical ? 'Critical Issue' : confidence >= 85 ? 'Moderate' : 'Minor Issue'}
          </span>
        </div>
      </div>

      {/* Diagnosis banner */}
      <div className="rce-diagnosis-banner">
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Diagnosed Problem
          </p>
          <p style={{ margin: '4px 0 0', color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{data.issue}</p>
        </div>
        <div className="rce-confidence-ring">
          <span style={{ color: '#2196F3', fontWeight: 800, fontSize: '1rem' }}>{confidence}%</span>
          <span style={{ color: '#94a3b8', fontSize: '0.65rem' }}>Confidence</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="rce-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            type="button"
            className={`rce-tab ${activeTab === t.key ? 'rce-tab-active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.22 }}
          className="rce-tab-content"
        >
          <div className="rce-cost-headline">
            <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Estimated Cost</span>
            <span style={{ color: '#2196F3', fontSize: '2rem', fontWeight: 800 }}>{active.headline}</span>
          </div>

          <div className="rce-cost-rows">
            {active.rows.map((row, i) => (
              <div key={i} className="rce-cost-row">
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{row.label}</span>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Quick comparison bar */}
      <div className="rce-compare">
        <p style={{ margin: '0 0 10px', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          Quick Comparison
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'DIY', value: fmt(data.diy.parts), color: '#22c55e' },
            { label: 'Garage', value: fmt(data.localGarage.total), color: '#2196F3' },
            { label: 'Authorized', value: fmt(data.authorizedCenter.total), color: '#f59e0b' },
          ].map(item => (
            <div key={item.label} className="rce-compare-chip" style={{ borderColor: item.color + '33' }}>
              <span style={{ color: item.color, fontWeight: 700, fontSize: '0.875rem' }}>{item.value}</span>
              <span style={{ color: '#9ca3af', fontSize: '0.7rem' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable causes */}
      <button
        type="button"
        className="rce-expand-btn"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        {expanded ? '▲ Hide Possible Causes' : '▼ View Possible Causes'}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="rce-causes">
              <p style={{ margin: '0 0 8px', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Possible Causes
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {data.causes.map((c, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: '#e5e7eb', fontSize: '0.875rem' }}>
                    <span style={{ color: '#2196F3', marginTop: 2 }}>•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Critical warning */}
      {data.isCritical && (
        <div className="rce-critical-warning">
          <span style={{ fontSize: '1.25rem' }}>⚠️</span>
          <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
            <strong>Do Not Drive the Vehicle.</strong> This issue poses an immediate safety risk. Contact a mechanic immediately.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="rce-disclaimer">
        ℹ️ {data.disclaimer}
      </p>
    </motion.div>
  );
}
