import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import WhyChoose from './components/WhyChoose';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import DiagnosisForm from './components/DiagnosisForm';
import DiagnosisResult from './components/DiagnosisResult';
import MechanicFinder from './components/MechanicFinder';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import './index.css';
import './features.css';

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
    setTimeout(() => {
      setDiagnosisData(data);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <WhyChoose />
      <Stats />
      <Testimonials />
      <DiagnosisForm onStartDiagnosis={handleStartDiagnosis} />
      {(diagnosisData || isLoading) && (
        <DiagnosisResult data={diagnosisData} isLoading={isLoading} />
      )}
      <MechanicFinder />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default App;
