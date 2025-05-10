
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ExperienceItemProps {
  title: string;
  company: string;
  period: string;
  description: string;
  skills?: string[];
  isActive?: boolean;
  className?: string;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  title,
  company,
  period,
  description,
  skills = [],
  isActive = false,
  className,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!itemRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(itemRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={itemRef}
      className={cn(
        "relative pl-8 py-4 border-l transition-all",
        isActive ? "border-primary" : "border-muted",
        isVisible ? "opacity-100" : "opacity-0 translate-y-8",
        "transition-all duration-500 ease-out",
        className
      )}
      style={{ transitionDelay: "100ms" }}
    >
      {/* Timeline dot */}
      <div 
        className={cn(
          "absolute top-5 -left-[9px] w-[18px] h-[18px] rounded-full border-2 z-10",
          isActive ? "border-primary bg-background" : "border-muted bg-muted",
          "transition-all duration-300 ease-in-out"
        )}
      />
      
      {/* Content */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
          <h3 className="text-lg font-medium">{title}</h3>
          <span className="text-sm text-muted-foreground">{period}</span>
        </div>
        
        <p className="text-primary/90 font-medium">{company}</p>
        
        <p className="text-muted-foreground text-sm">{description}</p>
        
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <span 
                key={skill} 
                className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceItem;
