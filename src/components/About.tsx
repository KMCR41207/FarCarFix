import { motion } from "motion/react";
import { Cpu, Wrench, Zap, Shield, Clock, Target } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function About() {
  const features = [
    {
      icon: Cpu,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms diagnose car issues with 94% accuracy"
    },
    {
      icon: Wrench,
      title: "Expert Mechanics",
      description: "ASE-certified professionals available on-demand, anywhere you are"
    },
    {
      icon: Zap,
      title: "Instant Solutions",
      description: "Get diagnostic results in seconds, not hours or days"
    },
    {
      icon: Shield,
      title: "Trusted Service",
      description: "All mechanics are background-checked and insured for your safety"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Help is always just a click away, day or night"
    },
    {
      icon: Target,
      title: "Precision Repairs",
      description: "Data-driven approach ensures accurate fixes the first time"
    }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden" id="about">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-black mb-4">
            Where <span className="text-[#0EA5E9]">Technology</span> Meets Tradition
          </h2>
          <p className="text-gray-700 text-xl max-w-3xl mx-auto">
            Far Car Fix combines the wisdom of classic garage expertise with cutting-edge AI technology 
            to deliver the future of automotive care
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20 max-w-6xl mx-auto">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1634141737337-50b2d803d6e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZ2FyYWdlJTIwd29ya3Nob3B8ZW58MXx8fHwxNzYzOTg0MjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Vintage garage workshop"
                className="w-full h-[500px] object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Floating Elements */}
              <motion.div
                className="absolute top-8 right-8 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0EA5E9] rounded-lg flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">AI Diagnostics</p>
                    <p className="text-black">Active</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-8 left-8 bg-black/95 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0EA5E9] rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Mechanics Online</p>
                    <p className="text-white">247</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Gears */}
            <motion.div
              className="absolute -top-8 -left-8 w-24 h-24 text-[#0EA5E9] opacity-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M50,10 L55,25 L70,20 L65,35 L80,40 L70,50 L80,60 L65,65 L70,80 L55,75 L50,90 L45,75 L30,80 L35,65 L20,60 L30,50 L20,40 L35,35 L30,20 L45,25 Z" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Right - Story */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-black">Our Story</h3>
              <p className="text-gray-700">
                Born from the frustration of expensive dealership visits and unreliable diagnostics, 
                Far Car Fix reimagines automotive care for the modern age.
              </p>
              <p className="text-gray-700">
                We believe that fixing your car shouldn't require a mechanic's expertise just to 
                understand what's wrong. Our AI analyzes millions of repair cases to give you instant, 
                accurate diagnostics — and when you need hands-on help, we send certified mechanics 
                directly to you.
              </p>
              <p className="text-gray-700">
                It's the perfect blend of old-school garage craftsmanship and new-age technology, 
                bringing affordable, transparent car care to everyone.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#0EA5E9]/10 rounded-lg">
                <span className="text-2xl">⚙️</span>
                <span className="text-black">Classic Expertise</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-black/5 rounded-lg">
                <span className="text-2xl">🤖</span>
                <span className="text-black">AI Technology</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#0EA5E9]/10 rounded-lg">
                <span className="text-2xl">🚗</span>
                <span className="text-black">Mobile Service</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#0EA5E9] transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-black mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
