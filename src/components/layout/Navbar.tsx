
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, PhoneCall, MessageCircle } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'Projects', href: '#projects' },
  { name: 'Other Works', href: '#other-works' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
  { name: 'Socials', href: '#socials' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4",
        isScrolled 
          ? "bg-[#121212]/90 backdrop-blur-lg" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">G</span>
          </div>
          <div>
            <Link to="/" className="font-medium text-white">
              Gaurav Kr Sah
            </Link>
            <p className="text-xs text-gray-400">Developer and Consultant</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-500 text-white text-[11px] font-medium transition-all duration-300 shadow-md hover:shadow-blue-500/20">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12"></path><path d="M4 14h9"></path><path d="M14 4v6m0 0 3-3m-3 3-3-3"></path><path d="M4 18h4"></path></svg>
              Subscribe
            </span>
          </button>

          <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-500 hover:to-emerald-500 text-white text-[11px] font-medium flex items-center gap-1.5 transition-all duration-300 shadow-md hover:shadow-green-500/20">
            <MessageCircle className="w-3 h-3" /> Message
          </button>
          
          <button className="text-gray-400 hover:text-white" aria-label="Phone Call">
            <PhoneCall className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[60px] bg-black z-40 animate-fade-in">
            <nav className="flex flex-col items-center justify-center h-full space-y-8">
              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium transition-opacity hover:opacity-70 text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.name}
                </a>
              ))}
              
              <div className="flex flex-col space-y-4 mt-8">
                <button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500 hover:to-purple-500 text-white text-[11px] font-medium transition-all duration-300 shadow-md flex items-center justify-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12"></path><path d="M4 14h9"></path><path d="M14 4v6m0 0 3-3m-3 3-3-3"></path><path d="M4 18h4"></path></svg>
                  Subscribe
                </button>
                <button className="px-4 py-2 rounded-full bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-500 hover:to-emerald-500 text-white flex items-center justify-center gap-1.5 text-[11px] font-medium transition-all duration-300 shadow-md">
                  <MessageCircle className="w-3 h-3" /> Message
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
