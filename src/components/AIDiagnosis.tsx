import { motion } from "motion/react";
import { Cpu, CheckCircle2, AlertCircle, Wrench } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export function AIDiagnosis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [symptom, setSymptom] = useState("");
  const [occurrence, setOccurrence] = useState("While driving");
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [showDIYSolution, setShowDIYSolution] = useState(false);

  useEffect(() => {
    // Listen for diagnosis trigger from Hero component
    const handleStartDiagnosis = () => {
      const storedData = sessionStorage.getItem("vehicleData");
      if (storedData) {
        const data = JSON.parse(storedData);
        setVehicleInfo(`${data.year} ${data.carBrand} ${data.model}`);
        setSymptom(data.issue);
        // Auto-start analysis
        setTimeout(() => handleAnalyze(data), 500);
        sessionStorage.removeItem("vehicleData");
      }
    };

    window.addEventListener("startDiagnosis", handleStartDiagnosis);
    return () => window.removeEventListener("startDiagnosis", handleStartDiagnosis);
  }, []);

  const generateDiagnosis = (vehicleData?: any) => {
    const issue = vehicleData?.issue || symptom;
    const vehicle = vehicleData ? `${vehicleData.year} ${vehicleData.carBrand} ${vehicleData.model}` : vehicleInfo;
    
    // Simple AI-like diagnosis based on keywords
    const issueLower = issue.toLowerCase();
    
    if (issueLower.includes("noise") || issueLower.includes("squeak") || issueLower.includes("sound")) {
      if (issueLower.includes("brake")) {
        // Dispatch cost update event
        window.dispatchEvent(new CustomEvent("updateServiceCost", {
          detail: { callOut: 500, diagnostic: 300, estimated: "₹2,500 - ₹5,000" }
        }));
        return {
          issue: "Worn brake pads causing squeaking noise",
          actions: [
            "Replace front brake pads (estimated cost: ₹2,500-5,000)",
            "Inspect brake rotors for wear",
            "Check brake fluid level"
          ],
          safety: "Brake issues should be addressed immediately",
          confidence: 94,
          canDIY: false,
          diySolution: null,
          mechanicRequired: "Brake repairs require professional expertise and proper tools. Contact a mechanic for safety."
        };
      } else if (issueLower.includes("engine")) {
        window.dispatchEvent(new CustomEvent("updateServiceCost", {
          detail: { callOut: 500, diagnostic: 300, estimated: "₹1,500 - ₹4,000" }
        }));
        return {
          issue: "Possible engine belt wear or low oil level",
          actions: [
            "Check engine oil level and top up if needed",
            "Inspect serpentine belt for cracks or wear (cost: ₹1,500-4,000)",
            "Check for loose engine components"
          ],
          safety: "Monitor closely and avoid long trips until resolved",
          confidence: 87,
          canDIY: true,
          diySolution: {
            title: "DIY Solution: Check and Top Up Engine Oil",
            difficulty: "Easy",
            time: "10-15 minutes",
            steps: [
              "Park on level ground and turn off the engine. Wait 5 minutes for oil to settle.",
              "Locate the dipstick (usually has a yellow or orange handle).",
              "Pull out the dipstick, wipe it clean with a cloth, then reinsert it fully.",
              "Pull it out again and check the oil level. It should be between MIN and MAX marks.",
              "If low, remove the oil filler cap (marked with oil can symbol) on top of engine.",
              "Add oil slowly in small amounts (100-200ml at a time).",
              "Wait a minute, then check dipstick again. Repeat until oil reaches MAX mark.",
              "Replace the oil filler cap and dipstick securely."
            ],
            tools: ["Clean cloth", "Engine oil (check manual for correct type)"],
            warning: "If belt is worn or cracked, contact a mechanic for replacement."
          }
        };
      }
    } else if (issueLower.includes("vibrat") || issueLower.includes("shake")) {
      window.dispatchEvent(new CustomEvent("updateServiceCost", {
        detail: { callOut: 500, diagnostic: 300, estimated: "₹800 - ₹1,500" }
      }));
      return {
        issue: "Wheel balance or alignment issue detected",
        actions: [
          "Get wheel balancing service (cost: ₹800-1,500)",
          "Check tire pressure and adjust to recommended PSI",
          "Inspect tires for uneven wear patterns"
        ],
        safety: "Safe to drive but address soon for comfort and tire longevity",
        confidence: 91,
        canDIY: true,
        diySolution: {
          title: "DIY Solution: Check and Adjust Tire Pressure",
          difficulty: "Very Easy",
          time: "15 minutes",
          steps: [
            "Find the recommended tire pressure on a sticker inside driver's door or in owner's manual.",
            "Remove valve cap from tire and press tire pressure gauge firmly onto valve.",
            "Read the pressure. If low, use air pump at petrol station to inflate.",
            "Add air in short bursts, checking pressure frequently.",
            "Repeat for all four tires including spare.",
            "Replace valve caps securely."
          ],
          tools: ["Tire pressure gauge (₹100-300)", "Air pump (available at petrol stations)"],
          warning: "If vibration persists after correcting tire pressure, wheel balancing by a mechanic is needed."
        }
      };
    } else if (issueLower.includes("smoke") || issueLower.includes("smell")) {
      window.dispatchEvent(new CustomEvent("updateServiceCost", {
        detail: { callOut: 500, diagnostic: 300, estimated: "₹3,000 - ₹10,000" }
      }));
      return {
        issue: "Potential fluid leak or overheating issue",
        actions: [
          "Check coolant level immediately",
          "Inspect for oil or coolant leaks (repair cost: ₹3,000-10,000)",
          "Do not drive if smoke is excessive"
        ],
        safety: "⚠️ URGENT: Stop driving if smoke persists",
        confidence: 89,
        canDIY: false,
        diySolution: null,
        mechanicRequired: "Smoke and overheating issues can cause serious engine damage. Stop driving immediately and contact a mechanic."
      };
    } else if (issueLower.includes("light") || issueLower.includes("warning") || issueLower.includes("dashboard")) {
      window.dispatchEvent(new CustomEvent("updateServiceCost", {
        detail: { callOut: 500, diagnostic: 300, estimated: "₹1,000 - ₹2,000" }
      }));
      return {
        issue: "Dashboard warning light requires diagnostic scan",
        actions: [
          "Get OBD-II diagnostic scan (cost: ₹1,000-2,000)",
          "Check owner's manual for light meaning",
          "Address underlying issue based on scan results"
        ],
        safety: "Severity depends on which light is on",
        confidence: 85,
        canDIY: true,
        diySolution: {
          title: "DIY Solution: Basic Warning Light Checks",
          difficulty: "Easy",
          time: "10 minutes",
          steps: [
            "Check your owner's manual to identify which warning light is on.",
            "If it's the tire pressure light, check all tire pressures.",
            "If it's the oil light, check oil level with dipstick.",
            "If it's the coolant light, check coolant reservoir level (when engine is cold).",
            "If it's the battery light, check battery terminals for corrosion.",
            "Try turning off the engine, waiting 30 seconds, and restarting.",
            "If light persists or is red, avoid driving and contact a mechanic."
          ],
          tools: ["Owner's manual", "Flashlight"],
          warning: "Red warning lights indicate serious issues - contact a mechanic immediately."
        }
      };
    } else if (issueLower.includes("battery") || issueLower.includes("start") || issueLower.includes("crank")) {
      window.dispatchEvent(new CustomEvent("updateServiceCost", {
        detail: { callOut: 500, diagnostic: 300, estimated: "₹2,000 - ₹5,000" }
      }));
      return {
        issue: "Battery or starter system issue",
        actions: [
          "Check battery terminals for corrosion",
          "Test battery voltage (should be 12.6V when off)",
          "Inspect battery age (typically last 3-5 years)"
        ],
        safety: "Safe to attempt DIY checks",
        confidence: 88,
        canDIY: true,
        diySolution: {
          title: "DIY Solution: Clean Battery Terminals",
          difficulty: "Easy",
          time: "20 minutes",
          steps: [
            "Turn off engine and remove keys. Wear gloves and safety glasses.",
            "Identify positive (+) and negative (-) terminals on battery.",
            "Using a wrench, loosen the negative (-) terminal first and remove cable.",
            "Then loosen and remove the positive (+) terminal cable.",
            "Mix baking soda with water to make a paste.",
            "Use an old toothbrush to scrub terminals and cable ends to remove corrosion.",
            "Rinse with clean water and dry thoroughly.",
            "Reconnect positive (+) terminal first, then negative (-) terminal.",
            "Tighten both terminals securely."
          ],
          tools: ["Wrench (10mm or 13mm)", "Baking soda", "Water", "Old toothbrush", "Gloves", "Safety glasses"],
          warning: "If car still won't start after cleaning, battery may need replacement - contact a mechanic."
        }
      };
    }
    
    // Default diagnosis
    window.dispatchEvent(new CustomEvent("updateServiceCost", {
      detail: { callOut: 500, diagnostic: 300, estimated: "₹2,000 - ₹8,000" }
    }));
    return {
      issue: `Issue detected with ${vehicle}`,
      actions: [
        "Schedule a comprehensive diagnostic inspection",
        "Check all fluid levels and top up as needed",
        "Inspect for any visible damage or wear"
      ],
      safety: "Recommend professional inspection for accurate diagnosis",
      confidence: 78,
      canDIY: false,
      diySolution: null,
      mechanicRequired: "For accurate diagnosis of this issue, professional inspection is recommended."
    };
  };

  const handleAnalyze = (vehicleData?: any) => {
    setAnalyzing(true);
    setShowResults(false);
    
    setTimeout(() => {
      const diagnosis = generateDiagnosis(vehicleData);
      setDiagnosisResult(diagnosis);
      setAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  const handleSendMechanic = () => {
    const mechanicSection = document.getElementById("mechanic");
    if (mechanicSection) {
      mechanicSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden" id="diagnosis">
      {/* Blueprint Pattern */}
      <div className="absolute inset-0 blueprint-pattern opacity-30" />
      
      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-white mb-4">
            AI-Powered <span className="text-[#0EA5E9]">Diagnosis</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Our advanced AI analyzes your car's symptoms and provides instant solutions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Input Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-[#0EA5E9]/30 shadow-2xl"
          >
            <h3 className="text-white mb-6">Enter Vehicle Details</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-2 text-gray-400">Vehicle Information</label>
                <input
                  type="text"
                  placeholder="2018 Toyota Camry"
                  value={vehicleInfo}
                  onChange={(e) => setVehicleInfo(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-gray-400">Primary Symptom</label>
                <textarea
                  placeholder="Describe the issue you're experiencing..."
                  rows={4}
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-400">When does it occur?</label>
                <select 
                  value={occurrence}
                  onChange={(e) => setOccurrence(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20"
                >
                  <option>While driving</option>
                  <option>On startup</option>
                  <option>When braking</option>
                  <option>When accelerating</option>
                  <option>Constant</option>
                </select>
              </div>
            </div>

            <Button 
              onClick={() => handleAnalyze()}
              disabled={analyzing || !vehicleInfo || !symptom}
              className="w-full bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white rounded-xl py-6 sky-blue-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Cpu className="mr-2 h-5 w-5" />
              {analyzing ? "Analyzing..." : "Analyze with AI"}
            </Button>
          </motion.div>

          {/* AI Analysis Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Animated Motherboard */}
            <div className="relative h-[500px] bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-[#0EA5E9]/30 p-8 overflow-hidden">
              {analyzing && (
                <>
                  {/* Circuit Board Animation */}
                  <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-0.5 bg-gradient-to-r from-transparent via-[#0EA5E9] to-transparent"
                        style={{
                          top: `${20 + i * 15}%`,
                          width: "100%",
                        }}
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "linear"
                        }}
                      />
                    ))}
                    
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={`v-${i}`}
                        className="absolute w-0.5 bg-gradient-to-b from-transparent via-[#0EA5E9] to-transparent"
                        style={{
                          left: `${20 + i * 15}%`,
                          height: "100%",
                        }}
                        animate={{
                          y: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "linear"
                        }}
                      />
                    ))}
                  </div>

                  {/* Central Processor */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="w-32 h-32 bg-[#0EA5E9]/10 border-4 border-[#0EA5E9] rounded-2xl flex items-center justify-center"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Cpu className="w-16 h-16 text-[#0EA5E9]" />
                    </motion.div>
                  </div>

                  {/* Analyzing Text */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-[#0EA5E9] text-center">AI Analysis in Progress...</p>
                  </div>
                </>
              )}

              {showResults && !analyzing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
                    <div className="p-3 bg-[#0EA5E9]/10 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-[#0EA5E9]" />
                    </div>
                    <div>
                      <h4 className="text-white">Diagnosis Complete</h4>
                      <p className="text-sm text-gray-400">Confidence: {diagnosisResult?.confidence}%</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 overflow-auto">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-[#0EA5E9] mt-1" />
                        <div>
                          <p className="text-white mb-1">Likely Issue</p>
                          <p className="text-sm text-gray-400">{diagnosisResult?.issue}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="text-white mb-2">Recommended Actions:</p>
                      <ul className="text-sm text-gray-400 space-y-2">
                        {diagnosisResult?.actions.map((action: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-[#0EA5E9]">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                      <p className="text-yellow-500 text-sm">
                        ⚠️ Safety Note: {diagnosisResult?.safety}
                      </p>
                    </div>

                    {/* DIY Solution or Mechanic Required */}
                    {diagnosisResult?.canDIY ? (
                      <div className="bg-green-900/20 border-2 border-green-600/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-green-400 font-semibold">✓ You Can Try This Yourself!</p>
                          <Button
                            onClick={() => setShowDIYSolution(!showDIYSolution)}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg"
                          >
                            {showDIYSolution ? "Hide Solution" : "Show DIY Solution"}
                          </Button>
                        </div>
                        
                        {showDIYSolution && diagnosisResult?.diySolution && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 space-y-3"
                          >
                            <div className="border-t border-green-600/30 pt-3">
                              <h5 className="text-white font-semibold mb-2">{diagnosisResult.diySolution.title}</h5>
                              <div className="flex gap-4 text-sm text-white mb-3">
                                <span>⏱️ {diagnosisResult.diySolution.time}</span>
                                <span>📊 {diagnosisResult.diySolution.difficulty}</span>
                              </div>
                              
                              <div className="mb-3">
                                <p className="text-white text-sm font-semibold mb-2">Tools Needed:</p>
                                <ul className="text-sm text-white space-y-1">
                                  {diagnosisResult.diySolution.tools.map((tool: string, idx: number) => (
                                    <li key={idx}>• {tool}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="mb-3">
                                <p className="text-white text-sm font-semibold mb-2">Step-by-Step Instructions:</p>
                                <ol className="text-sm text-white space-y-2">
                                  {diagnosisResult.diySolution.steps.map((step: string, idx: number) => (
                                    <li key={idx} className="flex gap-2">
                                      <span className="text-[#0EA5E9] font-bold">{idx + 1}.</span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>

                              {diagnosisResult.diySolution.warning && (
                                <div className="bg-yellow-900/30 border border-yellow-600/50 rounded p-2">
                                  <p className="text-black text-xs font-medium">
                                    ⚠️ {diagnosisResult.diySolution.warning}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-red-900/20 border-2 border-red-600/50 rounded-lg p-4">
                        <p className="text-red-400 font-semibold mb-2">⚠️ Professional Help Required</p>
                        <p className="text-white text-sm">{diagnosisResult?.mechanicRequired}</p>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleSendMechanic}
                    className="w-full mt-6 bg-black border-2 border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white rounded-xl py-4"
                  >
                    <Wrench className="mr-2 h-5 w-5" />
                    {diagnosisResult?.canDIY ? "Still Need Help? Contact Mechanic" : "Contact Mechanic Now"}
                  </Button>
                </motion.div>
              )}

              {!analyzing && !showResults && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Cpu className="w-24 h-24 text-[#0EA5E9]/30 mx-auto mb-4" />
                    <p className="text-gray-500">Enter your vehicle details to begin analysis</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
