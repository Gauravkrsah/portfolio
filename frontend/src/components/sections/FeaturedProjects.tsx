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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: Project, index: number) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className={cn(
                  "block transition-all duration-700 transform cursor-pointer bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden h-full flex flex-col group hover:border-[#FFB600]/50 transition-all duration-300",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
                tabIndex={0}
                aria-label={`View project: ${project.title}`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-[#FFB600]/80 backdrop-blur-sm text-[#151515] font-medium text-xs rounded-full">
                      {project.technologies?.[0] || 'Project'}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  {project.created_at && (
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{(new Date(project.created_at)).toLocaleString(undefined, { year: 'numeric', month: 'short' })}</span>
                    </div>
                  )}
                  <h3 className="text-lg font-bold mb-1 text-white group-hover:text-[#FFB600] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-neutral-400 text-[13px] mb-3 flex-grow line-clamp-3">
                    {project.description}
                  </p>
                  <div>
                    <span className="text-[#FFB600] cursor-pointer group-hover:underline font-semibold">
                      View Project
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default FeaturedProjects;