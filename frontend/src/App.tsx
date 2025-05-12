import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Contents from "./pages/Contents";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminLogin from "./pages/Admin/Login";
 
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { initializeApp, disableRLS } from './lib/services/appInitializer';
import SubscribePopup from '@/components/ui/SubscribePopup';
import MessagePopup from '@/components/ui/MessagePopup';
import ChatPopup from '@/components/ui/ChatPopup';
import SchedulePopup from '@/components/ui/SchedulePopup';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Create a client for React Query with longer cache time
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 30, // 30 minutes - longer cache time
      gcTime: 1000 * 60 * 60, // 1 hour - keep in cache longer (formerly cacheTime)
      retry: 1
    }
  }
});

// Define window object type for our custom methods
declare global {
  interface Window {
    openSubscribePopup?: () => void;
    openSchedulePopup?: () => void;
    openMessagePopup?: () => void;
    openChatPopup?: () => void;
  }
}

const App: React.FC = () => {
  const [isSubscribeOpen, setIsSubscribeOpen] = React.useState(false);
  const [isMessageOpen, setIsMessageOpen] = React.useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);
  const [isInitialized, setIsInitialized] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  
  // Set fixed dark theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, []);
  const isMobile = useIsMobile();

  // Initialize the application and disable RLS
  useEffect(() => {
    const init = async () => {
      try {
        
        // First try to disable RLS to ensure we have full access
        const rlsDisabled = await disableRLS();
        if (!rlsDisabled) {
          console.warn("Failed to disable RLS. Some features may not work correctly.");
        } else {
          console.log("RLS disabled successfully");
        }
        
        // Initialize the application (database, tables, etc.)
        const appInitialized = await initializeApp();
        if (!appInitialized) {
          setInitError("Failed to initialize application. Check console for details.");
          setIsInitialized(false);
        } else {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error during application initialization:", error);
        setInitError("Error initializing application. Check console for details.");
        setIsInitialized(false);
      }
    };
    
    init();
  }, []);

  // Global popup handlers
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).openSubscribePopup = () => setIsSubscribeOpen(true);
      (window as any).openMessagePopup = () => setIsMessageOpen(true);
      (window as any).openChatPopup = () => setIsChatOpen(true);
      (window as any).openSchedulePopup = () => setIsScheduleOpen(true);
      
      return () => {
        delete (window as any).openSubscribePopup;
        delete (window as any).openMessagePopup;
        delete (window as any).openChatPopup;
        delete (window as any).openSchedulePopup;
      };
    }
  }, []);



  return (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/other-works" element={<Navigate to="/projects" />} /> {/* Redirect old path to new */}
                <Route path="/other-works/:id" element={<Navigate to="/projects" />} /> {/* Redirect old path to new */}
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:id" element={<BlogDetail />} />
                <Route path="/contents" element={<Contents />} />
                <Route path="/contacts" element={<Contacts />} /> {/* Made sure this matches */}
                <Route path="/contact" element={<Navigate to="/contacts" />} /> {/* Added redirect for consistency */}

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="*" element={<Navigate to="dashboard" />} />
                      </Routes>
                    </ProtectedRoute>
                  } 
                />

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            
            
            {/* Global Popups */}
            <SubscribePopup 
              open={isSubscribeOpen} 
              onOpenChange={setIsSubscribeOpen} 
            />
            <MessagePopup 
              open={isMessageOpen} 
              onOpenChange={setIsMessageOpen} 
            />            <ChatPopup 
              open={isChatOpen} 
              onOpenChange={setIsChatOpen} 
              onOpenMeetingPopup={() => setIsScheduleOpen(true)} 
              onOpenSubscribePopup={() => setIsSubscribeOpen(true)} 
              onOpenMessagePopup={() => setIsMessageOpen(true)}
            />
            <SchedulePopup open={isScheduleOpen} onOpenChange={setIsScheduleOpen} />
          </AuthProvider>

          {/* Toaster components for notifications */}
          <Toaster />
          <Sonner />
        </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;