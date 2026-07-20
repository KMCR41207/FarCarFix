import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface BookingForm {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  issue: string;
  date: string;
  time: string;
  mechanic: string;
  serviceType: string;
  address: string;
  notes: string;
}

const MECHANICS = [
  { id: 'm1', name: 'Sharma Auto Works', specialty: 'Engine & Transmission', rating: 4.8, available: true, distance: '0.8 km' },
  { id: 'm2', name: 'Sarah Chen Workshop', specialty: 'Electrical Systems', rating: 4.8, available: true, distance: '1.2 km' },
  { id: 'm3', name: 'PremiumCare Auto', specialty: 'General Repairs', rating: 4.9, available: true, distance: '3.0 km' },
  { id: 'm4', name: 'SpeedFit Service', specialty: 'Tyre & Brakes', rating: 4.7, available: false, distance: '2.1 km' },
];

const SERVICE_TYPES = [
  { id: 'emergency', label: '🚨 Emergency Roadside', desc: 'Immediate on-site help' },
  { id: 'garage', label: '🏪 Garage Visit', desc: 'Drop off at mechanic' },
  { id: 'home', label: '🏠 Home Service', desc: 'Mechanic comes to you' },
  { id: 'tow', label: '🚛 Towing', desc: 'Tow to nearest garage' },
];

const TIME_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

type Step = 1 | 2 | 3 | 4;

interface Props {
  onBack: () => void;
}

