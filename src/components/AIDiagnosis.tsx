import React, { useState, useEffect } from 'react';

interface DiagnosisResult {
  issue: string;
  confidence: number;
  actions: string[];
  tools: string[];
  warning: string;
}

function getDiagnosis(vehicle: string, symptom: string, when: string): DiagnosisResult {
  const s = symptom.toLowerCase();
  if (s.includes('noise') || s.includes('sound') || s.includes('knock')) {
    return {
      issue: 'Engine Knock / Bearing Wear',
      confidence: 87,
      actions: ['Check engine oil level and quality', 'Inspect spark plugs for wear', 'Listen for location of knock (top vs bottom)', 'Schedule professional engine inspection'],
      tools: ["Owner's manual", 'Oil dipstick', 'Flashlight'],
      warning: 'Continued driving with engine knock can cause severe damage. Seek professional help soon.',
    };
  }
  if (s.includes('brake') || s.includes('squeak') || s.includes('grind')) {
    return {
      issue: 'Brake Pad Wear / Rotor Damage',
      confidence: 92,
      actions: ['Inspect brake pads for thickness', 'Check brake fluid level', 'Look for scoring on rotors', 'Replace pads if under 3mm'],
      tools: ['Jack and jack stands', 'Lug wrench', 'Brake cleaner'],
      warning: 'Do not delay brake repairs. Compromised brakes are a safety hazard.',
    };
  }
  if (s.includes('light') || s.includes('warning') || s.includes('check engine')) {
    return {
      issue: 'Check Engine / Warning Light',
      confidence: 78,
      actions: ['Check battery terminals for corrosion', 'Try turning off engine, wait 30 seconds, restart', 'If light persists or is red, avoid driving', 'Use OBD-II scanner to read fault codes'],
      tools: ['OBD-II scanner', 'Multimeter'],
      warning: 'If light is red or flashing, stop driving immediately and contact a mechanic.',
    };
  }
  if (s.includes('vibrat') || s.includes('shake')) {
    return {
      issue: 'Wheel Imbalance / Suspension Issue',
      confidence: 83,
      actions: ['Check tire pressure on all wheels', 'Inspect tires for uneven wear', 'Check wheel lug nuts are tight', 'Have wheels balanced and aligned'],
      tools: ['Tire pressure gauge', 'Torque wrench'],
      warning: 'Severe vibration at high speed can indicate a dangerous wheel or suspension issue.',
    };
  }
  if (s.includes('overheat') || s.includes('temperature') || s.includes('steam')) {
    return {
      issue: 'Engine Overheating / Coolant Issue',
      confidence: 91,
      actions: ['Stop driving immediately if temperature is in red', 'Let engine cool before opening hood', 'Check coolant level when cool', 'Inspect for coolant leaks under car'],
      tools: ['Coolant', 'Funnel', 'Gloves'],
      warning: 'Never open radiator cap when engine is hot. Severe burns can result.',
    };
  }
  return {
    issue: 'General Vehicle Issue',
    confidence: 72,
    actions: ['Perform a visual inspection of the vehicle', 'Check all fluid levels', 'Review recent maintenance history', 'Consult a certified mechanic for diagnosis'],
    tools: ["Owner's manual", 'Flashlight', 'Basic tool kit'],
    warning: 'For accurate diagnosis, a professional inspection is recommended.',
  };
}

