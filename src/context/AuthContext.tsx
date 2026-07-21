import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Vehicle {
  id: string;
  nickname: string;
  make: string;
  model: string;
  variant: string;
  year: string;
  regNumber: string;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic' | 'CVT' | 'AMT';
  engineType: string;
  color: string;
  odometer: string;
  vin: string;
  insuranceExpiry: string;
  pucExpiry: string;
  lastServiceDate: string;
  nextServiceDate: string;
  isDefault: boolean;
  createdAt: string;
}

export interface DiagnosisRecord {
  id: string;
  vehicleId: string;
  date: string;
  issueDescription: string;
  uploadedImages: string[];
  aiDiagnosis: string;
  confidenceScore: number;
  diySteps: string[];
  estimatedCost: { diy: string; local: string; authorized: string };
  severity: 'low' | 'medium' | 'high' | 'critical';
  mechanicBooked: boolean;
  mechanicName?: string;
  repairStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  finalNotes?: string;
  createdAt: string;
}

export interface SavedMechanic {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  phone: string;
}

export interface MaintenanceReminder {
  id: string;
  vehicleId: string;
  type: string;
  dueDate: string;
  isDismissed: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  preferences: {
    notifications: boolean;
    locationServices: boolean;
    whatsappAlerts: boolean;
    emailDigest: boolean;
    darkMode: boolean;
  };
}

