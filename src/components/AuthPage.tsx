import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import '../auth.css';

interface Props { onSuccess: () => void; onBack: () => void; }
type Mode = 'login' | 'signup' | 'forgot';

export default function AuthPage({ onSuccess, onBack }: Props) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');

  const clear = () => { setError(''); setSuccess(''); };

  function strength(p: string) {
    if (!p) return { label: '', color: 'transparent', w: '0%' };
    if (p.length < 6) return { label: 'Weak', color: '#ef4444', w: '25%' };
    if (p.length < 10 || !/\d/.test(p)) return { label: 'Fair', color: '#f59e0b', w: '55%' };
    if (!/[^a-zA-Z0-9]/.test(p)) return { label: 'Good', color: '#22c55e', w: '80%' };
    return { label: 'Strong', color: '#2196F3', w: '100%' };
  }
  const str = strength(pass);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault(); clear();
    if (!loginEmail || !loginPass) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const r = await signIn(loginEmail.trim(), loginPass);
    setLoading(false);
    if (r.success) onSuccess(); else setError(r.error || 'Sign in failed.');
  }

  async function onSignup(e: React.FormEvent) {
    e.preventDefault(); clear();
    if (!name || !email || !pass) { setError('Please fill in all required fields.'); return; }
    if (pass !== confirm) { setError('Passwords do not match.'); return; }
    if (pass.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!agreed) { setError('Please accept the Terms of Service.'); return; }
    setLoading(true);
    const r = await signUp(name.trim(), email.trim(), phone.trim(), pass);
    setLoading(false);
    if (r.success) onSuccess(); else setError(r.error || 'Sign up failed.');
  }

  async function onGoogle() {
    clear(); setLoading(true);
    const r = await signInWithGoogle();
    setLoading(false);
    if (r.success) onSuccess(); else setError('Google sign-in failed.');
  }

  function onForgot(e: React.FormEvent) {
    e.preventDefault(); clear();
    if (!forgotEmail) { setError('Enter your email address.'); return; }
    setSuccess(`Password reset link sent to ${forgotEmail}. Check your inbox.`);
  }

  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div className="auth-page">
      <div className="auth-bg-glow" />
      <div className="auth-bg-grid" />
      <button type="button" className="auth-back-btn" onClick={onBack}>← Back to Home</button>

      <motion.div className="auth-container" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">🔧</div>
          <div>
            <p className="auth-logo-name">Far Car <span>Fix</span></p>
            <p className="auth-logo-tagline">AI Roadside Assistant</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
              <h2 className="auth-title">Welcome back</h2>
              <p className="auth-subtitle">Sign in to access your dashboard</p>
              {error && <div className="auth-error" role="alert">⚠️ {error}</div>}
              <button type="button" className="auth-google-btn" onClick={onGoogle} disabled={loading}>
                <GoogleIcon /> Continue with Google
              </button>
              <div className="auth-divider"><span>or sign in with email</span></div>
              <form onSubmit={onLogin} noValidate>
                <div className="auth-field">
                  <label className="auth-label">Email Address</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">✉️</span>
                    <input type="email" className="auth-input" placeholder="you@example.com"
                      value={loginEmail} onChange={e => setLoginEmail(e.target.value)} autoComplete="email" required />
                  </div>
                </div>
                <div className="auth-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label className="auth-label">Password</label>
                    <button type="button" className="auth-link-btn" style={{ fontSize: '0.72rem' }}
                      onClick={() => { clear(); setMode('forgot'); }}>Forgot password?</button>
                  </div>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">🔒</span>
                    <input type={showPass ? 'text' : 'password'} className="auth-input" placeholder="••••••••"
                      value={loginPass} onChange={e => setLoginPass(e.target.value)} autoComplete="current-password" required />
                    <button type="button" className="auth-eye-btn" onClick={() => setShowPass(p => !p)}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading && <span className="auth-spinner" />}
                  {loading ? 'Signing in…' : 'Sign In →'}
                </button>
              </form>
              <p className="auth-switch">Don't have an account?{' '}
                <button type="button" className="auth-link-btn" onClick={() => { clear(); setMode('signup'); }}>Create account</button>
              </p>
            </motion.div>
          )}

          {mode === 'signup' && (
            <motion.div key="signup" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <h2 className="auth-title">Create account</h2>
              <p className="auth-subtitle">Join thousands of drivers using FarCarFix</p>
              {error && <div className="auth-error" role="alert">⚠️ {error}</div>}
              <button type="button" className="auth-google-btn" onClick={onGoogle} disabled={loading}>
                <GoogleIcon /> Sign up with Google
              </button>
              <div className="auth-divider"><span>or create with email</span></div>
              <form onSubmit={onSignup} noValidate>
                <div className="auth-form-grid">
                  <div className="auth-field">
                    <label className="auth-label">Full Name *</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">👤</span>
                      <input type="text" className="auth-input" placeholder="Rahul Sharma"
                        value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Phone</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">📞</span>
                      <input type="tel" className="auth-input" placeholder="+91 98765 43210"
                        value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label">Email Address *</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">✉️</span>
                    <input type="email" className="auth-input" placeholder="you@example.com"
                      value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="auth-form-grid">
                  <div className="auth-field">
                    <label className="auth-label">Password *</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">🔒</span>
                      <input type={showPass ? 'text' : 'password'} className="auth-input" placeholder="Min. 8 chars"
                        value={pass} onChange={e => setPass(e.target.value)} required />
                      <button type="button" className="auth-eye-btn" onClick={() => setShowPass(p => !p)}>
                        {showPass ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {pass && (
                      <div className="auth-strength-bar">
                        <div style={{ height: 3, background: 'rgba(55,65,81,0.6)', borderRadius: 3, overflow: 'hidden', marginTop: 5 }}>
                          <div style={{ width: str.w, height: '100%', background: str.color, transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ color: str.color, fontSize: '0.7rem', fontWeight: 700 }}>{str.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Confirm Password *</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">🔒</span>
                      <input type={showPass ? 'text' : 'password'} className="auth-input" placeholder="Repeat"
                        value={confirm} onChange={e => setConfirm(e.target.value)} required />
                    </div>
                    {confirm && pass !== confirm && (
                      <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: 3 }}>Passwords don't match</p>
                    )}
                  </div>
                </div>
                <label className="auth-checkbox-label" style={{ marginBottom: '1.1rem' }}>
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>
                <button type="submit" className="auth-submit-btn" disabled={loading || !agreed}>
                  {loading && <span className="auth-spinner" />}
                  {loading ? 'Creating account…' : 'Create Account →'}
                </button>
              </form>
              <p className="auth-switch">Already have an account?{' '}
                <button type="button" className="auth-link-btn" onClick={() => { clear(); setMode('login'); }}>Sign in</button>
              </p>
            </motion.div>
          )}

          {mode === 'forgot' && (
            <motion.div key="forgot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <button type="button" className="auth-link-btn"
                style={{ fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 4 }}
                onClick={() => { clear(); setMode('login'); }}>← Back to sign in</button>
              <h2 className="auth-title">Reset password</h2>
              <p className="auth-subtitle">Enter your email and we'll send a reset link.</p>
              {error && <div className="auth-error" role="alert">⚠️ {error}</div>}
              {success && <div className="auth-success" role="status">✅ {success}</div>}
              {!success && (
                <form onSubmit={onForgot} noValidate>
                  <div className="auth-field">
                    <label className="auth-label">Email Address</label>
                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">✉️</span>
                      <input type="email" className="auth-input" placeholder="you@example.com"
                        value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                    </div>
                  </div>
                  <button type="submit" className="auth-submit-btn">Send Reset Link</button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="auth-trust">
          <span>🔒 256-bit SSL</span><span>•</span>
          <span>🛡️ Secure</span><span>•</span>
          <span>✅ 50K+ Users</span>
        </div>
      </motion.div>
    </div>
  );
}
