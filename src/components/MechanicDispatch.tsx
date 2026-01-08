import { motion } from "motion/react";
import { MapPin, Clock, Phone, Star, User } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export function MechanicDispatch() {
  const [serviceCost, setServiceCost] = useState({
    callOut: 500,
    diagnostic: 300,
    estimated: "Quoted on-site"
  });

  useEffect(() => {
    // Listen for cost updates from diagnosis
    const handleCostUpdate = (event: any) => {
      if (event.detail) {
        setServiceCost(event.detail);
      }
    };

    window.addEventListener("updateServiceCost", handleCostUpdate);
    return () => window.removeEventListener("updateServiceCost", handleCostUpdate);
  }, []);

  return (
    <section className="relative py-24 bg-white overflow-hidden" id="mechanic">
      {/* Map-like Background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="map-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#0EA5E9" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
        </svg>
      </div>

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-black mb-4">
            Mechanic <span className="text-[#0EA5E9]">On Demand</span>
          </h2>
          <p className="text-gray-700 text-xl max-w-2xl mx-auto">
            Can't fix it yourself? We'll send an expert mechanic to your location
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Map Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-gray-300 overflow-hidden">
              {/* Stylized Map */}
              <div className="absolute inset-0">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ccc" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Roads */}
                  <path d="M 0 250 Q 200 250 250 150" stroke="#999" strokeWidth="6" fill="none" />
                  <path d="M 250 0 L 250 500" stroke="#999" strokeWidth="6" fill="none" />
                  <path d="M 0 300 L 500 300" stroke="#999" strokeWidth="6" fill="none" />
                </svg>
              </div>

              {/* Your Location Pin */}
              <motion.div
                className="absolute"
                style={{ top: "45%", left: "60%" }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-[#0EA5E9] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1 rounded-lg shadow-md text-sm">
                    Your Location
                  </div>
                </div>
              </motion.div>

              {/* Mechanic Location */}
              <motion.div
                className="absolute"
                style={{ top: "20%", left: "30%" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg border-4 border-[#0EA5E9]">
                    <User className="w-6 h-6 text-[#0EA5E9]" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white px-3 py-1 rounded-lg shadow-md text-sm">
                    Mike - Mechanic
                  </div>
                </div>
              </motion.div>

              {/* Route Line */}
              <motion.svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.8 }}
              >
                <motion.path
                  d="M 30% 20% Q 40% 30% 60% 45%"
                  stroke="#0EA5E9"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="10,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.8 }}
                />
              </motion.svg>

              {/* Distance Badge */}
              <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
                <p className="text-sm text-gray-600">Distance</p>
                <p className="text-black">3.2 miles</p>
              </div>
            </div>
          </motion.div>

          {/* Mechanic Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* ETA Card */}
            <div className="bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Clock className="w-8 h-8 text-black" />
                </div>
                <div>
                  <p className="text-black text-sm font-medium">Estimated Arrival</p>
                  <h3 className="text-black font-bold text-2xl">18 minutes</h3>
                </div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-black font-medium">En route</span>
                  <span className="text-sm text-black font-medium">72%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-black rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Mechanic Profile */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center text-[#0EA5E9] text-2xl">
                  M
                </div>
                <div className="flex-1">
                  <h4 className="text-black mb-1">Mike Thompson</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#0EA5E9] text-[#0EA5E9]" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">5.0 (127 reviews)</span>
                  </div>
                  <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    ✓ Available Now
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-[#0EA5E9]" />
                  <span>3.2 miles away</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-[#0EA5E9]">🔧</span>
                  <span>12 years experience • ASE Certified</span>
                </div>
              </div>

              <Button 
                onClick={() => window.open('https://www.google.com/search?q=mechanics+near+me', '_blank')}
                className="w-full bg-black text-white hover:bg-black/90 rounded-xl py-4 sky-blue-glow"
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact Mechanic
              </Button>
            </div>

            {/* Service Details */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="text-black mb-4">Service Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base call-out fee</span>
                  <span className="text-black">₹{serviceCost.callOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Diagnostic fee</span>
                  <span className="text-black">₹{serviceCost.diagnostic}</span>
                </div>
                <div className="h-px bg-gray-300 my-2" />
                <div className="flex justify-between">
                  <span className="text-black font-medium">Estimated repair cost</span>
                  <span className="text-black font-medium">{serviceCost.estimated}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
