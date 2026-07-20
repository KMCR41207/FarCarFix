import React, { useState } from 'react';
import { VehicleData } from '../App';
import Autocomplete from './Autocomplete';
import { carBrands, carModels, years, issues } from '../data/vehicleData';

interface DiagnosisFormProps {
  onStartDiagnosis: (data: VehicleData) => void;
}

export default function DiagnosisForm({ onStartDiagnosis }: DiagnosisFormProps) {
  const [carBrand, setCarBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [issue, setIssue] = useState('');
  const [error, setError] = useState('');

  const availableModels = carBrand && carModels[carBrand]
    ? carModels[carBrand]
    : Object.values(carModels).flat();

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!carBrand || !model || !year || !issue) {
      setError('Please fill in all fields before starting diagnosis.');
      return;
    }
    setError('');
    onStartDiagnosis({ carBrand, model, year, issue });
    setTimeout(() => {
      const el = document.getElementById('diagnosis-result');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section id="diagnosis" className="diagnosis-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">AI Diagnosis</span>
          <h2>Start Your Free Diagnosis</h2>
          <p>
            Enter your vehicle details and symptoms. Our AI will analyze the issue
            and provide actionable repair guidance in seconds.
          </p>
        </div>

        <form className="diagnosis-form-card" onSubmit={handleSubmit} noValidate>
          <div className="diagnosis-form-grid">
            <Autocomplete
              label="Car Brand"
              placeholder="e.g., Toyota"
              value={carBrand}
              onChange={setCarBrand}
              suggestions={carBrands}
            />
            <Autocomplete
              label="Model"
              placeholder="e.g., Camry"
              value={model}
              onChange={setModel}
              suggestions={availableModels}
            />
            <Autocomplete
              label="Year"
              placeholder="e.g., 2018"
              value={year}
              onChange={setYear}
              suggestions={years}
            />
            <Autocomplete
              label="Issue"
              placeholder="e.g., Engine noise"
              value={issue}
              onChange={setIssue}
              suggestions={issues}
            />
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" className="btn-primary btn-large" style={{ width: '100%' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            Start Diagnosis
          </button>
        </form>
      </div>
    </section>
  );
}
