import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import EmergencyBanner from './components/EmergencyBanner';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import './index.css';
import './features.css';
import './auth.css';

export interface VehicleData {
  carBrand: string;
  model: string;
  year: string;
  issue: string;
}

type Page = 'home' | 'booking' | 'profile' | 'auth';

function AppInner() {
  const { isAuthenticated } = useAuth();
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

  const goProfile = () => {
    if (isAuthenticated) setPage('profile');
    else setPage('auth');
  };

  if (page === 'auth') {
    return (
      <AuthPage
        onSuccess={() => setPage('profile')}
        onBack={() => setPage('home')}
      />
    );
  }

  if (page === 'booking') {
    return <BookingPage onBack={() => setPage('home')} />;
  }

  if (page === 'profile') {
    if (!isAuthenticated) {
      return (
        <AuthPage
          onSuccess={() => setPage('profile')}
          onBack={() => setPage('home')}
        />
      );
    }
    return (
      <Dashboard
        onBack={() => setPage('home')}
        onNewDiagnosis={() => { setPage('home'); setTimeout(() => document.getElementById('diagnosis')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
        onBooking={() => setPage('booking')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <EmergencyBanner />
      <Navbar
        onBooking={() => setPage('booking')}
        onProfile={goProfile}
        isAuthenticated={isAuthenticated}
      />
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
      <Footer
        onBooking={() => setPage('booking')}
        onProfile={goProfile}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
