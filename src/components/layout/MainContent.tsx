import React, { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import HeroSection from '@/components/sections/HeroSection';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import Blog from '@/components/sections/Blog';
import RecentContents from '@/components/sections/RecentContents';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';

const MainContent: React.FC = () => {
  // Force scrollbar to appear to prevent layout shifts
  useEffect(() => {
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.overflowX = 'hidden';
    
    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.overflowX = '';
    };
  }, []);
  
  return (
    <main className="flex-1 relative w-full bg-[#151515] overflow-hidden">
      {/* Removed global background animations */}
      
      {/* Maintain original scrolling behavior */}
      <ScrollArea className="h-screen w-full pb-14 lg:pb-0">
        <div className="w-full relative z-10 pb-14 lg:pb-0">
          {/* Each section with its own styling */}
          <HeroSection />
          <FeaturedProjects />
          <Blog />
          <RecentContents />
          <Contact />
          <Footer />
        </div>
      </ScrollArea>
    </main>
  );
};

export default MainContent;
