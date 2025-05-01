
import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Play } from 'lucide-react';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleContactClick = () => {
    if (window.openMessagePopup) {
      window.openMessagePopup();
    }
  };

  const handleScheduleClick = () => {
    if (window.openSchedulePopup) {
      window.openSchedulePopup();
    }
  };

  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="relative min-h-[calc(100vh-80px)] flex items-center py-24 overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent dark:from-blue-950/10 dark:to-transparent -z-10"></div>
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center px-3 py-1 space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span>Full Stack Developer & AI Enthusiast</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                <span className="block">Crafting Digital</span>
                <span className="block">Solutions with</span>
                <span className="text-blue-600 dark:text-blue-400">Precision & Creativity</span>
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg pt-4">
                Building innovative web applications with modern technologies. 
                Specialized in React, TypeScript, and full-stack development.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Button 
                className="group bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 transition shadow-md hover:shadow-lg flex items-center"
                onClick={handleContactClick}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Me
                <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline"
                className="rounded-lg border border-gray-300 dark:border-gray-700 px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition"
                onClick={handleScheduleClick}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule a Call
              </Button>
              
              <Button
                variant="ghost"
                className="rounded-lg px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition flex items-center gap-2"
                onClick={() => setShowVideo(true)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Play className="h-4 w-4 text-white ml-0.5" />
                </div>
                <span>Watch Intro</span>
              </Button>
            </div>
            
            {/* Stats section */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800 mt-8">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">5+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">50+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">30+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Clients</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg aspect-video">
                <img 
                  src="/lovable-uploads/b2f9cbc7-3cf0-465c-b9f2-a83b707c17ab.png" 
                  alt="Preview Thumbnail" 
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setShowVideo(true)}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                  <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Video Dialog */}
      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="sm:max-w-4xl p-1 bg-black border border-gray-800 shadow-2xl">
          <div className="aspect-video w-full">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
              title="Introduction Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Hero;
