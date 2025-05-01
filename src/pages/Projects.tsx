import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Calendar, ArrowRight, Search, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/lib/services/supabaseService';
import { Project } from '@/lib/services/supabaseClient';

// Define categories
const categories = [
  "All",
  "Web Development",
  "Mobile Apps",
  "UI/UX Design",
  "AI/ML",
  "Open Source"
];

const Projects: React.FC = () => {
  useEffect(() => {
    document.title = "Projects | Portfolio";
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Fetch projects from Supabase
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  // Filter projects based on category and search query
  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];
    
    return projects.filter(project => {
      // Extract category from technologies (use first technology as category)
      const projectCategory = project.technologies && project.technologies.length > 0 
        ? project.technologies[0] 
        : "Other";
      
      const matchesCategory = activeCategory === "All" || projectCategory.includes(activeCategory);
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex min-h-screen bg-[#151515] text-white">
      <div className="sticky top-0 h-screen">
        <LeftSidebar />
      </div>
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-screen">
          <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100" : "opacity-0 translate-y-4"
            )}>
              <h1 className="text-2xl font-bold mb-1">Projects</h1>
              <p className="text-gray-400 text-sm mb-6">A showcase of my development and design work</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs transition-colors",
                        activeCategory === category 
                          ? "bg-[#FFB600] text-[#151515] font-medium" 
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white w-full sm:w-56 text-xs focus:outline-none focus:ring-2 focus:ring-[#FFB600] focus:border-transparent"
                  />
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-[#FFB600]" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">Error loading projects</h3>
                  <p className="text-gray-400 text-sm">
                    There was an error loading the projects. Please try again later.
                  </p>
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((project, index) => (
                    <div 
                      key={project.id}
                      className={cn(
                        "transition-all duration-700",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                      )}
                      style={{ transitionDelay: `${index * 100 + 200}ms` }}
                    >
                      <div className="bg-[#111] rounded-xl overflow-hidden border border-[#FFB600]/20 hover:border-[#FFB600]/40 h-full flex flex-col group hover:transform hover:scale-[1.02] shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="relative h-40 overflow-hidden group-hover:brightness-110 transition-all">
                          <img 
                            src={project.image_url} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="px-3 py-1 bg-[#FFB600]/90 backdrop-blur-sm text-[#151515] font-medium text-xs rounded-full">
                              {project.technologies && project.technologies.length > 0 ? project.technologies[0] : 'Project'}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 flex flex-col flex-grow space-y-2">
                          <div className="flex items-center text-gray-400 text-xs mb-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(project.created_at)}
                          </div>
                          <h3 className="text-base font-bold transition-colors group-hover:text-[#FFB600] line-clamp-1">{project.title}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed flex-grow line-clamp-2">{project.description}</p>
                          <Link 
                            to={`/projects/${project.id}`}
                            className="inline-flex items-center text-sm text-[#FFB600] font-medium hover:text-[#e2eeff] transition-colors pt-2"
                          >
                            View Project <ArrowRight className="ml-1 h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-gray-400 text-sm">
                    No projects match your current filters. Try adjusting your search or category selection.
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </main>
      <div className="sticky top-0 h-screen">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Projects;