export interface AuthState {
  user: UserProfile | null;
  vehicles: Vehicle[];
  diagnosisHistory: DiagnosisRecord[];
  savedMechanics: SavedMechanic[];
  reminders: MaintenanceReminder[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  signUp: (fullName: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (updates: Partial<UserProfile['preferences']>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  setDefaultVehicle: (id: string) => void;
  addDiagnosisRecord: (record: Omit<DiagnosisRecord, 'id' | 'createdAt'>) => void;
  updateDiagnosisRecord: (id: string, updates: Partial<DiagnosisRecord>) => void;
  deleteDiagnosisRecord: (id: string) => void;
  saveMechanic: (mechanic: Omit<SavedMechanic, 'id'>) => void;
  removeSavedMechanic: (id: string) => void;
  dismissReminder: (id: string) => void;
}

// ─── API helpers ──────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const TOKEN_KEY = 'farcarfix_token';

function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }
function setToken(t: string) { localStorage.setItem(TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ─── Normalize mongo doc → frontend shape ────────────────────────────────────
function normUser(u: Record<string, unknown>): UserProfile {
  return {
    id: String(u._id || u.id || ''),
    fullName: String(u.fullName || ''),
    email: String(u.email || ''),
    phone: String(u.phone || ''),
    city: String(u.city || ''),
    profileImage: String(u.profileImage || ''),
    createdAt: String(u.createdAt || new Date().toISOString()),
    updatedAt: String(u.updatedAt || new Date().toISOString()),
    preferences: (u.preferences as UserProfile['preferences']) || {
      notifications: true, locationServices: true,
      whatsappAlerts: false, emailDigest: true, darkMode: false,
    },
  };
}

function normVehicle(v: Record<string, unknown>): Vehicle {
  return {
    id: String(v._id || v.id || ''),
    nickname: String(v.nickname || ''),
    make: String(v.make || ''),
    model: String(v.model || ''),
    variant: String(v.variant || ''),
    year: String(v.year || ''),
    regNumber: String(v.regNumber || ''),
    fuelType: (v.fuelType as Vehicle['fuelType']) || 'Petrol',
    transmission: (v.transmission as Vehicle['transmission']) || 'Manual',
    engineType: String(v.engineType || ''),
    color: String(v.color || ''),
    odometer: String(v.odometer || ''),
    vin: String(v.vin || ''),
    insuranceExpiry: String(v.insuranceExpiry || ''),
    pucExpiry: String(v.pucExpiry || ''),
    lastServiceDate: String(v.lastServiceDate || ''),
    nextServiceDate: String(v.nextServiceDate || ''),
    isDefault: Boolean(v.isDefault),
    createdAt: String(v.createdAt || ''),
  };
}

function normDiag(d: Record<string, unknown>): DiagnosisRecord {
  return {
    id: String(d._id || d.id || ''),
    vehicleId: String(d.vehicleId || ''),
    date: String(d.date || ''),
    issueDescription: String(d.issueDescription || ''),
    uploadedImages: (d.uploadedImages as string[]) || [],
    aiDiagnosis: String(d.aiDiagnosis || ''),
    confidenceScore: Number(d.confidenceScore || 0),
    diySteps: (d.diySteps as string[]) || [],
    estimatedCost: (d.estimatedCost as DiagnosisRecord['estimatedCost']) || { diy: '', local: '', authorized: '' },
    severity: (d.severity as DiagnosisRecord['severity']) || 'low',
    mechanicBooked: Boolean(d.mechanicBooked),
    mechanicName: String(d.mechanicName || ''),
    repairStatus: (d.repairStatus as DiagnosisRecord['repairStatus']) || 'pending',
    finalNotes: String(d.finalNotes || ''),
    createdAt: String(d.createdAt || ''),
  };
}

function normMechanic(m: Record<string, unknown>): SavedMechanic {
  return {
    id: String(m._id || m.id || ''),
    name: String(m.name || ''),
    specialty: String(m.specialty || ''),
    rating: Number(m.rating || 0),
    phone: String(m.phone || ''),
  };
}

function normReminder(r: Record<string, unknown>): MaintenanceReminder {
  return {
    id: String(r._id || r.id || ''),
    vehicleId: String(r.vehicleId || ''),
    type: String(r.type || ''),
    dueDate: String(r.dueDate || ''),
    isDismissed: Boolean(r.isDismissed),
  };
}

// ─── Local storage fallback state (used when API is offline) ─────────────────
const LS_KEY = 'farcarfix_local_state';
function loadLocal(): Partial<AuthState> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
}
function saveLocal(s: Partial<AuthState>) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { /**/ }
}

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const local = loadLocal();
    return {
      user: (local.user as UserProfile) || null,
      vehicles: (local.vehicles as Vehicle[]) || [],
      diagnosisHistory: (local.diagnosisHistory as DiagnosisRecord[]) || [],
      savedMechanics: (local.savedMechanics as SavedMechanic[]) || [],
      reminders: (local.reminders as MaintenanceReminder[]) || [],
      isAuthenticated: Boolean(local.isAuthenticated && getToken()),
      isLoading: Boolean(local.isAuthenticated && getToken()),
    };
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    const { isLoading, ...toSave } = state;
    saveLocal(toSave);
  }, [state]);

  // Restore session from API on mount
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    apiFetch('/auth/me')
      .then(data => {
        setState({
          user: normUser(data.user),
          vehicles: (data.vehicles || []).map(normVehicle),
          diagnosisHistory: (data.diagnosisHistory || []).map(normDiag),
          savedMechanics: (data.savedMechanics || []).map(normMechanic),
          reminders: (data.reminders || []).map(normReminder),
          isAuthenticated: true,
          isLoading: false,
        });
      })
      .catch(() => {
        // API offline — keep local state if we have a user
        setState(prev => ({ ...prev, isLoading: false }));
      });
  }, []);

  // ── Auth ────────────────────────────────────────────────────────────────────

  const signUp = useCallback(async (fullName: string, email: string, phone: string, password: string) => {
    try {
      const data = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, phone, password }),
      });
      setToken(data.token);
      // fetch full data
      const full = await apiFetch('/auth/me');
      setState({
        user: normUser(full.user),
        vehicles: (full.vehicles || []).map(normVehicle),
        diagnosisHistory: (full.diagnosisHistory || []).map(normDiag),
        savedMechanics: (full.savedMechanics || []).map(normMechanic),
        reminders: (full.reminders || []).map(normReminder),
        isAuthenticated: true, isLoading: false,
      });
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Sign up failed.' };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const data = await apiFetch('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      const full = await apiFetch('/auth/me');
      setState({
        user: normUser(full.user),
        vehicles: (full.vehicles || []).map(normVehicle),
        diagnosisHistory: (full.diagnosisHistory || []).map(normDiag),
        savedMechanics: (full.savedMechanics || []).map(normMechanic),
        reminders: (full.reminders || []).map(normReminder),
        isAuthenticated: true, isLoading: false,
      });
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Sign in failed.' };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    // Simulate Google sign-in — replace with real OAuth in production
    const now = new Date().toISOString();
    const id = 'google_' + uid();
    const user: UserProfile = {
      id, fullName: 'Google User', email: 'user@gmail.com',
      phone: '', city: '', profileImage: '',
      createdAt: now, updatedAt: now,
      preferences: { notifications: true, locationServices: true, whatsappAlerts: false, emailDigest: true, darkMode: false },
    };
    setState(prev => ({ ...prev, user, isAuthenticated: true, isLoading: false }));
    return { success: true };
  }, []);

  const signOut = useCallback(() => {
    clearToken();
    localStorage.removeItem(LS_KEY);
    setState({ user: null, vehicles: [], diagnosisHistory: [], savedMechanics: [], reminders: [], isAuthenticated: false, isLoading: false });
  }, []);

  // ── Profile ─────────────────────────────────────────────────────────────────

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, ...updates, updatedAt: new Date().toISOString() };
      apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(updates) }).catch(() => {});
      return { ...prev, user: updated };
    });
  }, []);

  const updatePreferences = useCallback((updates: Partial<UserProfile['preferences']>) => {
    setState(prev => {
      if (!prev.user) return prev;
      const prefs = { ...prev.user.preferences, ...updates };
      apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify({ preferences: prefs }) }).catch(() => {});
      return { ...prev, user: { ...prev.user, preferences: prefs } };
    });
  }, []);

  // ── Vehicles ─────────────────────────────────────────────────────────────────

  const addVehicle = useCallback((vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const tempId = uid();
    const newV: Vehicle = { ...vehicle, id: tempId, createdAt: new Date().toISOString() };
    setState(prev => ({ ...prev, vehicles: [...prev.vehicles, newV] }));
    apiFetch('/vehicles', { method: 'POST', body: JSON.stringify(vehicle) })
      .then(saved => {
        setState(prev => ({
          ...prev,
          vehicles: prev.vehicles.map(v => v.id === tempId ? normVehicle(saved) : v),
        }));
      }).catch(() => {});
  }, []);

  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setState(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(v => v.id === id ? { ...v, ...updates } : v),
    }));
    apiFetch(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(updates) }).catch(() => {});
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    setState(prev => {
      const filtered = prev.vehicles.filter(v => v.id !== id);
      if (filtered.length > 0 && !filtered.some(v => v.isDefault)) filtered[0].isDefault = true;
      return { ...prev, vehicles: filtered };
    });
    apiFetch(`/vehicles/${id}`, { method: 'DELETE' }).catch(() => {});
  }, []);

  const setDefaultVehicle = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      vehicles: prev.vehicles.map(v => ({ ...v, isDefault: v.id === id })),
    }));
    apiFetch(`/vehicles/${id}/default`, { method: 'PUT' }).catch(() => {});
  }, []);

  // ── Diagnosis ─────────────────────────────────────────────────────────────────

  const addDiagnosisRecord = useCallback((record: Omit<DiagnosisRecord, 'id' | 'createdAt'>) => {
    const tempId = uid();
    const newR: DiagnosisRecord = { ...record, id: tempId, createdAt: new Date().toISOString() };
    setState(prev => ({ ...prev, diagnosisHistory: [newR, ...prev.diagnosisHistory] }));
    apiFetch('/diagnosis', { method: 'POST', body: JSON.stringify(record) })
      .then(saved => {
        setState(prev => ({
          ...prev,
          diagnosisHistory: prev.diagnosisHistory.map(r => r.id === tempId ? normDiag(saved) : r),
        }));
      }).catch(() => {});
  }, []);

  const updateDiagnosisRecord = useCallback((id: string, updates: Partial<DiagnosisRecord>) => {
    setState(prev => ({
      ...prev,
      diagnosisHistory: prev.diagnosisHistory.map(r => r.id === id ? { ...r, ...updates } : r),
    }));
    apiFetch(`/diagnosis/${id}`, { method: 'PUT', body: JSON.stringify(updates) }).catch(() => {});
  }, []);

  const deleteDiagnosisRecord = useCallback((id: string) => {
    setState(prev => ({ ...prev, diagnosisHistory: prev.diagnosisHistory.filter(r => r.id !== id) }));
    apiFetch(`/diagnosis/${id}`, { method: 'DELETE' }).catch(() => {});
  }, []);

  // ── Mechanics ─────────────────────────────────────────────────────────────────

  const saveMechanic = useCallback((mechanic: Omit<SavedMechanic, 'id'>) => {
    const tempId = uid();
    const newM: SavedMechanic = { ...mechanic, id: tempId };
    setState(prev => ({ ...prev, savedMechanics: [...prev.savedMechanics, newM] }));
    apiFetch('/mechanics', { method: 'POST', body: JSON.stringify(mechanic) })
      .then(saved => {
        setState(prev => ({
          ...prev,
          savedMechanics: prev.savedMechanics.map(m => m.id === tempId ? normMechanic(saved) : m),
        }));
      }).catch(() => {});
  }, []);

  const removeSavedMechanic = useCallback((id: string) => {
    setState(prev => ({ ...prev, savedMechanics: prev.savedMechanics.filter(m => m.id !== id) }));
    apiFetch(`/mechanics/${id}`, { method: 'DELETE' }).catch(() => {});
  }, []);

  // ── Reminders ─────────────────────────────────────────────────────────────────

  const dismissReminder = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, isDismissed: true } : r),
    }));
    apiFetch(`/reminders/${id}/dismiss`, { method: 'PUT' }).catch(() => {});
  }, []);

  // ── Value ─────────────────────────────────────────────────────────────────────

  const value: AuthContextValue = {
    ...state,
    signUp, signIn, signInWithGoogle, signOut,
    updateProfile, updatePreferences,
    addVehicle, updateVehicle, deleteVehicle, setDefaultVehicle,
    addDiagnosisRecord, updateDiagnosisRecord, deleteDiagnosisRecord,
    saveMechanic, removeSavedMechanic, dismissReminder,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
