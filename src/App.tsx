import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { AIDiagnosis } from "./components/AIDiagnosis";
import { MechanicDispatch } from "./components/MechanicDispatch";
import { About } from "./components/About";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <AIDiagnosis />
      <MechanicDispatch />
      <About />
      <Footer />
    </div>
  );
}
