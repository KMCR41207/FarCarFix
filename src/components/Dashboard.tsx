
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, Vehicle, DiagnosisRecord } from '../context/AuthContext';

interface Props {
  onBack: () => void;
  onNewDiagnosis: () => void;
  onBooking: () => void;
}

type Tab = 'overview' | 'vehicles' | 'history' | 'mechanics' | 'settings';

const SEV_COLOR: Record<string, { bg: string; color: string; label: string }> = {
  low:      { bg: 'rgba(34,197,94,0.12)',   color: '#22c55e', label: 'Low' },
  medium:   { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b', label: 'Medium' },
  high:     { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', label: 'High' },
  critical: { bg: 'rgba(239,68,68,0.18)',   color: '#ef4444', label: 'Critical' },
};

const STATUS_COLOR: Record<string, { bg: string; color: string; label: string }> = {
  pending:     { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: '⏳ Pending' },
  in_progress: { bg: 'rgba(33,150,243,0.12)', color: '#2196F3', label: '🔧 In Progress' },
  completed:   { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e', label: '✓ Completed' },
  cancelled:   { bg: 'rgba(107,114,128,0.12)',color: '#6b7280', label: '✕ Cancelled' },
};

const REMINDER_ICONS: Record<string, string> = {
  'Oil Change': '🛢️', 'PUC Renewal': '📋', 'Insurance Renewal': '🛡️',
  'Next Service Due': '🔧', 'Tire Rotation': '🔄', 'Battery Check': '🔋',
  'Brake Inspection': '🚦',
};

function timeUntil(dateStr: string): { label: string; urgent: boolean } {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000);
  if (diff < 0) return { label: 'Overdue', urgent: true };
  if (diff === 0) return { label: 'Due today', urgent: true };
  if (diff <= 7) return { label: `${diff}d left`, urgent: true };
  if (diff <= 30) return { label: `${diff}d left`, urgent: false };
  return { label: new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }), urgent: false };
}

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}


