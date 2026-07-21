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
import BookingPage from './components/BookingPage';
import UserProfilePage from './components/UserProfilePage';
import EmergencyBanner from './components/EmergencyBanner';
import './index.css';
import './features.css';

export interface VehicleData {
  carBrand: string;
  model: string;
  year: string;
  issue: string;
}

type Page = 'home' | 'booking' | 'profile';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [diagnosisData, setDiagnosisData] = useState<VehicleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDiagnosis = (data: VehicleData) => {
    setIsLoading(true);
    setTimeout(() => {
      setDiagnosisData(data);
      setIsLoading(false);
    }, 1500);
  };

  if (page === 'booking') {
    return <BookingPage onBack={() => setPage('home')} />;
  }

  if (page === 'profile') {
    return <UserProfilePage onBack={() => setPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <EmergencyBanner />
      <Navbar onBooking={() => setPage('booking')} onProfile={() => setPage('profile')} />
      <Hero onBooking={() => setPage('booking')} />
      <Features />
      <HowItWorks />
      <WhyChoose />
      <Stats />
      <Testimonials />
      <DiagnosisForm onStartDiagnosis={handleStartDiagnosis} />
      {(diagnosisData || isLoading) && (
        <DiagnosisResult data={diagnosisData} isLoading={isLoading} />
      )}
      <MechanicFinder onBooking={() => setPage('booking')} />
      <FinalCTA onBooking={() => setPage('booking')} />
      <Footer onBooking={() => setPage('booking')} onProfile={() => setPage('profile')} />
    </div>
  );
}

export default App;