export default function AIDiagnosis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [vehicle, setVehicle] = useState('');
  const [symptom, setSymptom] = useState('');
  const [when, setWhen] = useState('While driving');

  useEffect(() => {
    const handler = () => {
      const data = sessionStorage.getItem('vehicleData');
      if (data) {
        const parsed = JSON.parse(data);
        setVehicle(`${parsed.year} ${parsed.carBrand} ${parsed.model}`);
        setSymptom(parsed.issue);
        sessionStorage.removeItem('vehicleData');
        setTimeout(() => runAnalysis(`${parsed.year} ${parsed.carBrand} ${parsed.model}`, parsed.issue, 'While driving'), 500);
      }
    };
    window.addEventListener('startDiagnosis', handler);
    return () => window.removeEventListener('startDiagnosis', handler);
  }, []);

  const runAnalysis = (v: string, s: string, w: string) => {
    if (!v || !s) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(getDiagnosis(v, s, w));
      setLoading(false);
    }, 2500);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    background: '#1f2937', border: '1px solid #374151', color: '#fff',
    outline: 'none', fontSize: '0.95rem',
  };

  return (
    <section id="diagnosis" style={{ position: 'relative', padding: '6rem 1rem', background: '#0a0a0a', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>
            AI-Powered <span style={{ color: '#0EA5E9' }}>Diagnosis</span>
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Our advanced AI analyzes your car's symptoms and provides instant solutions
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', alignItems: 'start', maxWidth: '960px', margin: '0 auto' }}>
          {/* Input panel */}
          <div style={{
            background: 'linear-gradient(135deg, #111827, #000)',
            borderRadius: '16px', padding: '2rem',
            border: '2px solid rgba(14,165,233,0.3)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          }}>
            <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Enter Vehicle Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px', color: '#9ca3af' }}>Vehicle Information</label>
                <input type="text" placeholder="2018 Toyota Camry" value={vehicle}
                  onChange={e => setVehicle(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#0EA5E9')}
                  onBlur={e => (e.target.style.borderColor = '#374151')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px', color: '#9ca3af' }}>Primary Symptom</label>
                <textarea placeholder="Describe the issue you're experiencing..." rows={4}
                  value={symptom} onChange={e => setSymptom(e.target.value)}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => (e.target.style.borderColor = '#0EA5E9')}
                  onBlur={e => (e.target.style.borderColor = '#374151')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '8px', color: '#9ca3af' }}>When does it occur?</label>
                <select value={when} onChange={e => setWhen(e.target.value)} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#0EA5E9')}
                  onBlur={e => (e.target.style.borderColor = '#374151')}>
                  <option>While driving</option>
                  <option>On startup</option>
                  <option>When braking</option>
                  <option>When accelerating</option>
                  <option>Constant</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => runAnalysis(vehicle, symptom, when)}
              disabled={loading || !vehicle || !symptom}
              style={{
                width: '100%', background: '#0EA5E9', color: '#fff',
                border: 'none', borderRadius: '12px', padding: '16px',
                fontSize: '1rem', fontWeight: 600, cursor: loading || !vehicle || !symptom ? 'not-allowed' : 'pointer',
                opacity: loading || !vehicle || !symptom ? 0.5 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s', boxShadow: '0 0 20px rgba(14,165,233,0.4)',
              }}
              onMouseEnter={e => { if (!loading && vehicle && symptom) e.currentTarget.style.background = '#0284c7'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0EA5E9'; }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              {loading ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          </div>

          {/* Result panel */}
          <div style={{
            background: 'linear-gradient(135deg, #111827, #000)',
            borderRadius: '16px', padding: '2rem',
            border: '2px solid rgba(14,165,233,0.3)',
            minHeight: '400px', position: 'relative', overflow: 'hidden',
          }}>
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '360px' }}>
                <div style={{
                  width: '80px', height: '80px', border: '4px solid rgba(14,165,233,0.3)',
                  borderTop: '4px solid #0EA5E9', borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
                <p style={{ color: '#0EA5E9', marginTop: '1.5rem', fontSize: '1rem' }}>AI Analysis in Progress...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {!loading && !result && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '360px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(14,165,233,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <svg width="40" height="40" fill="none" stroke="#0EA5E9" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <p style={{ color: '#6b7280' }}>Enter vehicle details and click "Analyze with AI" to get your diagnosis</p>
              </div>
            )}

            {!loading && result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '1rem', borderBottom: '1px solid #1f2937' }}>
                  <div style={{ padding: '12px', background: 'rgba(14,165,233,0.1)', borderRadius: '8px' }}>
                    <svg width="24" height="24" fill="none" stroke="#0EA5E9" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', margin: 0 }}>Diagnosis Complete</h4>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Confidence: {result.confidence}%</p>
                  </div>
                </div>

                <div style={{ background: 'rgba(31,41,55,0.5)', borderRadius: '8px', padding: '1rem' }}>
                  <p style={{ color: '#fff', marginBottom: '4px', fontWeight: 600 }}>Likely Issue</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>{result.issue}</p>
                </div>

                <div style={{ background: 'rgba(31,41,55,0.5)', borderRadius: '8px', padding: '1rem' }}>
                  <p style={{ color: '#fff', marginBottom: '8px', fontWeight: 600 }}>Recommended Actions:</p>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {result.actions.map((a, i) => (
                      <li key={i} style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '4px' }}>{a}</li>
                    ))}
                  </ul>
                </div>

                {result.warning && (
                  <div style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: '8px', padding: '1rem' }}>
                    <p style={{ color: '#eab308', fontSize: '0.875rem', margin: 0 }}>⚠️ {result.warning}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
