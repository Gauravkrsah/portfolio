
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  header, 
  sidebar, 
  children 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      <div className={`hidden md:block w-64 border-r bg-card h-screen overflow-hidden`}>
        {sidebar}
      </div>
      
      {/* Mobile sidebar */}
      {isMobile && (
        <div 
          className={`fixed inset-0 z-50 transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div 
            className={`absolute left-0 top-0 bottom-0 w-64 bg-background border-r transition-transform duration-300 transform ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">Dashboard</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-auto h-[calc(100%-56px)]">
              {sidebar}
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* Header */}
        <div className="relative">
          {header}
          {/* Mobile toggle */}
          <div className="md:hidden absolute left-4 top-1/2 transform -translate-y-1/2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="h-8 w-8"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
