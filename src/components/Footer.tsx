import { motion } from "motion/react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Blueprint Pattern Background */}
      <div className="absolute inset-0 blueprint-pattern opacity-20" />
      
      {/* 3D Engine Watermark */}
      <div className="absolute right-0 bottom-0 w-96 h-96 opacity-5">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <g transform="translate(100,100)">
            {/* Piston */}
            <rect x="-30" y="-80" width="60" height="100" fill="currentColor" opacity="0.3" />
            <circle cx="0" cy="-80" r="35" fill="currentColor" opacity="0.5" />
            
            {/* Connecting Rod */}
            <rect x="-10" y="-40" width="20" height="80" fill="currentColor" opacity="0.4" />
            
            {/* Crankshaft */}
            <circle cx="0" cy="40" r="25" fill="currentColor" opacity="0.6" />
            <circle cx="0" cy="40" r="15" fill="black" />
            
            {/* Gears */}
            <g transform="translate(60, 0)">
              {[...Array(8)].map((_, i) => (
                <rect
                  key={i}
                  x="-5"
                  y="-40"
                  width="10"
                  height="80"
                  fill="currentColor"
                  opacity="0.4"
                  transform={`rotate(${i * 45})`}
                />
              ))}
              <circle cx="0" cy="0" r="25" fill="currentColor" opacity="0.5" />
            </g>
          </g>
        </svg>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-white mb-4">
              Far Car <span className="text-[#0EA5E9]">Fix</span>
            </h3>
            <p className="text-gray-400 mb-6">
              AI-powered automotive care meets traditional garage expertise. 
              Your car's best friend, wherever you are.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-[#0EA5E9] rounded-lg flex items-center justify-center transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'AI Diagnosis', 'Find Mechanic', 'About Us', 'How It Works', 'Pricing'].map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-white mb-4">Services</h4>
            <ul className="space-y-3">
              {[
                'Engine Diagnostics',
                'Brake Repair',
                'Oil Changes',
                'Transmission Service',
                'Electrical Systems',
                'Emergency Roadside'
              ].map((service, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors duration-300">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-white mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#0EA5E9] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">24/7 Support</p>
                  <a href="tel:1-800-CAR-FIXX" className="text-white hover:text-[#0EA5E9] transition-colors">
                    1-800-CAR-FIXX
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#0EA5E9] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <a href="mailto:help@farcarfix.com" className="text-white hover:text-[#0EA5E9] transition-colors">
                    help@farcarfix.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0EA5E9] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Headquarters</p>
                  <p className="text-white">
                    123 Tech Drive<br />
                    Silicon Valley, CA 94025
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Far Car Fix. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-[#0EA5E9] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
