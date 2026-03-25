import React, { useState, useEffect } from 'react';
import { VehicleData } from '../App';

interface Props {
  data: VehicleData;
}

interface Result {
  issue: string;
  confidence: number;
  actions: string[];
  warning: string;
}

function analyze(data: VehicleData): Result {
  const s = (data.issue + ' ' + data.carBrand + ' ' + data.model).toLowerCase();

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
  if (s.includes('brake') || s.includes('squeak') || s.includes('grind') || s.includes('stop')) {
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
  if (s.includes('vibrat') || s.includes('shake') || s.includes('wobble')) {
    return {
      issue: 'Wheel Imbalance / Suspension Issue',
      confidence: 83,
      actions: [
        'Check tire pressure on all four wheels',
        'Inspect tires for uneven wear patterns',
        'Verify wheel lug nuts are properly torqued',
        'Have wheels balanced and alignment checked',
      ],
      warning: 'Severe vibration at high speed can indicate a dangerous wheel or suspension failure.',
    };
  }
  if (s.includes('overheat') || s.includes('temperature') || s.includes('steam') || s.includes('hot')) {
    return {
      issue: 'Engine Overheating / Coolant Issue',
      confidence: 91,
      actions: [
        'Stop driving immediately if temperature gauge is in red',
        'Let engine cool completely before opening hood',
        'Check co