export default function Dashboard({ onBack, onNewDiagnosis, onBooking }: Props) {
  const {
    user, vehicles, diagnosisHistory, savedMechanics, reminders,
    signOut, updateProfile, updatePreferences, updateVehicle,
    addVehicle, deleteVehicle, setDefaultVehicle,
    deleteDiagnosisRecord, removeSavedMechanic, dismissReminder,
  } = useAuth();

  const [tab, setTab] = useState<Tab>('overview');
  const [histFilter, setHistFilter] = useState<string>('all');
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDetailId, setShowDetailId] = useState<string | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  const [vehicleForm, setVehicleForm] = useState<Partial<Vehicle>>({
    nickname: '', make: '', model: '', variant: '', year: '',
    regNumber: '', fuelType: 'Petrol', transmission: 'Manual',
    engineType: '', color: '', odometer: '', vin: '',
    insuranceExpiry: '', pucExpiry: '', lastServiceDate: '', nextServiceDate: '',
    isDefault: false,
  });

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
  });

  const activeReminders = reminders.filter(r => !r.isDismissed);
  const pendingDiag = diagnosisHistory.filter(r => r.repairStatus === 'pending').length;
  const completedDiag = diagnosisHistory.filter(r => r.repairStatus === 'completed').length;

  const filteredHistory = histFilter === 'all'
    ? diagnosisHistory
    : histFilter === 'pending' ? diagnosisHistory.filter(r => r.repairStatus === 'pending')
    : histFilter === 'completed' ? diagnosisHistory.filter(r => r.repairStatus === 'completed')
    : diagnosisHistory.filter(r => r.severity === histFilter);

  const detailRecord = diagnosisHistory.find(r => r.id === showDetailId);

  function openAddVehicle() {
    setEditVehicleId(null);
    setVehicleForm({ nickname: '', make: '', model: '', variant: '', year: '', regNumber: '',
      fuelType: 'Petrol', transmission: 'Manual', engineType: '', color: '', odometer: '',
      vin: '', insuranceExpiry: '', pucExpiry: '', lastServiceDate: '', nextServiceDate: '', isDefault: false });
    setShowVehicleModal(true);
  }

  function openEditVehicle(v: Vehicle) {
    setEditVehicleId(v.id);
    setVehicleForm({ ...v });
    setShowVehicleModal(true);
  }

  function saveVehicle() {
    if (!vehicleForm.make || !vehicleForm.model || !vehicleForm.year) return;
    if (editVehicleId) {
      updateVehicle(editVehicleId, vehicleForm as Partial<Vehicle>);
    } else {
      addVehicle(vehicleForm as Omit<Vehicle, 'id' | 'createdAt'>);
    }
    setShowVehicleModal(false);
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateProfile({ profileImage: reader.result as string });
    reader.readAsDataURL(file);
  }

  function saveProfile() {
    updateProfile(profileForm);
    setShowProfileModal(false);
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const TABS: { key: Tab; label: string; emoji: string }[] = [
    { key: 'overview',  label: 'Overview',   emoji: '🏠' },
    { key: 'vehicles',  label: 'Vehicles',   emoji: '🚗' },
    { key: 'history',   label: 'History',    emoji: '📋' },
    { key: 'mechanics', label: 'Mechanics',  emoji: '🔧' },
    { key: 'settings',  label: 'Settings',   emoji: '⚙️' },
  ];

  return (
    <div className="dash-page">
      {/* ── Top bar ── */}
      <div className="dash-topbar">
        <button type="button" className="dash-logo" onClick={onBack}>
          🔧 Far Car <span>Fix</span>
        </button>
        <div className="dash-topbar-actions">
          <button type="button" className="dash-notif-btn" onClick={() => setShowNotifs(p => !p)} aria-label="Notifications">
            🔔
            {activeReminders.length > 0 && <span className="dash-notif-dot" />}
          </button>
          <button type="button" className="dash-avatar-btn" onClick={() => setShowProfileModal(true)} aria-label="Profile">
            {user?.profileImage
              ? <img src={user.profileImage} alt="avatar" />
              : <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2196F3' }}>{initials}</span>}
          </button>
          <button type="button" onClick={signOut}
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, color: '#f87171', padding: '5px 10px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Notifications panel ── */}
      <AnimatePresence>
        {showNotifs && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ position: 'fixed', top: 68, right: 16, zIndex: 100, width: 300,
              background: '#111827', border: '1.5px solid rgba(33,150,243,0.25)', borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgba(55,65,81,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>🔔 Reminders</span>
              <button type="button" onClick={() => setShowNotifs(false)}
                style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
            </div>
            {activeReminders.length === 0
              ? <div style={{ padding: '1.25rem', color: '#6b7280', fontSize: '0.82rem', textAlign: 'center' }}>All clear! No reminders.</div>
              : activeReminders.map(r => {
                const t = timeUntil(r.dueDate);
                return (
                  <div key={r.id} className="dash-reminder-row">
                    <div className="dash-reminder-icon"
                      style={{ background: t.urgent ? 'rgba(239,68,68,0.12)' : 'rgba(33,150,243,0.1)' }}>
                      {REMINDER_ICONS[r.type] || '📌'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, color: '#e5e7eb', fontSize: '0.8rem', fontWeight: 600 }}>{r.type}</p>
                      <p style={{ margin: '2px 0 0', color: t.urgent ? '#f87171' : '#6b7280', fontSize: '0.7rem', fontWeight: 600 }}>{t.label}</p>
                    </div>
                    <button type="button" className="dash-dismiss-btn" onClick={() => dismissReminder(r.id)}>✕</button>
                  </div>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="dash-body">
        {/* ── Welcome ── */}
        <div className="dash-welcome">
          <h2>👋 Welcome back, {user?.fullName?.split(' ')[0] || 'there'}</h2>
          <p>Member since {user?.createdAt ? formatDate(user.createdAt) : '—'} · {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered</p>
        </div>

        {/* ── Stats row ── */}
        <div className="dash-stats-grid">
          {[
            { icon: '🚗', bg: 'rgba(33,150,243,0.12)', val: vehicles.length, label: 'Vehicles' },
            { icon: '🔬', bg: 'rgba(139,92,246,0.12)', val: diagnosisHistory.length, label: 'AI Diagnoses' },
            { icon: '✅', bg: 'rgba(34,197,94,0.12)', val: completedDiag, label: 'Completed' },
            { icon: '⏳', bg: 'rgba(245,158,11,0.12)', val: pendingDiag, label: 'Pending' },
          ].map((s, i) => (
            <motion.div key={i} className="dash-stat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <div className="dash-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div className="dash-stat-val">{s.val}</div>
              <div className="dash-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="dash-card" style={{ marginBottom: 0 }}>
          <div className="dash-tabs">
            {TABS.map(t => (
              <button key={t.key} type="button" className={`dash-tab ${tab === t.key ? 'active' : ''}`}
                onClick={() => setTab(t.key)}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="dash-main-grid" style={{ padding: '1.25rem', gap: 16 }}>
                  {/* Quick actions */}
                  <div>
                    <p style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 0.75rem' }}>Quick Actions</p>
                    <div className="dash-quick-actions">
                      {[
                        { icon: '🔬', label: 'New Diagnosis', bg: 'rgba(139,92,246,0.15)', action: onNewDiagnosis },
                        { icon: '🔧', label: 'Book Mechanic', bg: 'rgba(33,150,243,0.15)', action: onBooking },
                        { icon: '🚗', label: 'Add Vehicle', bg: 'rgba(34,197,94,0.12)', action: () => { setTab('vehicles'); openAddVehicle(); } },
                        { icon: '📋', label: 'View History', bg: 'rgba(245,158,11,0.12)', action: () => setTab('history') },
                      ].map((qa, i) => (
                        <button key={i} type="button" className="dash-qa-btn" onClick={qa.action}>
                          <div className="dash-qa-icon" style={{ background: qa.bg }}>{qa.icon}</div>
                          <span style={{ color: '#e5e7eb', fontSize: '0.78rem', fontWeight: 600 }}>{qa.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Recent diagnoses */}
                    <p style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '1.5rem 0 0.75rem' }}>Recent Diagnoses</p>
                    {diagnosisHistory.slice(0, 3).map(r => (
                      <div key={r.id} className="dash-diag-row" onClick={() => setShowDetailId(r.id)}>
                        <div className="dash-sev-dot" style={{ background: SEV_COLOR[r.severity]?.color || '#6b7280' }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, color: '#e5e7eb', fontSize: '0.85rem', fontWeight: 600 }}>{r.aiDiagnosis}</p>
                          <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '0.72rem' }}>{r.date} · {r.issueDescription.slice(0, 50)}{r.issueDescription.length > 50 ? '…' : ''}</p>
                        </div>
                        <span className="dash-status-badge" style={{ background: STATUS_COLOR[r.repairStatus]?.bg, color: STATUS_COLOR[r.repairStatus]?.color }}>
                          {STATUS_COLOR[r.repairStatus]?.label}
                        </span>
                      </div>
                    ))}
                    {diagnosisHistory.length === 0 && (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: '#4b5563', fontSize: '0.85rem' }}>
                        No diagnoses yet. Start your first AI diagnosis!
                      </div>
                    )}
                  </div>

                  {/* Reminders */}
                  <div>
                    <p style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 0.75rem' }}>Maintenance Reminders</p>
                    <div style={{ background: 'rgba(17,24,39,0.6)', border: '1px solid rgba(55,65,81,0.4)', borderRadius: 12, overflow: 'hidden' }}>
                      {activeReminders.length === 0
                        ? <div style={{ padding: '1.5rem', textAlign: 'center', color: '#4b5563', fontSize: '0.82rem' }}>✅ All reminders dismissed</div>
                        : activeReminders.map(r => {
                          const t = timeUntil(r.dueDate);
                          return (
                            <div key={r.id} className="dash-reminder-row">
                              <div className="dash-reminder-icon" style={{ background: t.urgent ? 'rgba(239,68,68,0.12)' : 'rgba(33,150,243,0.1)' }}>
                                {REMINDER_ICONS[r.type] || '📌'}
                              </div>
                              <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, color: '#e5e7eb', fontSize: '0.82rem', fontWeight: 600 }}>{r.type}</p>
                                <p style={{ margin: '2px 0 0', color: t.urgent ? '#f87171' : '#6b7280', fontSize: '0.7rem', fontWeight: 600 }}>{t.label}</p>
                              </div>
                              <button type="button" className="dash-dismiss-btn" onClick={() => dismissReminder(r.id)}>✕</button>
                            </div>
                          );
                        })}
                    </div>

                    {/* Saved mechanics */}
                    {savedMechanics.length > 0 && (
                      <>
                        <p style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '1.5rem 0 0.75rem' }}>Saved Mechanics</p>
                        <div style={{ background: 'rgba(17,24,39,0.6)', border: '1px solid rgba(55,65,81,0.4)', borderRadius: 12, overflow: 'hidden' }}>
                          {savedMechanics.slice(0, 3).map(m => (
                            <div key={m.id} className="dash-mechanic-row">
                              <div className="dash-mechanic-avatar">{m.name[0]}</div>
                              <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, color: '#e5e7eb', fontSize: '0.82rem', fontWeight: 700 }}>{m.name}</p>
                                <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '0.7rem' }}>{m.specialty} · ⭐ {m.rating}</p>
                              </div>
                              <a href={`tel:${m.phone}`} style={{ color: '#22c55e', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 6, padding: '3px 8px' }}>📞 Call</a>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── VEHICLES ── */}
            {tab === 'vehicles' && (
              <motion.div key="vehicles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem 0.5rem' }}>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Registered Vehicles ({vehicles.length})
                  </p>
                  <button type="button" onClick={openAddVehicle}
                    style={{ background: 'rgba(33,150,243,0.12)', border: '1px solid rgba(33,150,243,0.3)', borderRadius: 8, color: '#2196F3', padding: '5px 12px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                    + Add Vehicle
                  </button>
                </div>
                <div className="dash-vehicle-grid">
                  {vehicles.map(v => (
                    <div key={v.id} className={`dash-vehicle-card ${v.isDefault ? 'default' : ''}`}>
                      {v.isDefault && <span className="dash-default-badge">⭐ Default</span>}
                      <div className="dash-vehicle-icon">🚗</div>
                      <p className="dash-vehicle-name">{v.nickname || `${v.year} ${v.make} ${v.model}`}</p>
                      <p className="dash-vehicle-sub">{v.year} {v.make} {v.model} {v.variant}</p>
                      <div className="dash-vehicle-chips">
                        {v.regNumber && <span className="dash-chip">📋 {v.regNumber}</span>}
                        <span className="dash-chip">⛽ {v.fuelType}</span>
                        <span className="dash-chip">⚙️ {v.transmission}</span>
                        {v.color && <span className="dash-chip">🎨 {v.color}</span>}
                        {v.odometer && <span className="dash-chip">🛣️ {v.odometer} km</span>}
                      </div>
                      {v.insuranceExpiry && (
                        <p style={{ margin: '0 0 8px', color: '#6b7280', fontSize: '0.7rem' }}>
                          🛡️ Insurance: {v.insuranceExpiry} &nbsp;|&nbsp; 📋 PUC: {v.pucExpiry || '—'}
                        </p>
                      )}
                      <div className="dash-vehicle-actions">
                        <button type="button" className="dash-veh-btn dash-veh-btn-edit" onClick={() => openEditVehicle(v)}>✏️ Edit</button>
                        {!v.isDefault && (
                          <button type="button" className="dash-veh-btn dash-veh-btn-default" onClick={() => setDefaultVehicle(v.id)}>⭐ Default</button>
                        )}
                        <button type="button" className="dash-veh-btn dash-veh-btn-del" onClick={() => deleteVehicle(v.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="dash-add-vehicle-btn" onClick={openAddVehicle}>
                    <span style={{ fontSize: '1.5rem' }}>➕</span>
                    <span>Add New Vehicle</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── HISTORY ── */}
            {tab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="dash-history-filters">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'pending', label: '⏳ Pending' },
                    { key: 'completed', label: '✅ Completed' },
                    { key: 'critical', label: '🔴 Critical' },
                    { key: 'high', label: '🟠 High' },
                    { key: 'medium', label: '🟡 Medium' },
                    { key: 'low', label: '🟢 Low' },
                  ].map(f => (
                    <button key={f.key} type="button"
                      className={`dash-filter-chip ${histFilter === f.key ? 'active' : ''}`}
                      onClick={() => setHistFilter(f.key)}>
                      {f.label}
                    </button>
                  ))}
                </div>
                {filteredHistory.length === 0
                  ? <div style={{ padding: '2rem', textAlign: 'center', color: '#4b5563', fontSize: '0.85rem' }}>No records match this filter.</div>
                  : filteredHistory.map(r => {
                    const veh = vehicles.find(v => v.id === r.vehicleId);
                    return (
                      <div key={r.id} className="dash-history-row" onClick={() => setShowDetailId(r.id)}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>{r.aiDiagnosis}</span>
                            <span className="dash-sev-badge" style={{ background: SEV_COLOR[r.severity]?.bg, color: SEV_COLOR[r.severity]?.color }}>
                              {SEV_COLOR[r.severity]?.label}
                            </span>
                          </div>
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.75rem' }}>
                            📅 {r.date} · 🚗 {veh ? `${veh.make} ${veh.model}` : 'Unknown vehicle'}
                            {r.mechanicName && ` · 🔧 ${r.mechanicName}`}
                          </p>
                          <p style={{ margin: 0, color: '#4b5563', fontSize: '0.72rem' }}>{r.issueDescription.slice(0, 80)}{r.issueDescription.length > 80 ? '…' : ''}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                          <span className="dash-status-badge" style={{ background: STATUS_COLOR[r.repairStatus]?.bg, color: STATUS_COLOR[r.repairStatus]?.color }}>
                            {STATUS_COLOR[r.repairStatus]?.label}
                          </span>
                          <span style={{ color: '#2196F3', fontWeight: 700, fontSize: '0.8rem' }}>{r.estimatedCost.local}</span>
                          <button type="button" onClick={e => { e.stopPropagation(); deleteDiagnosisRecord(r.id); }}
                            style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: '0.75rem', padding: 2 }}>🗑️</button>
                        </div>
                      </div>
                    );
                  })}
              </motion.div>
            )}

            {/* ── MECHANICS ── */}
            {tab === 'mechanics' && (
              <motion.div key="mechanics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ padding: '1rem 1.25rem 0.5rem' }}>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Saved Mechanics ({savedMechanics.length})
                  </p>
                </div>
                {savedMechanics.length === 0
                  ? <div style={{ padding: '2rem', textAlign: 'center', color: '#4b5563', fontSize: '0.85rem' }}>
                      No saved mechanics yet. Book a mechanic to save them here.
                    </div>
                  : savedMechanics.map(m => (
                    <div key={m.id} className="dash-mechanic-row">
                      <div className="dash-mechanic-avatar">{m.name[0]}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, color: '#fff', fontSize: '0.875rem', fontWeight: 700 }}>{m.name}</p>
                        <p style={{ margin: '3px 0 0', color: '#6b7280', fontSize: '0.75rem' }}>{m.specialty}</p>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                          <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>⭐ {m.rating}</span>
                          <span style={{ color: '#4b5563', fontSize: '0.72rem' }}>{m.phone}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <a href={`tel:${m.phone}`} style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, color: '#22c55e', padding: '5px 10px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>📞</a>
                        <button type="button" onClick={() => removeSavedMechanic(m.id)}
                          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, color: '#f87171', padding: '5px 10px', fontSize: '0.75rem', cursor: 'pointer' }}>🗑️</button>
                      </div>
                    </div>
                  ))}
              </motion.div>
            )}

            {/* ── SETTINGS ── */}
            {tab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="dash-settings-section">
                  <p className="dash-settings-title">Notifications</p>
                  {[
                    { key: 'notifications' as const, icon: '🔔', label: 'Push Notifications', desc: 'Booking reminders and alerts' },
                    { key: 'locationServices' as const, icon: '📍', label: 'Location Services', desc: 'Find nearby mechanics' },
                    { key: 'whatsappAlerts' as const, icon: '💬', label: 'WhatsApp Alerts', desc: 'Booking status on WhatsApp' },
                    { key: 'emailDigest' as const, icon: '📧', label: 'Email Digest', desc: 'Weekly service summary' },
                  ].map(s => (
                    <div key={s.key} className="dash-toggle-row">
                      <span className="dash-toggle-icon">{s.icon}</span>
                      <div className="dash-toggle-info">
                        <div className="dash-toggle-label">{s.label}</div>
                        <div className="dash-toggle-desc">{s.desc}</div>
                      </div>
                      <label className="dash-toggle">
                        <input type="checkbox"
                          checked={user?.preferences?.[s.key] ?? false}
                          onChange={e => updatePreferences({ [s.key]: e.target.checked })} />
                        <span className="dash-toggle-slider" />
                      </label>
                    </div>
                  ))}

                  <p className="dash-settings-title" style={{ marginTop: '1.5rem' }}>Account</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ padding: '1rem', background: 'rgba(31,41,55,0.4)', borderRadius: 12, border: '1px solid rgba(55,65,81,0.4)' }}>
                      <p style={{ margin: '0 0 4px', color: '#fff', fontWeight: 700, fontSize: '0.875rem' }}>{user?.fullName}</p>
                      <p style={{ margin: '0 0 2px', color: '#6b7280', fontSize: '0.78rem' }}>✉️ {user?.email}</p>
                      {user?.phone && <p style={{ margin: 0, color: '#6b7280', fontSize: '0.78rem' }}>📞 {user.phone}</p>}
                      {user?.city && <p style={{ margin: 0, color: '#6b7280', fontSize: '0.78rem' }}>📍 {user.city}</p>}
                      <p style={{ margin: '6px 0 0', color: '#4b5563', fontSize: '0.72rem' }}>Member since {user?.createdAt ? formatDate(user.createdAt) : '—'}</p>
                    </div>
                    <button type="button" onClick={() => { setProfileForm({ fullName: user?.fullName || '', email: user?.email || '', phone: user?.phone || '', city: user?.city || '' }); setShowProfileModal(true); }}
                      style={{ background: 'rgba(33,150,243,0.1)', border: '1px solid rgba(33,150,243,0.3)', borderRadius: 10, color: '#2196F3', padding: '0.65rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
                      ✏️ Edit Profile
                    </button>
                  </div>

                  <p className="dash-settings-title" style={{ marginTop: '1.5rem' }}>Danger Zone</p>
                  <div className="dash-danger-zone">
                    <button type="button" className="dash-danger-btn dash-danger-outline">🔒 Change Password</button>
                    <button type="button" className="dash-danger-btn dash-danger-red" onClick={signOut}>🚪 Sign Out</button>
                    <button type="button" className="dash-danger-btn dash-danger-red">🗑️ Delete Account</button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>{/* end dash-card */}
      </div>{/* end dash-body */}

      {/* ── VEHICLE MODAL ── */}
      <AnimatePresence>
        {showVehicleModal && (
          <motion.div className="dash-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowVehicleModal(false)}>
            <motion.div className="dash-modal" initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <button type="button" className="dash-modal-close" onClick={() => setShowVehicleModal(false)}>✕</button>
              <p className="dash-modal-title">🚗 {editVehicleId ? 'Edit Vehicle' : 'Add New Vehicle'}</p>
              <div className="dash-modal-grid">
                {[
                  { label: 'Nickname', key: 'nickname', placeholder: 'My Car' },
                  { label: 'Make *', key: 'make', placeholder: 'Toyota' },
                  { label: 'Model *', key: 'model', placeholder: 'Camry' },
                  { label: 'Variant', key: 'variant', placeholder: 'XLE' },
                  { label: 'Year *', key: 'year', placeholder: '2020' },
                  { label: 'Reg. Number', key: 'regNumber', placeholder: 'DL 01 AB 1234' },
                  { label: 'Engine Type', key: 'engineType', placeholder: '2.5L 4-Cyl' },
                  { label: 'Color', key: 'color', placeholder: 'Silver' },
                  { label: 'Odometer (km)', key: 'odometer', placeholder: '45000' },
                  { label: 'VIN / Chassis', key: 'vin', placeholder: 'Optional' },
                  { label: 'Insurance Expiry', key: 'insuranceExpiry', placeholder: 'YYYY-MM-DD' },
                  { label: 'PUC Expiry', key: 'pucExpiry', placeholder: 'YYYY-MM-DD' },
                  { label: 'Last Service', key: 'lastServiceDate', placeholder: 'YYYY-MM-DD' },
                  { label: 'Next Service', key: 'nextServiceDate', placeholder: 'YYYY-MM-DD' },
                ].map(f => (
                  <div key={f.key} className="dash-modal-field">
                    <label className="dash-modal-label">{f.label}</label>
                    <input type="text" className="dash-modal-input" placeholder={f.placeholder}
                      value={(vehicleForm as Record<string, string>)[f.key] || ''}
                      onChange={e => setVehicleForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
                <div className="dash-modal-field">
                  <label className="dash-modal-label">Fuel Type</label>
                  <select className="dash-modal-input" value={vehicleForm.fuelType || 'Petrol'}
                    onChange={e => setVehicleForm(p => ({ ...p, fuelType: e.target.value as Vehicle['fuelType'] }))}>
                    {['Petrol','Diesel','CNG','Electric','Hybrid'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className="dash-modal-field">
                  <label className="dash-modal-label">Transmission</label>
                  <select className="dash-modal-input" value={vehicleForm.transmission || 'Manual'}
                    onChange={e => setVehicleForm(p => ({ ...p, transmission: e.target.value as Vehicle['transmission'] }))}>
                    {['Manual','Automatic','CVT','AMT'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="dash-modal-actions">
                <button type="button" className="dash-modal-save" onClick={saveVehicle}>
                  {editVehicleId ? 'Save Changes' : 'Add Vehicle'}
                </button>
                <button type="button" className="dash-modal-cancel" onClick={() => setShowVehicleModal(false)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PROFILE MODAL ── */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div className="dash-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}>
            <motion.div className="dash-modal" initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <button type="button" className="dash-modal-close" onClick={() => setShowProfileModal(false)}>✕</button>
              <p className="dash-modal-title">✏️ Edit Profile</p>
              <div className="dash-photo-upload">
                <div className="dash-photo-ring" onClick={() => photoRef.current?.click()}>
                  {user?.profileImage
                    ? <img src={user.profileImage} alt="avatar" />
                    : <span>{initials}</span>}
                  <div className="dash-photo-overlay">📷</div>
                </div>
                <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Click to change photo</span>
                <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
              </div>
              <div className="dash-modal-grid">
                {[
                  { label: 'Full Name', key: 'fullName' },
                  { label: 'Phone', key: 'phone' },
                  { label: 'Email', key: 'email' },
                  { label: 'City', key: 'city' },
                ].map(f => (
                  <div key={f.key} className="dash-modal-field">
                    <label className="dash-modal-label">{f.label}</label>
                    <input type="text" className="dash-modal-input"
                      value={(profileForm as Record<string, string>)[f.key] || ''}
                      onChange={e => setProfileForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div className="dash-modal-actions">
                <button type="button" className="dash-modal-save" onClick={saveProfile}>Save Changes</button>
                <button type="button" className="dash-modal-cancel" onClick={() => setShowProfileModal(false)}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DIAGNOSIS DETAIL MODAL ── */}
      <AnimatePresence>
        {detailRecord && (
          <motion.div className="dash-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowDetailId(null)}>
            <motion.div className="dash-modal" style={{ width: 'min(600px, 100%)' }}
              initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <button type="button" className="dash-modal-close" onClick={() => setShowDetailId(null)}>✕</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                <span className="dash-sev-badge" style={{ background: SEV_COLOR[detailRecord.severity]?.bg, color: SEV_COLOR[detailRecord.severity]?.color, padding: '4px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700 }}>
                  {SEV_COLOR[detailRecord.severity]?.label}
                </span>
                <p style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>{detailRecord.aiDiagnosis}</p>
              </div>
              <div className="dash-detail-grid">
                {[
                  { label: 'Date', val: detailRecord.date },
                  { label: 'Confidence', val: `${detailRecord.confidenceScore}%` },
                  { label: 'Status', val: STATUS_COLOR[detailRecord.repairStatus]?.label },
                  { label: 'Mechanic', val: detailRecord.mechanicName || 'Not booked' },
                  { label: 'DIY Cost', val: detailRecord.estimatedCost.diy },
                  { label: 'Local Cost', val: detailRecord.estimatedCost.local },
                  { label: 'Authorized', val: detailRecord.estimatedCost.authorized },
                  { label: 'Booked', val: detailRecord.mechanicBooked ? '✅ Yes' : '❌ No' },
                ].map(d => (
                  <div key={d.label} className="dash-detail-cell">
                    <div className="dash-detail-label">{d.label}</div>
                    <div className="dash-detail-val">{d.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(31,41,55,0.4)', borderLeft: '3px solid #2196F3', borderRadius: '0 8px 8px 0', marginBottom: '1rem' }}>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.7rem', fontWeight: 700, marginBottom: 4 }}>ISSUE DESCRIPTION</p>
                <p style={{ margin: 0, color: '#e5e7eb', fontSize: '0.85rem', lineHeight: 1.6 }}>{detailRecord.issueDescription}</p>
              </div>
              {detailRecord.diySteps.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 8px', color: '#9ca3af', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>DIY Steps</p>
                  {detailRecord.diySteps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ background: '#2196F3', color: '#fff', borderRadius: 6, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                      <p style={{ margin: 0, color: '#e5e7eb', fontSize: '0.82rem', lineHeight: 1.5 }}>{step}</p>
                    </div>
                  ))}
                </div>
              )}
              {detailRecord.finalNotes && (
                <div style={{ padding: '0.75rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10 }}>
                  <p style={{ margin: '0 0 4px', color: '#22c55e', fontSize: '0.7rem', fontWeight: 700 }}>FINAL NOTES</p>
                  <p style={{ margin: 0, color: '#e5e7eb', fontSize: '0.82rem' }}>{detailRecord.finalNotes}</p>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                <button type="button" onClick={onBooking}
                  style={{ flex: 1, background: '#2196F3', border: 'none', borderRadius: 10, color: '#fff', padding: '0.65rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
                  🔧 Book Mechanic
                </button>
                <button type="button" onClick={() => setShowDetailId(null)}
                  style={{ padding: '0.65rem 1rem', background: 'rgba(55,65,81,0.5)', border: '1px solid rgba(55,65,81,0.7)', borderRadius: 10, color: '#9ca3af', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
