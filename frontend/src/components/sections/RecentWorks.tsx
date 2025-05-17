
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const works = [
  {
    id: 1,
    title: 'AI-Powered Voice Assistant',
    description: 'A custom voice assistant built using TensorFlow and NLP models that can control smart home devices',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    category: 'AI Development',
  },
  {
    id: 2,
    title: 'Custom Design System',
    description: 'A comprehensive design system built for a fintech startup with a focus on accessibility',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    category: 'UI/UX Design',
  },
];

const RecentWorks: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <section 
      id="recent-works" 
      className="py-10"
      ref={(el) => {
        if (el) {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
              }
            },
            { threshold: 0.1 }
          );
          observer.observe(el);
        }
      }}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-4 w-4 bg-amber-500 rounded-full"></span>
              <h2 
                className={cn(
                  "text-2xl font-bold tracking-tight text-white transition-all duration-700",
                  isVisible ? "opacity-100" : "opacity-0 translate-y-4"
                )}
              >
                Recent Works
              </h2>
            </div>
            <p 
              className={cn(
                "text-gray-400 transition-all duration-700 delay-100",
                isVisible ? "opacity-100" : "opacity-0 translate-y-4"
              )}
            >
              Exploring my latest freelance and personal projects
            </p>
          </div>
            <Link
            to="/projects" 
            className={cn(
              "text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-all duration-700 delay-200",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            View all projects <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {works.map((work, index) => (
            <div 
              key={work.id}
              className={cn(
                "transition-all duration-700 group",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${index * 100 + 300}ms` }}
            >
              <div className="rounded-lg overflow-hidden relative h-64">
                <img 
                  src={work.imageUrl} 
                  alt={work.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <span className="text-amber-400 text-sm mb-2">{work.category}</span>
                  <h3 className="text-xl font-medium text-white mb-2">{work.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{work.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentWorks;
