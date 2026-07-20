import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VehicleData } from '../App';

interface DiagnosisResult {
  issue: string;
  confidence: number;
  actions: string[];
  warning: string;
}

interface Props {
  data: VehicleData;
  diagnosis: DiagnosisResult;
}

interface ReportData {
  ownerName: string;
  regNumber: string;
  date: string;
  time: string;
  gpsLocation: string;
  weatherCondition: string;
  userDescription: string;
}

function getTodayDate() {
  return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function getTodayTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function getCostForIssue(issue: string) {
  const s = issue.toLowerCase();
  if (s.includes('brake')) return { diy: '₹1,200', garage: '₹2,000', center: '₹3,300' };
  if (s.includes('overheat') || s.includes('coolant')) return { diy: '₹600', garage: '₹1,300', center: '₹2,300' };
  if (s.includes('noise') || s.includes('knock') || s.includes('belt')) return { diy: '₹900', garage: '₹1,600', center: '₹2,500' };
  if (s.includes('vibrat') || s.includes('shake')) return { diy: '₹400', garage: '₹1,000', center: '₹1,800' };
  if (s.includes('light') || s.includes('warning')) return { diy: '₹500', garage: '₹1,000', center: '₹1,700' };
  if (s.includes('battery') || s.includes('start')) return { diy: '₹3,500', garage: '₹3,800', center: '₹5,100' };
  return { diy: '₹0', garage: '₹1,100', center: '₹1,900' };
}

function getStepByStep(issue: string): { step: string; detail: string }[] {
  const s = issue.toLowerCase();
  if (s.includes('brake')) {
    return [
      { step: 'Safely park the vehicle', detail: 'Turn off the engine and engage the parking brake on a flat surface.' },
      { step: 'Inspect brake pads', detail: 'Look through the wheel spokes to check pad thickness. Replace if below 3mm.' },
      { step: 'Check brake fluid', detail: 'Open the hood and locate the brake fluid reservoir. Ensure it is at the MAX line.' },
      { step: 'Look for rotor damage', detail: 'Examine the disc for grooves, cracks, or rust. Resurface or replace if damaged.' },
    ];
  }
  if (s.includes('overheat') || s.includes('coolant') || s.includes('temperature')) {
    return [
      { step: 'Stop the vehicle immediately', detail: 'Pull over safely, turn off the engine, and do not open the hood right away.' },
      { step: 'Wait 30 minutes to cool', detail: 'Let the engine cool completely before touching any components.' },
      { step: 'Check coolant level', detail: 'Locate the coolant reservoir (usually a white translucent tank). Top up if low.' },
      { step: 'Inspect hoses and radiator', detail: 'Look for cracks, leaks, or damage. Tighten any loose clamps you find.' },
    ];
  }
  if (s.includes('battery') || s.includes('start') || s.includes('dead')) {
    return [
      { step: 'Turn off all electronics', detail: 'Switch off headlights, radio, and AC before attempting to jump-start.' },
      { step: 'Connect jump-start cables', detail: 'Red to positive (+), Black to negative (−). Connect to donor car first.' },
      { step: 'Start the donor vehicle', detail: 'Run for 2 minutes, then attempt to start your vehicle.' },
      { step: 'Let vehicle charge', detail: 'Drive for at least 30 minutes to recharge the battery.' },
    ];
  }
  // Generic
  return [
    { step: 'Turn off the engine', detail: 'Bring the vehicle to a safe stop before any inspection.' },
    { step: 'Perform a visual inspection', detail: 'Check for any visible leaks, smoke, or damaged components.' },
    { step: 'Check all fluid levels', detail: 'Oil, coolant, brake fluid, and transmission fluid.' },
    { step: 'Contact a professional', detail: 'If the issue persists, consult a certified mechanic for a thorough diagnosis.' },
  ];
}

function getToolsForIssue(issue: string): string[] {
  const s = issue.toLowerCase();
  if (s.includes('brake')) return ['Jack & jack stands', 'Lug wrench', 'Brake cleaner spray', 'Flashlight'];
  if (s.includes('overheat') || s.includes('coolant')) return ['Coolant bottle', 'Funnel', 'Safety gloves', 'Flashlight'];
  if (s.includes('battery') || s.includes('start')) return ['Jump-start cables', 'Multimeter', 'Safety gloves'];
  return ["Owner's manual", 'Adjustable wrench', 'Flashlight', 'Basic tool kit'];
}

function isCritical(issue: string): boolean {
  const s = issue.toLowerCase();
  return s.includes('brake') || s.includes('overheat') || s.includes('fuel leak') || s.includes('steering');
}

export default function RepairReport({ data, diagnosis }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [reportData, setReportData] = useState<ReportData>({
    ownerName: '',
    regNumber: '',
    date: getTodayDate(),
    time: getTodayTime(),
    gpsLocation: 'New Delhi, India',
    weatherCondition: 'Clear',
    userDescription: '',
  });

  const costs = getCostForIssue(diagnosis.issue);
  const steps = getStepByStep(diagnosis.issue);
  const tools = getToolsForIssue(diagnosis.issue);
  const critical = isCritical(diagnosis.issue);

  const handleFill = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFilled(true);
    setShowForm(false);
    setTimeout(() => {
      const el = document.getElementById('repair-report-preview');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = (channel: string) => {
    const text = `FarCarFix Diagnosis Report – ${data.year} ${data.carBrand} ${data.model} | Issue: ${diagnosis.issue} | Confidence: ${diagnosis.confidence}%`;
    if (channel === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + window.location.href)}`, '_blank', 'noopener,noreferrer');
    } else if (channel === 'email') {
      window.open(`mailto:?subject=FarCarFix Repair Report&body=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    }
    setShareStatus(`Shared via ${channel}`);
    setTimeout(() => setShareStatus(''), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      className="rr-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
    >
      {/* Header */}
      <div className="rr-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="rce-icon-box">📄</span>
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.125rem' }}>AI Repair Report</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>Auto-generated • Shareable • Printable</p>
          </div>
        </div>
        <button
          type="button"
          className="rr-generate-btn"
          onClick={() => setShowForm(true)}
        >
          {formFilled ? '✏️ Edit Info' : '📝 Fill Details'}
        </button>
      </div>

      {/* Info-fill modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="ns-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Fill report details"
          >
            <motion.form
              className="rr-modal"
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              onClick={e => e.stopPropagation()}
              onSubmit={handleFill}
            >
              <h4 style={{ color: '#fff', margin: '0 0 1.25rem', fontSize: '1rem' }}>
                📋 Report Details
              </h4>
              {[
                { label: 'Owner Name', key: 'ownerName', placeholder: 'e.g. Rahul Sharma', required: true },
                { label: 'Registration Number', key: 'regNumber', placeholder: 'e.g. DL 01 AB 1234', required: false },
                { label: 'GPS Location', key: 'gpsLocation', placeholder: 'e.g. MG Road, New Delhi', required: false },
                { label: 'Weather Condition', key: 'weatherCondition', placeholder: 'e.g. Clear, Rainy', required: false },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
                    {field.label}{field.required ? ' *' : ''}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    required={field.required}
                    value={reportData[field.key as keyof ReportData]}
                    onChange={e => setReportData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="rr-input"
                  />
                </div>
              ))}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
                  Describe the incident
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. The engine stopped while driving at 60km/h on the highway..."
                  value={reportData.userDescription}
                  onChange={e => setReportData(prev => ({ ...prev, userDescription: e.target.value }))}
                  className="rr-input rr-textarea"
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="rr-submit-btn">Generate Report</button>
                <button type="button" className="rr-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview of report */}
      <div id="repair-report-preview" className="rr-preview">

        {/* Section 1: Vehicle Info */}
        <div className="rr-section">
          <div className="rr-section-title">
            <span>🚗</span> Vehicle Information
          </div>
          <div className="rr-info-grid">
            {[
              { label: 'Owner', value: formFilled && reportData.ownerName ? reportData.ownerName : '—' },
              { label: 'Brand', value: data.carBrand },
              { label: 'Model', value: data.model },
              { label: 'Year', value: data.year },
              { label: 'Registration', value: formFilled && reportData.regNumber ? reportData.regNumber : '—' },
            ].map((row, i) => (
              <div key={i} className="rr-info-row">
                <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{row.label}</span>
                <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '0.875rem' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Breakdown Details */}
        <div className="rr-section">
          <div className="rr-section-title"><span>🕐</span> Breakdown Details</div>
          <div className="rr-info-grid">
            {[
              { label: 'Date', value: reportData.date },
              { label: 'Time', value: reportData.time },
              { label: 'GPS Location', value: reportData.gpsLocation },
              { label: 'Weather', value: reportData.weatherCondition },
            ].map((row, i) => (
              <div key={i} className="rr-info-row">
                <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{row.label}</span>
                <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '0.875rem' }}>{row.value}</span>
              </div>
            ))}
          </div>
          {formFilled && reportData.userDescription && (
            <div className="rr-user-description">
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>User Description</p>
              <p style={{ margin: 0, color: '#e5e7eb', fontSize: '0.875rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{reportData.userDescription}"
              </p>
            </div>
          )}
        </div>

        {/* Section 3: AI Diagnosis */}
        <div className="rr-section">
          <div className="rr-section-title"><span>🤖</span> AI Diagnosis</div>
          <div className="rr-diagnosis-banner">
            <div>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>Detected Problem</p>
              <p style={{ margin: '4px 0 0', color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{diagnosis.issue}</p>
            </div>
            <div className="rce-confidence-ring" style={{ minWidth: 60 }}>
              <span style={{ color: '#2196F3', fontWeight: 800, fontSize: '1rem' }}>{diagnosis.confidence}%</span>
              <span style={{ color: '#94a3b8', fontSize: '0.65rem' }}>AI Score</span>
            </div>
          </div>
        </div>

        {/* Section 4: DIY Steps */}
        <div className="rr-section">
          <div className="rr-section-title"><span>🔧</span> Recommended DIY Solution</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((s, i) => (
              <div key={i} className="rr-step">
                <div className="rr-step-number">{i + 1}</div>
                <div>
                  <p style={{ margin: 0, color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{s.step}</p>
                  <p style={{ margin: '3px 0 0', color: '#9ca3af', fontSize: '0.8rem', lineHeight: 1.5 }}>{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '1rem' }}>
            {tools.map((t, i) => (
              <span key={i} className="rr-tool-chip">{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>⏱ Est. Time: {steps.length <= 3 ? '20–30 min' : '30–60 min'}</span>
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>📊 Difficulty: Easy–Moderate</span>
          </div>
        </div>

        {/* Section 5: Cost Summary */}
        <div className="rr-section">
          <div className="rr-section-title"><span>💰</span> Estimated Repair Cost</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { label: 'DIY', value: costs.diy, color: '#22c55e' },
              { label: 'Local Garage', value: costs.garage, color: '#2196F3' },
              { label: 'Authorized Center', value: costs.center, color: '#f59e0b' },
            ].map(c => (
              <div key={c.label} className="rr-cost-chip" style={{ borderColor: c.color + '44' }}>
                <span style={{ color: c.color, fontWeight: 800, fontSize: '0.975rem' }}>{c.value}</span>
                <span style={{ color: '#9ca3af', fontSize: '0.7rem' }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Safety Warning */}
        {critical && (
          <div className="rr-critical-box">
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
              <p style={{ margin: 0, color: '#fca5a5', fontWeight: 700, fontSize: '0.95rem' }}>Safety Warning</p>
              <p style={{ margin: '4px 0 0', color: '#fecaca', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Do Not Drive the Vehicle. This issue poses an immediate safety risk. Contact a mechanic immediately.
              </p>
            </div>
          </div>
        )}

        {/* Section 7: Mechanic Summary */}
        <div className="rr-section">
          <div className="rr-section-title"><span>👨‍🔧</span> Mechanic Summary</div>
          <div className="rr-mechanic-summary">
            <div className="rr-info-row">
              <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Vehicle</span>
              <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '0.875rem' }}>{data.year} {data.carBrand} {data.model}</span>
            </div>
            <div className="rr-info-row">
              <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Diagnosis</span>
              <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '0.875rem' }}>{diagnosis.issue}</span>
            </div>
            <div className="rr-info-row">
              <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Parts Needed</span>
              <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '0.875rem' }}>
                {tools.slice(0, 2).join(', ')}
              </span>
            </div>
            <div className="rr-info-row">
              <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Est. Repair Time</span>
              <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '0.875rem' }}>{steps.length <= 3 ? '30 min' : '1–2 hours'}</span>
            </div>
            <div className="rr-info-row" style={{ gridColumn: '1/-1' }}>
              <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Recommended Actions</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 2 }}>
                {diagnosis.actions.slice(0, 3).map((a, i) => (
                  <span key={i} style={{ color: '#e5e7eb', fontSize: '0.8rem' }}>• {a}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 8: Share / Download */}
        <div className="rr-section">
          <div className="rr-section-title"><span>📤</span> Download & Share</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button type="button" className="rr-action-btn rr-btn-print" onClick={handlePrint}>
              🖨️ Print / Save PDF
            </button>
            <button type="button" className="rr-action-btn rr-btn-whatsapp" onClick={() => handleShare('whatsapp')}>
              💬 WhatsApp
            </button>
            <button type="button" className="rr-action-btn rr-btn-email" onClick={() => handleShare('email')}>
              ✉️ Email
            </button>
            <button type="button" className="rr-action-btn rr-btn-copy" onClick={handleCopyLink}>
              {copied ? '✓ Copied!' : '🔗 Copy Link'}
            </button>
          </div>
          {shareStatus && (
            <p style={{ margin: '8px 0 0', color: '#22c55e', fontSize: '0.8rem' }}>✓ {shareStatus}</p>
          )}
        </div>

      </div>
    </motion.div>
  );
}
