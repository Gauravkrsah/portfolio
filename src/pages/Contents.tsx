
import React, { useEffect, useState } from 'react';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import MobileNavbar from '@/components/layout/MobileNavbar';
import ContentCard from '@/components/ui/ContentCard';
import { cn } from '@/lib/utils';
import { Search, Loader2 } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import { getContents } from '@/lib/services/supabaseService';
import { Content } from '@/lib/services/supabaseClient';

const categories = [
  "All",
  "Videos",
  "Articles",
  "Podcasts",
  "Tutorials",
  "Courses"
];

const Contents: React.FC = () => {
  useEffect(() => {
    document.title = "Content Feed | Portfolio";
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Fetch contents from Supabase
  const { data: contentItems, isLoading, error } = useQuery({
    queryKey: ['contents'],
    queryFn: getContents
  });

  // Filter contents based on category and search query
  const filteredContents = React.useMemo(() => {
    if (!contentItems) return [];
    
    return contentItems.filter(content => {
      // Determine content category
      const contentCategory = content.content_type || "Other";
      
      // Check if content is a video if "Videos" category is selected
      const isVideoMatch = activeCategory === "Videos" ? content.is_video : true;
      
      // Match category
      const matchesCategory = 
        activeCategory === "All" || 
        contentCategory.includes(activeCategory) ||
        isVideoMatch;
      
      // Match search query
      const matchesSearch = searchQuery === "" || 
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (content.platform && content.platform.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [contentItems, activeCategory, searchQuery]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#151515] text-white">
      {/* Mobile navbar - only visible on mobile */}
      <MobileNavbar />
      
      <div className="flex flex-1 pt-[72px] lg:pt-0">
        {/* Left sidebar - hidden on mobile */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <LeftSidebar />
        </div>
        
        {/* Main content - always visible */}
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-screen">
            <div className="p-6 lg:p-8 max-w-6xl mx-auto">
              <div className={cn(
                "transition-all duration-700",
                isVisible ? "opacity-100" : "opacity-0 translate-y-4"
              )}>
                <h1 className="text-3xl font-bold mb-2">Content Feed</h1>
                <p className="text-gray-400 mb-8">Videos, articles, podcasts, and tutorials I've created</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm transition-colors",
                          activeCategory === category 
                            ? "bg-[#FFB600] text-[#151515] font-medium" 
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#FFB600] focus:border-transparent"
                    />
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-[#FFB600]" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">Error loading content</h3>
                    <p className="text-gray-400 text-sm">
                      There was an error loading the content. Please try again later.
                    </p>
                  </div>
                ) : filteredContents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContents.map((content, index) => (
                      <div 
                        key={content.id}
                        className={cn(
                          "transition-all duration-700",
                          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                        )}
                        style={{ transitionDelay: `${index * 100 + 200}ms` }}
                      >
                        <ContentCard 
                          id={content.id}
                          title={content.title}
                          imageUrl={content.thumbnail_url}
                          platform={content.platform || "YouTube"}
                          duration={content.is_video ? "3:45" : ""}
                          likes={content.likes || 0}
                          comments={content.comments || 0}
                          shares={content.shares || 0}
                          category={content.content_type}
                          isVideo={content.is_video || false}
                          contentType={content.content_type}
                          link={content.content_url}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No results found</h3>
                    <p className="text-gray-400">
                      No content matches your current filters. Try adjusting your search or category selection.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </main>
        
        {/* Right sidebar - hidden on mobile */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Contents;
