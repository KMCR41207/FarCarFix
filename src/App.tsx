import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DiagnosisResult from './components/DiagnosisResult';
import MechanicFinder from './components/MechanicFinder';
import Features from './components/Features';
import Footer from './components/Footer';
import './index.css';

export interface VehicleData {
  carBrand: string;
  model: string;
  year: string;
  issue: string;
}

function App() {
  const [diagnosisData, setDiagnosisData] = useState<VehicleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDiagnosis = (data: VehicleData) => {
    setIsLoading(true);
    // 1-2 second artificial delay for animation
    setTimeout(() => {
      setDiagnosisData(data);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero onStartDiagnosis={handleStartDiagnosis} />
      {(diagnosisData || isLoading) && (
        <DiagnosisResult data={diagnosisData} isLoading={isLoading} />
      )}
      <MechanicFinder />
      <Features />
      <Footer />
    </div>
  );
}

export default App;
