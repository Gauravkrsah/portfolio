import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, FolderKanban, BookOpen, Layers, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();
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
    } else {
      document.body.style.overflow = '';
    }
  };
  
  const closeMenu = () => {
    setIsOpen(false);
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

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <>
      <div className={cn(
        "fixed top-0 left-0 right-0 h-14 sm:h-16 z-50 lg:hidden transition-all duration-200",
        isScrolled 
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm" 
          : "bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
      )}>
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-[#FFB600] to-[#e2eeff] flex items-center justify-center overflow-hidden">
              <span className="text-[#151515] text-base sm:text-lg font-bold">G</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Gaurav Kr Sah</h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs hidden sm:block">Developer & Designer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 sm:h-9 sm:w-9 text-gray-700 dark:text-gray-300"
              onClick={toggleMenu}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-white dark:bg-gray-950 pt-14 sm:pt-16 transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 sm:p-6 h-full overflow-auto">
          <nav className="mb-6 sm:mb-8">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 ml-2 sm:mb-3 sm:ml-3">Navigation</p>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                  onClick={closeMenu}
                >
                  <Home className="h-4 w-4 sm:h-5 sm:w-5 text-[#FFB600] dark:text-[#FFB600]" />
                  <span className="text-sm sm:text-base">Home</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/projects" 
                  className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                  onClick={closeMenu}
                >
                  <FolderKanban className="h-4 w-4 sm:h-5 sm:w-5 text-[#FFB600] dark:text-[#FFB600]" />
                  <span className="text-sm sm:text-base">Projects</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/blogs" 
                  className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                  onClick={closeMenu}
                >
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[#FFB600] dark:text-[#FFB600]" />
                  <span>Blogs</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/contents" 
                  className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                  onClick={closeMenu}
                >
                  <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-[#FFB600] dark:text-[#FFB600]" />
                  <span>Contents</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/contacts" 
                  className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                  onClick={closeMenu}
                >
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#FFB600] dark:text-[#FFB600]" />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="mb-6 sm:mb-8">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 ml-2 sm:mb-3 sm:ml-3">Actions</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button 
                className="w-full text-xs sm:text-sm py-1.5 sm:py-2 h-auto bg-[#FFB600] hover:bg-[#FFB600]/90 text-[#151515] font-medium"
                onClick={handleMessageClick}
              >
                Message Me
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-xs sm:text-sm py-1.5 sm:py-2 h-auto border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={handleSubscribeClick}
              >
                Subscribe
              </Button>
            </div>
          </div>
          
          <div className="mb-6 sm:mb-8">
            <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 ml-2 sm:mb-3 sm:ml-3">Social</p>
            <div className="flex gap-2 sm:gap-3 ml-2 sm:ml-3">
              <a 
                href="https://github.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#FFB600] dark:hover:text-[#FFB600] transition-colors border border-gray-200 dark:border-gray-700"
              >
                <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a 
                href="https://linkedin.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#FFB600] dark:hover:text-[#FFB600] transition-colors border border-gray-200 dark:border-gray-700"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a 
                href="https://twitter.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#FFB600] dark:hover:text-[#FFB600] transition-colors border border-gray-200 dark:border-gray-700"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-auto py-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm text-center">© {new Date().getFullYear()} Gaurav Kr Sah</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
