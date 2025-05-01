
import { useState, useEffect } from 'react';

interface ScrollInfo {
  scrollY: number;
  isScrolled: boolean;
  isAtTop: boolean;
  isScrollingUp: boolean;
  isScrollingDown: boolean;
}

export function useScroll(threshold: number = 50): ScrollInfo {
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    scrollY: 0,
    isScrolled: false,
    isAtTop: true,
    isScrollingUp: false,
    isScrollingDown: false,
  });
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrolled = currentScrollY > threshold;
      const isAtTop = currentScrollY <= 0;
      const isScrollingUp = currentScrollY < lastScrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      
      setScrollInfo({
        scrollY: currentScrollY,
        isScrolled,
        isAtTop,
        isScrollingUp,
        isScrollingDown,
      });
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
  
  return scrollInfo;
}
