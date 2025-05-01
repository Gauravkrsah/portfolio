
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  once?: boolean;
  speed?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  once = true,
  speed = 50,
  tag: Tag = 'span',
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if ((once && hasAnimated.current) || !textRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hasAnimated.current = true;
            animateText();
            if (once) observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(textRef.current);

    const animateText = () => {
      if (!textRef.current) return;
      
      const element = textRef.current;
      const letters = text.split('');
      
      element.innerHTML = '';
      
      letters.forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.opacity = '0';
        span.style.transform = 'translateY(10px)';
        span.style.display = 'inline-block';
        span.style.transition = `opacity 0.2s ease, transform 0.2s ease`;
        span.style.transitionDelay = `${index * (speed / 1000)}s`;
        element.appendChild(span);
      });
      
      setTimeout(() => {
        Array.from(element.children).forEach((span) => {
          if (span instanceof HTMLElement) {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          }
        });
      }, 100);
    };

    return () => observer.disconnect();
  }, [text, once, speed]);

  return (
    <Tag className={cn(className)}>
      <span ref={textRef} className="inline-block">{text}</span>
    </Tag>
  );
};

export default AnimatedText;