export default function BookingPage({ onBack }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    name: '', phone: '', email: '', vehicle: '', issue: '',
    date: '', time: '', mechanic: '', serviceType: '', address: '', notes: '',
  });

  const today = new Date().toISOString().split('T')[0];

  function update(key: keyof BookingForm, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function canProceed(): boolean {
    if (step === 1) return !!(form.name && form.phone && form.vehicle && form.issue);
    if (step === 2) return !!(form.serviceType);
    if (step === 3) return !!(form.mechanic && form.date && form.time);
    return true;
  }

  function handleConfirm() {
    setConfirmed(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const bookingRef = `FCF-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  if (confirmed) {
    return (
      <motion.div
        className="booking-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="booking-success">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="booking-success-icon"
          >
            ✓
          </motion.div>
          <h2 style={{ color: '#fff', margin: '1rem 0 0.5rem' }}>Booking Confirmed!</h2>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
            Your reference number is <strong style={{ color: '#2196F3' }}>{bookingRef}</strong>
          </p>
          <div className="booking-confirm-details">
            {[
              { label: 'Name', value: form.name },
              { label: 'Vehicle', value: form.vehicle },
              { label: 'Service', value: SERVICE_TYPES.find(s => s.id === form.serviceType)?.label ?? form.serviceType },
              { label: 'Mechanic', value: MECHANICS.find(m => m.id === form.mechanic)?.name ?? form.mechanic },
              { label: 'Date & Time', value: `${form.date} at ${form.time}` },
            ].map((row, i) => (
              <div key={i} className="booking-confirm-row">
                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{row.label}</span>
                <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '0.875rem' }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              className="booking-action-btn booking-btn-primary"
              onClick={() => {
                const text = `FarCarFix Booking Confirmed! Ref: ${bookingRef} | Vehicle: ${form.vehicle} | Date: ${form.date} at ${form.time}`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
              }}
            >
              💬 Share on WhatsApp
            </button>
            <button type="button" className="booking-action-btn booking-btn-secondary" onClick={onBack}>
              ← Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="booking-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className="booking-header">
        <button type="button" className="booking-back-btn" onClick={onBack}>
          ← Back
        </button>
        <div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
            Book a <span style={{ color: '#2196F3' }}>Mechanic</span>
          </h1>
          <p style={{ color: '#9ca3af', margin: '4px 0 0', fontSize: '0.9rem' }}>
            Fast, reliable service booked in minutes
          </p>
        </div>
      </div>

      {/* Step progress */}
      <div className="booking-steps">
        {['Your Details', 'Service Type', 'Schedule', 'Confirm'].map((label, i) => {
          const n = (i + 1) as Step;
          const done = step > n;
          const active = step === n;
          return (
            <React.Fragment key={n}>
              <div className={`booking-step ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
                <div className="booking-step-circle">
                  {done ? '✓' : n}
                </div>
                <span className="booking-step-label">{label}</span>
              </div>
              {i < 3 && <div className={`booking-step-line ${done ? 'done' : ''}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step panels */}
      <div className="booking-body">
        <AnimatePresence mode="wait">
          {/* Step 1 — Details */}
          {step === 1 && (
            <motion.div key="s1" className="booking-panel"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h3 className="booking-panel-title">👤 Your Details</h3>
              <div className="booking-form-grid">
                {[
                  { label: 'Full Name *', key: 'name', placeholder: 'Rahul Sharma', type: 'text' },
                  { label: 'Phone Number *', key: 'phone', placeholder: '+91 98765 43210', type: 'tel' },
                  { label: 'Email Address', key: 'email', placeholder: 'rahul@email.com', type: 'email' },
                  { label: 'Vehicle (Year, Brand, Model) *', key: 'vehicle', placeholder: '2019 Toyota Camry', type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="booking-label">{f.label}</label>
                    <input
                      type={f.type}
                      className="booking-input"
                      placeholder={f.placeholder}
                      value={form[f.key as keyof BookingForm]}
                      onChange={e => update(f.key as keyof BookingForm, e.target.value)}
                    />
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="booking-label">Describe the Issue *</label>
                  <textarea
                    className="booking-input booking-textarea"
                    rows={3}
                    placeholder="e.g. Engine making knocking noise when accelerating..."
                    value={form.issue}
                    onChange={e => update('issue', e.target.value)}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="booking-label">Pickup / Service Address</label>
                  <input
                    type="text"
                    className="booking-input"
                    placeholder="e.g. 42, MG Road, New Delhi"
                    value={form.address}
                    onChange={e => update('address', e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2 — Service Type */}
          {step === 2 && (
            <motion.div key="s2" className="booking-panel"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h3 className="booking-panel-title">🔧 Select Service Type</h3>
              <div className="booking-service-grid">
                {SERVICE_TYPES.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className={`booking-service-card ${form.serviceType === s.id ? 'selected' : ''}`}
                    onClick={() => update('serviceType', s.id)}
                  >
                    <span style={{ fontSize: '2rem' }}>{s.label.split(' ')[0]}</span>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                      {s.label.split(' ').slice(1).join(' ')}
                    </span>
                    <span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{s.desc}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3 — Schedule */}
          {step === 3 && (
            <motion.div key="s3" className="booking-panel"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h3 className="booking-panel-title">📅 Choose Mechanic & Time</h3>

              <p className="booking-section-label">Available Mechanics</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.5rem' }}>
                {MECHANICS.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    className={`booking-mechanic-row ${form.mechanic === m.id ? 'selected' : ''} ${!m.available ? 'disabled' : ''}`}
                    onClick={() => m.available && update('mechanic', m.id)}
                    disabled={!m.available}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                      <div className="booking-mechanic-avatar">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{ margin: 0, color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{m.name}</p>
                        <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.75rem' }}>{m.specialty} • {m.distance}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>★ {m.rating}</span>
                      <span className={`booking-avail-badge ${m.available ? 'open' : 'busy'}`}>
                        {m.available ? 'Available' : 'Busy'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="booking-form-grid">
                <div>
                  <label className="booking-label">Select Date *</label>
                  <input
                    type="date"
                    className="booking-input"
                    min={today}
                    value={form.date}
                    onChange={e => update('date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="booking-label">Select Time *</label>
                  <div className="booking-time-grid">
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        type="button"
                        className={`booking-time-slot ${form.time === t ? 'selected' : ''}`}
                        onClick={() => update('time', t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4 — Confirm */}
          {step === 4 && (
            <motion.div key="s4" className="booking-panel"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h3 className="booking-panel-title">✅ Review & Confirm</h3>
              <div className="booking-review-grid">
                {[
                  { label: 'Name', value: form.name },
                  { label: 'Phone', value: form.phone },
                  { label: 'Email', value: form.email || '—' },
                  { label: 'Vehicle', value: form.vehicle },
                  { label: 'Issue', value: form.issue },
                  { label: 'Service Type', value: SERVICE_TYPES.find(s => s.id === form.serviceType)?.label ?? '—' },
                  { label: 'Mechanic', value: MECHANICS.find(m => m.id === form.mechanic)?.name ?? '—' },
                  { label: 'Date', value: form.date },
                  { label: 'Time', value: form.time },
                  { label: 'Address', value: form.address || '—' },
                ].map((row, i) => (
                  <div key={i} className="booking-review-row">
                    <span style={{ color: '#6b7280', fontSize: '0.78rem', fontWeight: 600 }}>{row.label}</span>
                    <span style={{ color: '#e5e7eb', fontSize: '0.875rem', fontWeight: 500 }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <label className="booking-label">Additional Notes</label>
                <textarea
                  className="booking-input booking-textarea"
                  rows={2}
                  placeholder="Any extra info for the mechanic..."
                  value={form.notes}
                  onChange={e => update('notes', e.target.value)}
                />
              </div>
              <div className="booking-terms">
                <span>🔒</span>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.78rem' }}>
                  By confirming, you agree to FarCarFix's terms. The mechanic will contact you 30 minutes before arrival.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="booking-nav">
          {step > 1 && (
            <button type="button" className="booking-action-btn booking-btn-secondary"
              onClick={() => setStep(s => (s - 1) as Step)}>
              ← Previous
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              className="booking-action-btn booking-btn-primary"
              disabled={!canProceed()}
              onClick={() => setStep(s => (s + 1) as Step)}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className="booking-action-btn booking-btn-confirm"
              onClick={handleConfirm}
            >
              🗓️ Confirm Booking
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
