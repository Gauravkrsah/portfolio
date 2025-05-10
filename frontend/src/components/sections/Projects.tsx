import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/lib/services/supabaseService';
import { Project } from '@/lib/services/supabaseClient';

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Fetch featured projects from Supabase
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  useEffect(() => {
    setIsVisible(true);
    
    // GSAP animations
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
      
      // Projects staggered animation
      gsap.from(projectsRef.current?.children || [], {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        scrollTrigger: {
          trigger: projectsRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, [projects]);

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-[#151515] relative overflow-hidden border-b border-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div 
          ref={headingRef}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Projects</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            A selection of my best work across web development, mobile applications, and design.
          </p>
        </div>
        
        {/* Projects grid */}
        <div 
          ref={projectsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
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
              <p className="text-neutral-400">No featured projects available at the moment.</p>
            </div>
          ) : projects ? (
            projects.slice(0, 12).map((project: Project, index: number) => (
            
            <div 
              key={project.id}
              className={cn(
                "transition-all duration-700 transform",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden h-full flex flex-col group hover:border-[#FFB600]/50 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-[#FFB600]/80 backdrop-blur-sm text-[#151515] font-medium text-xs rounded-full">
                      {project.technologies?.[0] || 'Project'}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#FFB600] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-neutral-400 text-sm mb-4 flex-grow">
                    {project.description}
                  </p>
                  <Link 
                    to={`/projects/${project.id}`}
                    className="inline-flex items-center text-sm text-[#FFB600] hover:text-[#e2eeff] transition-colors group"
                  >
                    View Project 
                    <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
            ))
          ) : null}
          
        </div>
        
        {/* View all projects button */}
        <div className="text-center mt-12">
          <Link 
            to="/projects"
            className="inline-flex items-center justify-center px-6 py-3 border border-[#FFB600]/30 rounded-full text-white hover:bg-[#FFB600]/10 transition-colors mt-4"
          >
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Projects;