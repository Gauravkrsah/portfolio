import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Instagram, Code, Paintbrush, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BackgroundBeams } from '@/components/ui/background-beams';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden py-16 bg-black"> {/* Kept at py-16 for adequate footer space */}
      {/* Background animation - subtle version */}
      <BackgroundBeams className="opacity-20" />

      {/* Subtle mesh pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/10"> {/* Reduced gap-12 to gap-8 and pb-12 to pb-8 */}
            {/* Left - Brand and tagline */}
            <motion.div
              className="md:col-span-4 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="inline-flex items-center space-x-3 group">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center group-hover:from-green-400 group-hover:to-blue-400 transition-all">
                  <div
                    className="cursor-pointer w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center relative"
                    onClick={() => console.log('Avatar clicked')}
                  >
                    <img
                      id="profile-img"
                      src="https://i.pinimg.com/736x/4f/e1/d5/4fe1d50c67fe8ffbcc6cbc67a4510edc.jpg"
                      alt="Gaurav's Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement; // Type-cast the event target to HTMLImageElement
                        target.style.display = 'none'; // Hide image if error occurs
                        const fallbackText = document.getElementById('fallback-text');
                        if (fallbackText) {
                          fallbackText.style.display = 'block'; // Show fallback text
                        }
                      }}
                    />
                    <span
                      id="fallback-text"
                      className="text-white text-lg font-bold absolute"
                      style={{ display: 'none' }} // Initially hidden
                    >
                      G
                    </span>
                  </div>

                </div>
                <span className="text-white font-medium text-xl group-hover:text-green-400 transition-colors">Gaurav Kr Sah</span>
              </Link>

              <p className="text-neutral-400 text-sm mt-2 max-w-md">
                Creating exceptional digital experiences through a unique blend of design,
                development, and strategic marketing.
              </p>

              <div className="flex items-center gap-4 pt-3"> {/* Reduced pt-4 to pt-3 */}
                <div className="flex items-center gap-4 pt-3"> {/* Reduced pt-4 to pt-3 */}
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "#FFB600" }}>
                    <Paintbrush className="h-3.5 w-3.5" />
                    <span>Designer</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "#FFB600" }}>
                    <Code className="h-3.5 w-3.5" />
                    <span>Developer</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "#FFB600" }}>
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>Marketer</span>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Middle - Quick links */}
            <motion.div
              className="md:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-medium mb-3 text-sm uppercase tracking-wider"> {/* Reduced mb-4 to mb-3 */}
                Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/" className="text-neutral-400 hover:text-green-400 transition-colors py-1 text-sm">
                  Home
                </Link>
                <Link to="/projects" className="text-neutral-400 hover:text-green-400 transition-colors py-1 text-sm">
                  Projects
                </Link>
                <Link to="/blogs" className="text-neutral-400 hover:text-green-400 transition-colors py-1 text-sm">
                  Blog
                </Link>
                {/* <Link to="/other-works" className="text-neutral-400 hover:text-green-400 transition-colors py-1 text-sm">
                  Other Works
                </Link> */}
                <Link to="/contacts" className="text-neutral-400 hover:text-green-400 transition-colors py-1 text-sm">
                  Contact
                </Link>
                <a href="#" className="text-neutral-400 hover:text-green-400 transition-colors py-1 text-sm">
                  Resume
                </a>
              </div>
            </motion.div>

            {/* Right - Contact & Social */}
            <motion.div
              className="md:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-medium mb-3 text-sm uppercase tracking-wider"> {/* Reduced mb-4 to mb-3 */}
                Connect With Me
              </h3>
              <div className="flex flex-col space-y-3">
                <a
                  href="mailto:hello@gauravsah.com.np"
                  className="text-neutral-400 hover:text-green-400 transition-colors text-sm flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  hello@gauravsah.com.np
                </a>

                <div className="flex space-x-4 pt-3"> {/* Reduced pt-4 to pt-3 */}
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border border-white/10 hover:border-white/20"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border border-white/10 hover:border-white/20"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border border-white/10 hover:border-white/20"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Copyright and legal links */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-xs"> {/* Reduced mt-8 to mt-6 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-neutral-500"
            >
              © {currentYear} Gaurav Kr Sah. All rights reserved.
            </motion.p>
            <div className="flex space-x-6 mt-3 md:mt-0"> {/* Reduced mt-4 to mt-3 */}
              <a href="#" className="text-neutral-500 hover:text-green-400 transition-colors">Privacy</a>
              <a href="#" className="text-neutral-500 hover:text-green-400 transition-colors">Terms</a>
              <a href="#" className="text-neutral-500 hover:text-green-400 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
