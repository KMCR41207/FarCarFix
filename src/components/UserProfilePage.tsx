import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onBack: () => void;
}

type ProfileTab = 'overview' | 'vehicles' | 'history' | 'settings';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  reg: string;
  fuel: string;
  color: string;
  lastService: string;
}

interface HistoryItem {
  id: string;
  date: string;
  issue: string;
  mechanic: string;
  cost: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v1', brand: 'Toyota', model: 'Camry', year: '2019', reg: 'DL 01 AB 1234', fuel: 'Petrol', color: 'Silver', lastService: '12 Jan 2026' },
  { id: 'v2', brand: 'Honda', model: 'City', year: '2021', reg: 'MH 02 CD 5678', fuel: 'Petrol', color: 'White', lastService: '3 Mar 2026' },
];

const MOCK_HISTORY: HistoryItem[] = [
  { id: 'h1', date: '12 Jan 2026', issue: 'Brake Pad Replacement', mechanic: 'Sharma Auto Works', cost: '₹2,000', status: 'completed' },
  { id: 'h2', date: '3 Mar 2026', issue: 'Engine Oil Change', mechanic: 'PremiumCare Auto', cost: '₹800', status: 'completed' },
  { id: 'h3', date: '18 May 2026', issue: 'Wheel Alignment', mechanic: 'SpeedFit Service', cost: '₹600', status: 'completed' },
  { id: 'h4', date: '21 Jul 2026', issue: 'Engine Knock Diagnosis', mechanic: 'Sarah Chen Workshop', cost: '—', status: 'pending' },
];

const STATUS_COLORS = {
  completed: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', label: '✓ Completed' },
  pending: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: '⏳ Pending' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', label: '✕ Cancelled' },
};

