import React, { useEffect } from 'react';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import MainContent from '@/components/layout/MainContent';
import MobileNavbar from '@/components/layout/MobileNavbar';
import { ThemeProvider } from '@/hooks/use-theme';

const Index: React.FC = () => {
  useEffect(() => {
    document.title = "Portfolio | Full Stack Developer & AI Enthusiast";
  }, []);

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        {/* Mobile navbar - only visible on mobile */}
        <MobileNavbar />
        
        <div className="flex flex-1 pt-[60px] lg:pt-0">
          {/* Left sidebar - hidden on mobile */}
          <div className="hidden lg:block sticky top-0 h-screen">
            <LeftSidebar />
          </div>
          
          {/* Main content - always visible */}
          <MainContent />
          
          {/* Right sidebar - hidden on mobile */}
          <div className="hidden lg:block sticky top-0 h-screen">
            <RightSidebar />
          </div>
        </div>
        
      </div>
    </ThemeProvider>
  );
};

export default Index;
