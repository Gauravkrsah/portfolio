import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, FolderKanban, BookOpen, Layers, Mail, Github, Linkedin, Twitter, MessageSquare, Bell, Phone, Wrench, ThumbsUp, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BackgroundBeams } from '@/components/ui/background-beams';

const MobileNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isToolsSidebarOpen, setIsToolsSidebarOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
      setIsToolsSidebarOpen(false); // Close tools sidebar when opening menu
    } else {
      document.body.style.overflow = '';
    }
  };
  
  const toggleToolsSidebar = () => {
    setIsToolsSidebarOpen(!isToolsSidebarOpen);
    if (!isToolsSidebarOpen) {
      setIsOpen(false); // Close the main menu if tools sidebar is opening
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  
  const closeMenu = () => {
    setIsOpen(false);
    setIsToolsSidebarOpen(false);
    document.body.style.overflow = '';
  };
  
  const handleSubscribeClick = () => {
    if (window.openSubscribePopup) {
      window.openSubscribePopup();
    }
    closeMenu();
  };
  
  const handleMessageClick = () => {
    if (window.openMessagePopup) {
      window.openMessagePopup();
    }
    closeMenu();
  };

  const handleChatClick = () => {
    if (window.openChatPopup) {
      window.openChatPopup();
    }
    closeMenu();
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <>
      {/* Top header bar */}
      <div className={cn(
        "fixed top-0 left-0 right-0 h-14 sm:h-16 z-50 lg:hidden transition-all duration-200",
        isScrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-md shadow-sm" 
          : "bg-[#0A0A0A] border-b border-gray-800"
      )}>
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden border-2 border-[#FFB600]">
              <img
                src="https://i.pinimg.com/736x/4f/e1/d5/4fe1d50c67fe8ffbcc6cbc67a4510edc.jpg"
                alt="Gaurav's Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm sm:text-base">Gaurav Kr Sah</h2>
              <p className="text-gray-400 text-xs hidden sm:block">Developer & Designer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 sm:h-10 sm:w-10 text-gray-300 hover:bg-gray-800 hover:text-white rounded-full"
              onClick={toggleToolsSidebar}
            >
              {isToolsSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tools I Made Sidebar */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-[#0A0A0A] pt-14 sm:pt-16 transition-transform duration-300 ease-in-out lg:hidden",
          isToolsSidebarOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 sm:p-8 h-full overflow-auto flex flex-col bg-[#111111] relative">
          {/* Background animation */}
          <BackgroundBeams className="opacity-80" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-[#FFB600]" />
              <h2 className="text-lg font-bold text-white">Tools I Made</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-300 hover:bg-gray-800 hover:text-white rounded-full"
              onClick={toggleToolsSidebar}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Tool Card 1 */}
          <div className="bg-[#1A1A1A] rounded-lg p-4 mb-4 relative z-10">
            <h3 className="text-white font-medium mb-1 truncate">Color Palette Generator</h3>
            <p className="text-gray-400 text-sm mb-3">
              A tool to generate harmonious color palettes for your designs
            </p>
            <div className="flex gap-2 mb-3">
              <span className="px-2 py-0.5 bg-[#1E1E1E] text-gray-300 text-xs rounded">JavaScript</span>
              <span className="px-2 py-0.5 bg-[#1E1E1E] text-gray-300 text-xs rounded">HTML5</span>
            </div>
            <div className="flex justify-between items-center">
              <a 
                href="#" 
                className="text-[#FFB600] text-sm font-medium hover:underline flex items-center gap-1"
              >
                Try Tool
              </a>
              <div className="flex gap-2">
                <button className="text-gray-400 hover:text-white">
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-white">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Tool Card 2 */}
          <div className="bg-[#1A1A1A] rounded-lg p-4 mb-4 relative z-10">
            <h3 className="text-white font-medium mb-1 truncate">Responsive Design Tester</h3>
            <p className="text-gray-400 text-sm mb-3">
              Test your website on different screen sizes and devices
            </p>
            <div className="flex gap-2 mb-3">
              <span className="px-2 py-0.5 bg-[#1E1E1E] text-gray-300 text-xs rounded">JavaScript</span>
              <span className="px-2 py-0.5 bg-[#1E1E1E] text-gray-300 text-xs rounded">React</span>
            </div>
            <div className="flex justify-between items-center">
              <a href="#" className="text-[#FFB600] text-sm font-medium hover:underline">Try Tool</a>
              <div className="flex gap-2">
                <button className="text-gray-400 hover:text-white"><ThumbsUp className="h-4 w-4" /></button>
                <button className="text-gray-400 hover:text-white"><ExternalLink className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Slide-out menu */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-[#0A0A0A] pt-14 sm:pt-16 transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Background animation */}
        <BackgroundBeams className="opacity-80" />
        
        <div className="p-6 sm:p-8 h-full overflow-auto flex flex-col bg-gradient-to-b from-[#0A0A0A]/50 to-[#151515]/50 relative">
          {/* Action section */}
          <div className="mb-10 relative z-10">
            <h3 className="text-sm font-medium text-white mb-4 text-center">Action</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="w-full py-2.5 h-auto bg-[#FFB600] hover:bg-[#FFB600]/90 text-[#0A0A0A] font-medium rounded-md"
                onClick={handleMessageClick}
              >
                Message Me
              </Button>
              <Button 
                variant="outline" 
                className="w-full py-2.5 h-auto border-gray-700 bg-[#1A1A1A] hover:bg-[#252525] text-white rounded-md"
                onClick={handleSubscribeClick}
              >
                Subscribe
              </Button>
            </div>
          </div>
          
          {/* Social section */}
          <div className="mb-10 relative z-10">
            <h3 className="text-sm font-medium text-white mb-4 text-center">Social</h3>
            <div className="flex justify-center gap-4 bg-[#1A1A1A] py-3 px-2 rounded-lg">
              <a 
                href="https://github.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-11 h-11 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-300 hover:text-[#FFB600] transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-11 h-11 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-300 hover:text-[#FFB600] transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-11 h-11 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-300 hover:text-[#FFB600] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Navigation section */}
          <div className="mb-8 relative z-10">
            <h3 className="text-sm font-medium text-white mb-4 text-center">Navigation</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-1">
                <Link 
                  to="/" 
                  className="flex flex-col items-center justify-center gap-2 py-5 px-2 rounded-md bg-[#1A1A1A] hover:bg-[#252525] text-white transition-colors h-full"
                  onClick={closeMenu}
                >
                  <Home className="h-6 w-6 text-[#FFB600]" />
                  <span className="text-sm font-medium">Home</span>
                </Link>
              </div>
              <div className="col-span-1">
                <Link 
                  to="/blogs" 
                  className="flex flex-col items-center justify-center gap-2 py-5 px-2 rounded-md bg-[#1A1A1A] hover:bg-[#252525] text-white transition-colors h-full"
                  onClick={closeMenu}
                >
                  <BookOpen className="h-6 w-6 text-[#FFB600]" />
                  <span className="text-sm font-medium">Blog</span>
                </Link>
              </div>
              <div className="col-span-1">
                <Link 
                  to="/contents" 
                  className="flex flex-col items-center justify-center gap-2 py-5 px-2 rounded-md bg-[#1A1A1A] hover:bg-[#252525] text-white transition-colors h-full"
                  onClick={closeMenu}
                >
                  <Layers className="h-6 w-6 text-[#FFB600]" />
                  <span className="text-sm font-medium">Content</span>
                </Link>
              </div>
              <div className="col-span-1">
                <Link 
                  to="/projects" 
                  className="flex flex-col items-center justify-center gap-2 py-5 px-2 rounded-md bg-[#1A1A1A] hover:bg-[#252525] text-white transition-colors h-full"
                  onClick={closeMenu}
                >
                  <FolderKanban className="h-6 w-6 text-[#FFB600]" />
                  <span className="text-sm font-medium">Project</span>
                </Link>
              </div>
              <div className="col-span-2">
                <Link 
                  to="/contacts" 
                  className="flex items-center justify-center gap-3 py-4 px-4 rounded-md bg-[#1A1A1A] hover:bg-[#252525] text-white transition-colors mt-3"
                  onClick={closeMenu}
                >
                  <Phone className="h-5 w-5 text-[#FFB600]" />
                  <span className="text-base font-medium">Contact</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-auto text-center relative z-10">
            <p className="text-gray-400 text-sm">© 2025 Gaurav Kr Sah</p>
          </div>
        </div>
      </div>
      
      {/* Bottom Mobile Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-[#FFB600] text-[#0A0A0A] z-50 lg:hidden flex items-center justify-around">
        {/* Chat button (moved from 4th to 1st position) */}
        <button 
          onClick={handleChatClick}
          className="flex flex-col items-center justify-center w-1/4 h-full"
        >
          <MessageSquare className="h-5 w-5 mb-0.5" />
          <span className="text-xs font-medium">Chat</span>
        </button>
        
        {/* Subscribe button (stays in 2nd position) */}
        <button 
          onClick={handleSubscribeClick}
          className="flex flex-col items-center justify-center w-1/4 h-full"
        >
          <Bell className="h-5 w-5 mb-0.5" />
          <span className="text-xs font-medium">Subscribe</span>
        </button>
        
        {/* Message button (stays in 3rd position) */}
        <button 
          onClick={handleMessageClick}
          className="flex flex-col items-center justify-center w-1/4 h-full"
        >
          <Mail className="h-5 w-5 mb-0.5" />
          <span className="text-xs font-medium">Message</span>
        </button>
        
        {/* Menu button (moved from 1st to 4th position) */}
        <button 
          onClick={toggleMenu}
          className="flex flex-col items-center justify-center w-1/4 h-full"
        >
          <Menu className="h-5 w-5 mb-0.5" />
          <span className="text-xs font-medium">Menu</span>
        </button>
      </div>
    </>
  );
};

export default MobileNavbar;
