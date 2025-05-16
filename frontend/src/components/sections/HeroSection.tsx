import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, Calendar, ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import SchedulePopup from '@/components/ui/SchedulePopup';

const HeroSection: React.FC = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  
  const handleContactClick = () => {
    if (window.openMessagePopup) {
      window.openMessagePopup();
    }
  };
  
  const handleScheduleClick = () => {
    setScheduleOpen(true);
  };
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-[#151515] overflow-hidden pt-4 sm:pt-8 lg:pt-0">
      {/* Background effect with reduced opacity */}
      <BackgroundBeams className="opacity-80 z-0" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left side - Content */}          <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8">
            {/* Available for projects badge */}
            <div className="inline-flex items-center px-3 py-1 space-x-2 bg-[#FFB600]/20 backdrop-blur-sm border border-[#FFB600]/30 text-[#FFB600] rounded-full text-sm">
              <span className="w-2 h-2 rounded-full bg-[#FFB600] animate-pulse"></span>
              <span>Available for Projects</span>
            </div>
            
            {/* Main heading */}
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white"
              >
                Hello, I'm <span className="text-[#FFB600] font-extrabold">Gaurav</span>
              </motion.h1>
              
              {/* Role text with gradient */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold"
              >
                <div className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFB600] via-[#e2eeff] to-[#FFB600]/70">
                  Designer, Developer and Marketer 
                </div>
              </motion.div>
            </div>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-neutral-300 max-w-lg text-sm sm:text-base"
            >
              I build exceptional digital experiences that combine cutting-edge technology with 
              intuitive design. Specializing in modern web applications, responsive interfaces, 
              and scalable architecture.
            </motion.p>
              {/* Call to action buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-3 sm:gap-5 mt-4 sm:mt-6"
            >
              <Button 
                className="group bg-gradient-to-r from-[#FFB600] to-[#e2eeff] hover:from-[#FFB600]/90 hover:to-[#e2eeff]/90 text-[#151515] font-medium rounded-full px-4 sm:px-7 py-2 sm:py-6 transition shadow-md hover:shadow-xl flex items-center gap-1 sm:gap-2 text-xs sm:text-base"
                onClick={handleContactClick}
              >
                Let's Connect
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline"
                className="rounded-full border border-white/10 hover:border-[#FFB600]/30 bg-white/5 px-4 sm:px-7 py-2 sm:py-6 hover:bg-[#FFB600]/10 text-white transition flex items-center gap-1 sm:gap-2 text-xs sm:text-base"
                onClick={handleScheduleClick}
              >
                <Calendar className="h-5 w-5" />
                Schedule Meeting
              </Button>
            </motion.div>
          </div>
            {/* Right side - Video card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full lg:w-1/2 relative z-20 mt-4 sm:mt-6 lg:mt-0"
          >
            <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
              <DialogTrigger asChild>
                <div className="relative overflow-hidden rounded-2xl border border-[#FFB600]/20 shadow-2xl aspect-video max-w-lg mx-auto cursor-pointer group hover:border-[#FFB600]/40 transition-all duration-300">
                  {/* Video thumbnail overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10 group-hover:bg-black/50 transition-colors"></div>
                  
                  {/* Video info */}
                  <div className="absolute top-6 left-6 z-20">
                    <h2 className="text-xl sm:text-3xl font-bold text-white">PORTFOLIO</h2>
                    <h2 className="text-xl sm:text-3xl font-bold text-[#FFB600]">SHOWCASE</h2>
                    <div className="mt-2">
                      <p className="text-xs sm:text-sm text-white/80 uppercase tracking-widest">CREATIVE</p>
                      <p className="text-xs sm:text-sm text-white/80 uppercase tracking-widest">DEVELOPMENT</p>
                    </div>
                  </div>
                  
                  {/* Thumbnail image */}
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" 
                    alt="Portfolio Showcase" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Play button */}
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/0 hover:bg-black/20 transition-colors z-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-full bg-[#FFB600] flex items-center justify-center shadow-lg shadow-[#FFB600]/30 hover:shadow-xl hover:shadow-[#FFB600]/40 transition-all">
                      <Play 
                        className="h-8 w-8 text-[#151515] ml-1" 
                        fill="#151515"
                      />
                    </div>
                  </motion.div>
                </div>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl bg-black/95 border-neutral-800">
                <div className="aspect-video w-full">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                    title="Portfolio Video" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              </DialogContent>            </Dialog>
            
            {/* Tech stack badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-5 justify-center">
              {[
                'Design', 'Development', 'Marketing', 'UI/UX',
                'SEO', 'Branding', 'E-commerce', 'Web App',
                'Automation', 'Social Media', 'Landing Page',
                'TypeScript', 'Nodejs', 'Tailwind CSS'
              ].map((tech) => (
                <span 
                  key={tech}
                  className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#FFB600]/10 border border-[#FFB600]/20 rounded-full text-xs sm:text-sm text-neutral-200 hover:border-[#FFB600]/40 hover:bg-[#FFB600]/15 transition-all"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Schedule Meeting Popup */}
      <SchedulePopup open={scheduleOpen} onOpenChange={setScheduleOpen} />
    </section>
  );
};

export default HeroSection;
