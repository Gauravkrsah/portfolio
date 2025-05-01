
import * as React from "react";

// Different breakpoints for more precise responsive designs
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < BREAKPOINTS.md : false
  );

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener("resize", checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return isMobile;
}

export function useBreakpoint(breakpoint: keyof typeof BREAKPOINTS) {
  const [isBelow, setIsBelow] = React.useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < BREAKPOINTS[breakpoint] : false
  );

  React.useEffect(() => {
    const checkBreakpoint = () => {
      setIsBelow(window.innerWidth < BREAKPOINTS[breakpoint]);
    };
    
    // Initial check
    checkBreakpoint();
    
    // Add event listener
    window.addEventListener("resize", checkBreakpoint);
    
    // Clean up
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, [breakpoint]);

  return isBelow;
}

// Additional hook to get current viewport width for more precise responsive layouts
export function useViewportWidth() {
  const [width, setWidth] = React.useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  React.useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };
    
    // Initial width
    updateWidth();
    
    // Add event listener
    window.addEventListener("resize", updateWidth);
    
    // Clean up
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return width;
}
