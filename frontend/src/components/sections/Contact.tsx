import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Instagram, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset the submitted state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="py-20 bg-[#151515] relative"
    >
      {/* Accent border at top of section */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFB600] via-[#e2eeff] to-[#FFB600]/70"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold text-white mb-3"
          >
            Get In Touch
          </h2>
          <p 
            className="text-neutral-300 text-lg"
          >
            I'm always open to new opportunities, collaborations, or just a friendly chat. Feel free to reach out through any of the channels below.
          </p>
        </div>
        
        {/* Contact content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left side - Contact info */}
          <div ref={infoRef} className="space-y-6">
            <div className="bg-[#111] border border-[#FFB600]/20 rounded-xl p-6 shadow-xl">
              <h3 className="text-xl font-medium text-white mb-4">Contact Information</h3>
              <p className="text-neutral-300 mb-5">
                I'm available for freelance projects, collaborations, and consultations. 
                Feel free to reach out through any of these channels.
              </p>
              
              <div className="space-y-4 mt-6">
                {/* Email Contact */}
                <div className="flex items-center group transition-colors text-neutral-300 hover:text-[#FFB600]">
                  <div className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center mr-4 group-hover:bg-[#FFB600]/20 transition-colors border border-neutral-600 group-hover:border-[#FFB600]/30">
                    <Mail className="h-5 w-5 text-[#FFB600]" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Email</p>
                    <a 
                      href="mailto:hello@gauravsah.com.np"
                      className="text-white group-hover:text-[#FFB600] transition-colors"
                    >
                      hello@gauravsah.com.np
                    </a>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center mr-4 border border-neutral-600 group-hover:bg-[#e2eeff]/20 transition-colors group-hover:border-[#e2eeff]/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#e2eeff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Location</p>
                    <p className="text-white">Kharibot-Balkumari, Lalitpur</p>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-neutral-700 flex items-center justify-center mr-4 border border-neutral-600 group-hover:bg-[#FFB600]/20 transition-colors group-hover:border-[#FFB600]/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FFB600]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Phone</p>
                    <p className="text-white">+977-9844722697</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-5 border-t border-neutral-700">
                <h4 className="text-sm font-medium text-white mb-4">
                  Connect With Me
                </h4>
                <div className="flex space-x-5">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-full bg-neutral-700 hover:bg-[#FFB600]/20 text-neutral-300 hover:text-[#FFB600] transition-colors border border-neutral-600 hover:border-[#FFB600]/30"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-full bg-neutral-700 hover:bg-[#FFB600]/20 text-neutral-300 hover:text-[#FFB600] transition-colors border border-neutral-600 hover:border-[#FFB600]/30"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-full bg-neutral-700 hover:bg-[#FFB600]/20 text-neutral-300 hover:text-[#FFB600] transition-colors border border-neutral-600 hover:border-[#FFB600]/30"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Contact form */}
          <div>
            <AnimatePresence>
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#111] backdrop-blur-sm rounded-xl p-8 border border-[#FFB600]/20 shadow-xl text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-[#FFB600]/20 border border-[#FFB600]/30 flex items-center justify-center mx-auto mb-6">
                    <Send className="h-6 w-6 text-[#FFB600]" />
                  </div>
                  <h4 className="text-xl font-medium text-white mb-2">Message Sent!</h4>
                  <p className="text-neutral-300">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                </motion.div>
              ) : (
                <motion.form 
                  ref={formRef} 
                  onSubmit={handleSubmit} 
                  className="bg-[#111] backdrop-blur-sm rounded-xl p-6 border border-[#FFB600]/20 shadow-xl"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-neutral-600 bg-neutral-700/50 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB600] focus:border-[#FFB600] transition-all placeholder-neutral-400"
                          placeholder="Your name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-neutral-600 bg-neutral-700/50 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB600] focus:border-[#FFB600] transition-all placeholder-neutral-400"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-neutral-300 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-neutral-600 bg-neutral-700/50 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB600] focus:border-[#FFB600] transition-all placeholder-neutral-400"
                        placeholder="What is this regarding?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-600 bg-neutral-700/50 text-white focus:outline-none focus:ring-2 focus:ring-[#FFB600] focus:border-[#FFB600] transition-all resize-none placeholder-neutral-400"
                        placeholder="Tell me about your project..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center
                        ${isSubmitting ? 'bg-[#FFB600]/50 cursor-not-allowed' : 'bg-gradient-to-r from-[#FFB600] to-[#e2eeff] hover:from-[#FFB600]/90 hover:to-[#e2eeff]/90'} text-[#151515] shadow-md hover:shadow-lg`}
                    >
                      <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                      {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
