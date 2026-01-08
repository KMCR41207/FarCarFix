import { motion, AnimatePresence } from "motion/react";
import { Search, Wrench, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export function Hero() {
  const [carBrand, setCarBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [issue, setIssue] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Your car images - using absolute paths for deployment
  const slides = [
    `${import.meta.env.BASE_URL}images/slide1.jpg`,
    `${import.meta.env.BASE_URL}images/slide2.jpg`,
    `${import.meta.env.BASE_URL}images/slide3.jpg`,
    `${import.meta.env.BASE_URL}images/slide4.jpg`,
  ];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleStartDiagnosis = () => {
    if (!carBrand || !model || !year || !issue) {
      alert("Please fill in all fields before starting diagnosis");
      return;
    }
    
    // Store data in sessionStorage to pass to AIDiagnosis component
    sessionStorage.setItem("vehicleData", JSON.stringify({
      carBrand,
      model,
      year,
      issue
    }));
    
    // Scroll to diagnosis section
    const diagnosisSection = document.getElementById("diagnosis");
    if (diagnosisSection) {
      diagnosisSection.scrollIntoView({ behavior: "smooth" });
      // Trigger analysis after scroll
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("startDiagnosis"));
      }, 800);
    }
  };

  const handleNeedMechanic = () => {
    // Scroll to mechanic section
    const mechanicSection = document.getElementById("mechanic");
    if (mechanicSection) {
      mechanicSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Circuit Pattern Background */}
      <div className="absolute inset-0 circuit-pattern opacity-50" />
      
      {/* Hero Content */}
      <div className="relative container mx-auto px-4 pt-32 pb-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-black mb-6">
              Fix smarter. <span className="text-[#0EA5E9]">Drive farther.</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-xl">
              AI-powered solutions for any car trouble — and a mechanic to your location if needed.
            </p>
          </motion.div>

          {/* Diagnosis Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm mb-2 text-gray-600">Car Brand</label>
                <input
                  type="text"
                  placeholder="e.g., Toyota"
                  value={carBrand}
                  onChange={(e) => setCarBrand(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-600">Model</label>
                <input
                  type="text"
                  placeholder="e.g., Camry"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-600">Year</label>
                <input
                  type="text"
                  placeholder="e.g., 2018"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-600">Issue</label>
                <input
                  type="text"
                  placeholder="e.g., Engine noise"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleStartDiagnosis}
                className="flex-1 bg-black text-white hover:bg-black/90 sky-blue-glow rounded-xl py-6"
              >
                <Search className="mr-2 h-5 w-5" />
                Start Diagnosis
              </Button>
              <Button 
                onClick={handleNeedMechanic}
                variant="outline" 
                className="flex-1 border-2 border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white rounded-xl py-6"
              >
                <Wrench className="mr-2 h-5 w-5" />
                Need a Mechanic?
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Right - Image Carousel */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            className="relative w-full max-w-md h-[500px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Carousel Container */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-[#0EA5E9]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img
                    src={slides[currentSlide]}
                    alt={`Slide ${currentSlide + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      e.currentTarget.src = `https://via.placeholder.com/500x500/0EA5E9/FFFFFF?text=Slide+${currentSlide + 1}`;
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-[#0EA5E9] w-8"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
