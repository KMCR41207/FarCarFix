import React, { useState } from 'react';
import { VehicleData } from '../App';
import GlyphMatrix from './GlyphMatrix';
import RepairCostEstimator from './RepairCostEstimator';
import NearbyServices from './NearbyServices';
import RepairReport from './RepairReport';

interface Props {
  data: VehicleData | null;
  isLoading?: boolean;
}

interface Result {
  issue: string;
  confidence: number;
  actions: string[];
  warning: string;
}

function analyze(data: VehicleData): Result {
  const s = (data.issue + ' ' + data.carBrand + ' ' + data.model).toLowerCase();

  // ── Engine issues ──
  if (s.includes('noise') || s.includes('knock') || s.includes('sound') || s.includes('rattle')) {
    return {
      issue: 'Engine Knock / Bearing Wear',
      confidence: 87,
      actions: [
        'Check engine oil level and quality',
        'Inspect spark plugs for wear',
        'Listen for location of knock (top vs bottom)',
        'Schedule professional engine inspection',
      ],
      warning: 'Continued driving with engine knock can cause severe damage. Seek professional help soon.',
    };
  }
  if (s.includes('oil leak') || s.includes('oil light') || s.includes('low oil')) {
    return {
      issue: 'Engine Oil Leak / Low Oil Pressure',
      confidence: 89,
      actions: [
        'Check oil level using the dipstick immediately',
        'Look under the car for dark oily puddles',
        'Inspect the oil pan gasket and drain plug',
        'Top up oil if low; do not drive if critically low',
        'Visit a mechanic to identify the leak source',
      ],
      warning: 'Running an engine with low oil causes irreversible damage within minutes. Stop driving immediately.',
    };
  }
  if (s.includes('smoke') || s.includes('burning') || s.includes('exhaust')) {
    return {
      issue: 'Smoke / Exhaust Emission Problem',
      confidence: 85,
      actions: [
        'Note the smoke colour: white = coolant leak, blue = burning oil, black = rich fuel mixture',
        'Check coolant and oil levels',
        'Inspect the exhaust pipe for cracks or loose joints',
        'Have the catalytic converter and O2 sensor tested',
      ],
      warning: 'Blue or white smoke can indicate serious internal engine damage. Do not ignore it.',
    };
  }
  if (s.includes('stall') || s.includes('cut out') || s.includes('dies') || s.includes('cutting off')) {
    return {
      issue: 'Engine Stalling / Random Cut-Off',
      confidence: 82,
      actions: [
        'Check fuel level — refuel if low',
        'Inspect the idle air control (IAC) valve for blockage',
        'Test the mass airflow (MAF) sensor',
        'Check for vacuum leaks in the intake manifold',
        'Scan for fault codes with an OBD-II reader',
      ],
      warning: 'Stalling at speed is dangerous. Avoid highways until the issue is resolved.',
    };
  }

  // ── Brakes ──
  if (s.includes('brake') || s.includes('squeak') || s.includes('grind') || s.includes('stopping')) {
    return {
      issue: 'Brake Pad Wear / Rotor Damage',
      confidence: 92,
      actions: [
        'Inspect brake pads for thickness (replace if under 3mm)',
        'Check brake fluid level in reservoir',
        'Look for scoring or grooves on rotors',
        'Have brakes professionally inspected',
      ],
      warning: 'Do not delay brake repairs. Compromised brakes are a serious safety hazard.',
    };
  }
  if (s.includes('brake fluid') || s.includes('soft pedal') || s.includes('spongy')) {
    return {
      issue: 'Brake Fluid Leak / Air in Brake Lines',
      confidence: 90,
      actions: [
        'Check brake fluid reservoir level immediately',
        'Inspect all brake lines for wetness or corrosion',
        'Do not drive until brakes are firm',
        'Have a mechanic bleed the brake lines',
      ],
      warning: 'Soft or spongy brakes indicate brake failure risk. Do NOT drive this vehicle.',
    };
  }

  // ── Electrical ──
  if (s.includes('light') || s.includes('warning') || s.includes('check engine') || s.includes('dashboard')) {
    return {
      issue: 'Check Engine / Warning Light Active',
      confidence: 78,
      actions: [
        'Check battery terminals for corrosion',
        'Turn off engine, wait 30 seconds, restart',
        'Use an OBD-II scanner to read fault codes',
        'If light is red or flashing, stop driving immediately',
      ],
      warning: 'A red or flashing warning light means stop driving and contact a mechanic immediately.',
    };
  }
  if (s.includes('battery') || s.includes('dead') || s.includes('not start') || s.includes('won\'t start')) {
    return {
      issue: 'Battery / Starting System Failure',
      confidence: 88,
      actions: [
        'Try jump-starting with cables from another vehicle',
        'Check battery terminals for corrosion — clean with baking soda',
        'Test alternator output voltage (should be 13.8–14.4V)',
        'Replace battery if over 3 years old',
      ],
      warning: 'A failed battery can leave you stranded. Carry jump cables or call roadside assistance.',
    };
  }
  if (s.includes('electrical') || s.includes('short') || s.includes('fuse') || s.includes('wiring')) {
    return {
      issue: 'Electrical Short / Fuse Failure',
      confidence: 76,
      actions: [
        'Locate the fuse box (usually under the dashboard or bonnet)',
        'Inspect all fuses visually for burn marks',
        'Replace blown fuses with same-amperage fuses only',
        'If fuses keep blowing, have wiring professionally diagnosed',
      ],
      warning: 'Electrical shorts can cause fires. If you smell burning plastic, exit the vehicle immediately.',
    };
  }
  if (s.includes('alternator') || s.includes('charging') || s.includes('battery light')) {
    return {
      issue: 'Alternator Failure / Charging System Fault',
      confidence: 86,
      actions: [
        'Check the alternator belt for cracks, fraying or slippage',
        'Test battery voltage with engine running — should be above 13.5V',
        'Inspect alternator terminals and connections for corrosion',
        'Replace alternator belt if worn',
        'Have alternator tested at a garage',
      ],
      warning: 'A failing alternator will drain the battery and cause the car to stop. Do not drive long distances.',
    };
  }

  // ── Tyres & Suspension ──
  if (s.includes('vibrat') || s.includes('shake') || s.includes('wobble')) {
    return {
      issue: 'Wheel Imbalance / Suspension Issue',
      confidence: 83,
      actions: [
        'Check tyre pressure on all four wheels',
        'Inspect tyres for uneven wear patterns',
        'Verify wheel lug nuts are properly torqued',
        'Have wheels balanced and alignment checked',
      ],
      warning: 'Severe vibration at high speed can indicate a dangerous wheel or suspension failure.',
    };
  }
  if (s.includes('flat') || s.includes('puncture') || s.includes('tyre') || s.includes('tire')) {
    return {
      issue: 'Flat Tyre / Puncture',
      confidence: 95,
      actions: [
        'Pull over safely and switch on hazard lights',
        'Retrieve the spare tyre and jack from the boot',
        'Loosen lug nuts before jacking up the car',
        'Replace with spare and drive to a tyre shop at low speed',
        'Do not exceed 80 km/h on a spare tyre',
      ],
      warning: 'Driving on a flat tyre damages the rim and is dangerous. Stop immediately.',
    };
  }
  if (s.includes('suspension') || s.includes('bumpy') || s.includes('rough ride') || s.includes('clunk')) {
    return {
      issue: 'Suspension / Shock Absorber Failure',
      confidence: 81,
      actions: [
        'Check for clunking sounds over bumps',
        'Push down on each corner of the car — it should bounce once only',
        'Inspect shock absorbers for oil leaks',
        'Have tie rods, ball joints and bushings checked',
      ],
      warning: 'Worn suspension reduces braking ability and vehicle control. Get it checked promptly.',
    };
  }
  if (s.includes('steering') || s.includes('pull') || s.includes('drift') || s.includes('alignment')) {
    return {
      issue: 'Steering / Wheel Alignment Issue',
      confidence: 84,
      actions: [
        'Check tyre pressures — uneven pressure causes pulling',
        'Inspect steering fluid level (for hydraulic steering)',
        'Look for uneven tyre wear indicating misalignment',
        'Have wheel alignment and tracking checked',
      ],
      warning: 'Pulling at high speed is dangerous. Have alignment corrected before driving on highways.',
    };
  }

  // ── Cooling & Fluids ──
  if (s.includes('overheat') || s.includes('temperature') || s.includes('steam') || s.includes('hot')) {
    return {
      issue: 'Engine Overheating / Coolant Issue',
      confidence: 91,
      actions: [
        'Stop driving immediately if temperature gauge is in red',
        'Let engine cool completely before opening hood',
        'Check coolant level and colour',
        'Inspect radiator for leaks or debris',
        'Have cooling system professionally inspected',
      ],
      warning: 'Engine overheating can cause catastrophic engine failure. Do not ignore temperature warnings.',
    };
  }
  if (s.includes('coolant') || s.includes('radiator') || s.includes('antifreeze')) {
    return {
      issue: 'Coolant Leak / Radiator Problem',
      confidence: 88,
      actions: [
        'Let engine cool, then check coolant reservoir level',
        'Inspect radiator hoses for cracks or looseness',
        'Look under the car for bright green or orange puddles',
        'Check radiator cap seal for damage',
        'Top up with correct coolant mix (50/50 with water)',
      ],
      warning: 'Loss of coolant leads to overheating and engine damage. Do not ignore leaks.',
    };
  }
  if (s.includes('transmission') || s.includes('gear') || s.includes('gearbox') || s.includes('slipping')) {
    return {
      issue: 'Transmission / Gearbox Problem',
      confidence: 80,
      actions: [
        'Check transmission fluid level and colour (should be red, not brown)',
        'Note if slipping occurs in specific gears',
        'Avoid aggressive acceleration until inspected',
        'Do not tow with a slipping transmission',
        'Have a specialist scan for transmission fault codes',
      ],
      warning: 'Transmission failure can leave you stranded. Seek professional diagnosis promptly.',
    };
  }
  if (s.includes('fuel') || s.includes('petrol') || s.includes('diesel') || s.includes('mileage') || s.includes('consumption')) {
    return {
      issue: 'Fuel System / Poor Fuel Economy',
      confidence: 77,
      actions: [
        'Check for fuel smell under the car indicating a leak',
        'Inspect fuel cap — ensure it seals tightly',
        'Check air filter — a clogged filter increases fuel use',
        'Test fuel injectors for blockage',
        'Monitor driving habits: idling and hard acceleration consume more fuel',
      ],
      warning: 'A fuel leak is a fire hazard. If you smell petrol strongly, do not start the engine.',
    };
  }

  // ── Air Conditioning ──
  if (s.includes('ac') || s.includes('air condition') || s.includes('cooling') || s.includes('not cold')) {
    return {
      issue: 'Air Conditioning Failure',
      confidence: 79,
      actions: [
        'Check if the AC compressor clutch engages when AC is switched on',
        'Inspect AC belt for wear or slippage',
        'Check refrigerant level — low gas is the most common cause',
        'Clean the cabin air filter',
        'Have AC system recharged at a garage',
      ],
      warning: 'In extreme heat, a broken AC can cause heat exhaustion. Keep windows open as a short-term fix.',
    };
  }

  // ── Default ──
  return {
    issue: 'General Vehicle Issue — Inspection Required',
    confidence: 55,
    actions: [
      'Take a detailed photo or video of the problem',
      'Note when the problem occurs (startup, acceleration, etc.)',
      'Check all fluid levels: oil, coolant, brake fluid, transmission',
      'Consult with a certified mechanic for a thorough diagnosis',
    ],
    warning: 'Unknown issues require professional inspection to prevent further damage.',
  };
}