export default function UserProfilePage({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    city: 'New Delhi',
    avatar: '👤',
  });
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id' | 'lastService'>>({
    brand: '', model: '', year: '', reg: '', fuel: 'Petrol', color: '',
  });

  function addVehicle() {
    if (!newVehicle.brand || !newVehicle.model || !newVehicle.year) return;
    setVehicles(prev => [...prev, {
      ...newVehicle,
      id: `v${Date.now()}`,
      lastService: 'Not serviced yet',
    }]);
    setNewVehicle({ brand: '', model: '', year: '', reg: '', fuel: 'Petrol', color: '' });
    setShowAddVehicle(false);
  }

  function removeVehicle(id: string) {
    setVehicles(prev => prev.filter(v => v.id !== id));
  }

  const TABS: { key: ProfileTab; label: string; emoji: string }[] = [
    { key: 'overview', label: 'Overview', emoji: '🏠' },
    { key: 'vehicles', label: 'My Vehicles', emoji: '🚗' },
    { key: 'history', label: 'Service History', emoji: '📋' },
    { key: 'settings', label: 'Settings', emoji: '⚙️' },
  ];

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className="profile-header">
        <button type="button" className="booking-back-btn" onClick={onBack}>← Back</button>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>
          My <span style={{ color: '#2196F3' }}>Profile</span>
        </h1>
      </div>

      {/* Profile card */}
      <div className="profile-card">
        <div className="profile-avatar">{profile.avatar}</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>{profile.name}</h2>
          <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.875rem' }}>{profile.email}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
            <span className="profile-badge">📞 {profile.phone}</span>
            <span className="profile-badge">📍 {profile.city}</span>
            <span className="profile-badge">🚗 {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}</span>
            <span className="profile-badge">🔧 {MOCK_HISTORY.filter(h => h.status === 'completed').length} services</span>
          </div>
        </div>
        <button type="button" className="profile-edit-btn" onClick={() => setEditProfile(true)}>
          ✏️ Edit
        </button>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            className={`profile-tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            <span>{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="profile-body">
        <AnimatePresence mode="wait">

          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div key="overview"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="profile-stats-row">
                {[
                  { emoji: '🔧', label: 'Total Services', value: MOCK_HISTORY.length },
                  { emoji: '✅', label: 'Completed', value: MOCK_HISTORY.filter(h => h.status === 'completed').length },
                  { emoji: '⏳', label: 'Pending', value: MOCK_HISTORY.filter(h => h.status === 'pending').length },
                  { emoji: '🚗', label: 'Vehicles', value: vehicles.length },
                ].map((s, i) => (
                  <div key={i} className="profile-stat-card">
                    <span style={{ fontSize: '1.75rem' }}>{s.emoji}</span>
                    <span style={{ color: '#2196F3', fontWeight: 800, fontSize: '1.5rem' }}>{s.value}</span>
                    <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="profile-section-title">Recent Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MOCK_HISTORY.slice(0, 3).map(h => (
                  <div key={h.id} className="profile-history-row">
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{h.issue}</p>
                      <p style={{ margin: '2px 0 0', color: '#9ca3af', fontSize: '0.75rem' }}>{h.mechanic} · {h.date}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#e5e7eb', fontWeight: 600, fontSize: '0.875rem' }}>{h.cost}</span>
                      <span className="profile-status-badge"
                        style={{ background: STATUS_COLORS[h.status].bg, color: STATUS_COLORS[h.status].color }}>
                        {STATUS_COLORS[h.status].label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="profile-section-title" style={{ marginTop: '1.5rem' }}>My Vehicles</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {vehicles.map(v => (
                  <div key={v.id} className="profile-vehicle-row">
                    <span style={{ fontSize: '1.5rem' }}>🚗</span>
                    <div>
                      <p style={{ margin: 0, color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{v.year} {v.brand} {v.model}</p>
                      <p style={{ margin: '2px 0 0', color: '#9ca3af', fontSize: '0.75rem' }}>{v.reg} · Last service: {v.lastService}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Vehicles */}
          {activeTab === 'vehicles' && (
            <motion.div key="vehicles"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="profile-section-title" style={{ margin: 0 }}>Registered Vehicles</div>
                <button type="button" className="profile-add-btn" onClick={() => setShowAddVehicle(true)}>
                  + Add Vehicle
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {vehicles.map(v => (
                  <div key={v.id} className="profile-vehicle-card">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
                      <span style={{ fontSize: '2rem' }}>🚗</span>
                      <div>
                        <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                          {v.year} {v.brand} {v.model}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                          {[
                            { label: 'Reg', value: v.reg || '—' },
                            { label: 'Fuel', value: v.fuel },
                            { label: 'Color', value: v.color || '—' },
                            { label: 'Last Service', value: v.lastService },
                          ].map((d, i) => (
                            <span key={i} className="profile-vehicle-chip">
                              <span style={{ color: '#6b7280' }}>{d.label}: </span>
                              <span style={{ color: '#e5e7eb' }}>{d.value}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button type="button" className="profile-remove-btn"
                      onClick={() => removeVehicle(v.id)} aria-label={`Remove ${v.brand} ${v.model}`}>
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              {/* Add vehicle modal */}
              <AnimatePresence>
                {showAddVehicle && (
                  <motion.div className="ns-modal-backdrop"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setShowAddVehicle(false)}>
                    <motion.div className="rr-modal"
                      initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
                      onClick={e => e.stopPropagation()}>
                      <h4 style={{ color: '#fff', margin: '0 0 1.25rem' }}>🚗 Add New Vehicle</h4>
                      <div className="booking-form-grid">
                        {[
                          { label: 'Brand *', key: 'brand', placeholder: 'Toyota' },
                          { label: 'Model *', key: 'model', placeholder: 'Camry' },
                          { label: 'Year *', key: 'year', placeholder: '2020' },
                          { label: 'Registration', key: 'reg', placeholder: 'DL 01 AB 1234' },
                          { label: 'Color', key: 'color', placeholder: 'Silver' },
                        ].map(f => (
                          <div key={f.key}>
                            <label className="booking-label">{f.label}</label>
                            <input type="text" className="booking-input" placeholder={f.placeholder}
                              value={newVehicle[f.key as keyof typeof newVehicle]}
                              onChange={e => setNewVehicle(prev => ({ ...prev, [f.key]: e.target.value }))} />
                          </div>
                        ))}
                        <div>
                          <label className="booking-label">Fuel Type</label>
                          <select className="booking-input"
                            value={newVehicle.fuel}
                            onChange={e => setNewVehicle(prev => ({ ...prev, fuel: e.target.value }))}>
                            {['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                        <button type="button" className="rr-submit-btn" onClick={addVehicle}>Add Vehicle</button>
                        <button type="button" className="rr-cancel-btn" onClick={() => setShowAddVehicle(false)}>Cancel</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* History */}
          {activeTab === 'history' && (
            <motion.div key="history"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="profile-section-title">Service History</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MOCK_HISTORY.map(h => (
                  <div key={h.id} className="profile-history-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{h.issue}</p>
                        <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.8rem' }}>
                          🔧 {h.mechanic}
                        </p>
                        <p style={{ margin: '3px 0 0', color: '#6b7280', fontSize: '0.75rem' }}>📅 {h.date}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <span style={{ color: '#e5e7eb', fontWeight: 700, fontSize: '1rem' }}>{h.cost}</span>
                        <span className="profile-status-badge"
                          style={{ background: STATUS_COLORS[h.status].bg, color: STATUS_COLORS[h.status].color }}>
                          {STATUS_COLORS[h.status].label}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <motion.div key="settings"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="profile-section-title">Account Settings</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { emoji: '🔔', label: 'Push Notifications', desc: 'Booking reminders and updates' },
                  { emoji: '📍', label: 'Location Services', desc: 'Allow location for nearby mechanics' },
                  { emoji: '💬', label: 'WhatsApp Alerts', desc: 'Receive booking status on WhatsApp' },
                  { emoji: '📧', label: 'Email Digest', desc: 'Weekly service reports by email' },
                ].map((s, i) => (
                  <div key={i} className="profile-setting-row">
                    <span style={{ fontSize: '1.25rem' }}>{s.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, color: '#fff', fontWeight: 600, fontSize: '0.875rem' }}>{s.label}</p>
                      <p style={{ margin: '2px 0 0', color: '#9ca3af', fontSize: '0.75rem' }}>{s.desc}</p>
                    </div>
                    <label className="profile-toggle">
                      <input type="checkbox" defaultChecked={i < 2} />
                      <span className="profile-toggle-slider" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="profile-section-title" style={{ marginTop: '1.5rem' }}>Danger Zone</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button type="button" className="profile-danger-btn">
                  🔒 Change Password
                </button>
                <button type="button" className="profile-danger-btn profile-danger-red">
                  🗑️ Delete Account
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Edit profile modal */}
      <AnimatePresence>
        {editProfile && (
          <motion.div className="ns-modal-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setEditProfile(false)}>
            <motion.div className="rr-modal"
              initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <h4 style={{ color: '#fff', margin: '0 0 1.25rem' }}>✏️ Edit Profile</h4>
              {[
                { label: 'Full Name', key: 'name' },
                { label: 'Email', key: 'email' },
                { label: 'Phone', key: 'phone' },
                { label: 'City', key: 'city' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '0.85rem' }}>
                  <label className="booking-label">{f.label}</label>
                  <input type="text" className="booking-input"
                    value={profile[f.key as keyof typeof profile]}
                    onChange={e => setProfile(prev => ({ ...prev, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                <button type="button" className="rr-submit-btn" onClick={() => setEditProfile(false)}>Save Changes</button>
                <button type="button" className="rr-cancel-btn" onClick={() => setEditProfile(false)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
