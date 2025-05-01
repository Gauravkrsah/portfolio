import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/lib/services/supabaseService';
import { Project } from '@/lib/services/supabaseClient';

const FeaturedProjects: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { data: allProjects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });
  
  // Filter projects to show only featured ones if available, otherwise show all
  const projects = React.useMemo(() => {
    if (!allProjects) return [];
    
    const featuredProjects = allProjects.filter(p => p.featured);
    return featuredProjects.length > 0 ? featuredProjects.slice(0, 6) : allProjects.slice(0, 6);
  }, [allProjects]);
  
  return (
    <section 
      id="featured-projects" 
      className="py-20 bg-[#151515] border-b border-gray-800"
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
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-4 w-4 bg-[#FFB600] rounded-full"></span>
              <h2 
                className={cn(
                  "text-2xl font-bold tracking-tight text-white transition-all duration-700",
                  isVisible ? "opacity-100" : "opacity-0 translate-y-4"
                )}
              >
                Featured Projects
              </h2>
            </div>
            <p 
              className={cn(
                "text-gray-400 transition-all duration-700 delay-100",
                isVisible ? "opacity-100" : "opacity-0 translate-y-4"
              )}
            >
              A selection of my best work across web development, mobile applications, and design
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {isLoading ? (
            <div className="col-span-3 flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#FFB600]" />
            </div>
          ) : error ? (
            <div className="col-span-3 text-center py-20">
              <p className="text-red-500">Error loading projects. Please try again later.</p>
            </div>
          ) : projects && projects.length === 0 ? (
            <div className="col-span-3 text-center py-20">
              <p className="text-gray-400">No featured projects available at the moment.</p>
            </div>
          ) : projects ? (
            projects.map((project: Project, index: number) => (
            <Link 
              to={`/projects/${project.id}`} 
              key={project.id}
              className={cn(
                "transition-all duration-700 group hover:transform hover:scale-[1.02]",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${index * 100 + 300}ms` }}
            >
              <div className="bg-[#111] rounded-xl overflow-hidden border border-[#FFB600]/20 hover:border-[#FFB600]/40 h-full shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-video overflow-hidden relative group-hover:brightness-110 transition-all">
                  <img 
                    src={project.image_url} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-[#FFB600]/90 backdrop-blur-sm text-[#151515] font-medium text-xs rounded-full">
                      {project.technologies?.[0] || 'Project'}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FFB600] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
                  
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-sm text-[#FFB600] flex items-center font-medium">
                      View Project <ArrowRight className="ml-1 h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            ))
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;