export default function DiagnosisResult({ data, isLoading = false }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFeature, setActiveFeature] = useState<'cost' | 'nearby' | 'report' | null>(null);

  if (isLoading || !data) {
    return (
      <div id="diagnosis-result" className="diagnosis-result">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: '1.5rem',
        }}>
          <div style={{
            width: '100%',
            height: '300px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'rgba(14, 165, 233, 0.1)',
          }}>
            <GlyphMatrix
              glyphs="01.+*/\\<>="
              cellSize={14}
              mutationRate={0.04}
              interval={90}
              fadeBottom={0.6}
              color="var(--primary)"
            />
          </div>
          <div style={{
            textAlign: 'center',
            color: 'var(--primary)',
            fontSize: '1rem',
            fontWeight: 600,
          }}>
            AI Diagnosis in Progress...
          </div>
        </div>
      </div>
    );
  }

  const result = analyze(data);

  return (
    <div id="diagnosis-result" className="diagnosis-result">
      <div className="result-header">
        <h2>{result.issue}</h2>
        <div className="confidence-badge">
          Confidence: <strong>{result.confidence}%</strong>
        </div>
      </div>

      <div className="warning-box">{result.warning}</div>

      <div className="actions-section">
        <h3>Recommended Actions:</h3>
        <ol className="actions-list">
          {result.actions.map((action, index) => (
            <li key={index}>{action}</li>
          ))}
        </ol>
      </div>

      <button type="button" className="expand-btn" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Hide Details' : 'Show Details'}
      </button>

      {isExpanded && (
        <div className="details-section">
          <h3>Diagnostic Details:</h3>
          <p>
            <strong>Issue Reported:</strong> {data.issue}
          </p>
          <p>
            <strong>Vehicle:</strong> {data.carBrand} {data.model}
          </p>
          <p>
            <strong>Analysis:</strong> Based on your description, the most likely cause is {result.issue.toLowerCase()}.
          </p>
          <p className="detail-note">
            This is an AI-assisted diagnosis. For safety-critical issues, always consult with a professional mechanic.
          </p>
        </div>
      )}

      {/* ── Intelligent Feature Launcher ── */}
      <div className="feature-launcher">
        <p className="feature-launcher-title">What would you like to do next?</p>
        <div className="feature-launcher-grid">
          {[
            { key: 'cost' as const, emoji: '💰', label: 'AI Cost Estimator', desc: 'See DIY, garage & center pricing' },
            { key: 'nearby' as const, emoji: '📍', label: 'Nearby Services', desc: 'Find mechanics, fuel & towing' },
            { key: 'report' as const, emoji: '📄', label: 'Repair Report', desc: 'Download & share full report' },
          ].map(f => (
            <button
              key={f.key}
              type="button"
              className={`feature-launcher-btn ${activeFeature === f.key ? 'active' : ''}`}
              onClick={() => setActiveFeature(prev => prev === f.key ? null : f.key)}
              aria-pressed={activeFeature === f.key}
            >
              <span style={{ fontSize: '1.75rem' }}>{f.emoji}</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{f.label}</span>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.4 }}>{f.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Feature Panels ── */}
      {activeFeature === 'cost' && (
        <RepairCostEstimator
          issue={result.issue}
          confidence={result.confidence}
          carBrand={data.carBrand}
          model={data.model}
          year={data.year}
        />
      )}
      {activeFeature === 'nearby' && (
        <NearbyServices />
      )}
      {activeFeature === 'report' && (
        <RepairReport data={data} diagnosis={result} />
      )}
    </div>
  );
}
