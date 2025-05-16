
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

// Define category groups with hierarchical structure
const categoryGroups = [
  {
    name: "All",
    categories: ["All"]
  },
  {
    name: "YouTube",
    categories: [
      "Regular Videos",
      "Tutorials",
      "Reviews",
      "Vlogs",
      "Programming",
      "Tech Reviews",
      "Live Streams"
    ]
  },
  {
    name: "Short Form",
    categories: [
      "YouTube Shorts",
      "Instagram Reels",
      "TikTok Videos",
      "Short Tutorials",
      "Code Snippets",
      "Quick Tips"
    ]
  },
  {
    name: "Social Media",
    categories: [
      "Instagram Posts",
      "Facebook",
      "Twitter",
      "LinkedIn",
      "Pinterest",
      "Thread Posts"
    ]
  },
  {
    name: "Articles",
    categories: [
      "Blog Posts",
      "Technical Guides",
      "Case Studies",
      "Research Articles",
      "Opinion Pieces",
      "Tutorials"
    ]
  }
];

// Flatten categories for filtering
const allCategories = categoryGroups.flatMap(group => group.categories);

const Contents: React.FC = () => {
  useEffect(() => {
    document.title = "Content Feed | Portfolio";
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Fetch contents from Supabase
  const { data: contentItems, isLoading, error } = useQuery({
    queryKey: ['contents'],
    queryFn: getContents
  });
  // Filter contents based on category and search query
  const filteredContents = React.useMemo(() => {
    if (!contentItems) return [];
    
    return contentItems.filter(content => {
      // Determine if content matches the selected category
      let matchesCategory = false;
      
      if (activeCategory === "All") {
        // When "All" is selected, show all contents
        matchesCategory = true;
      } else {
        // Find the parent category of the selected subcategory
        const parentCategory = categoryGroups.find(group => 
          group.categories.includes(activeCategory)
        )?.name;
        
        // Determine content platform and type
        const platform = content.platform || "Other";
        const contentType = content.content_type || "";
        
        // Special cases handling
        const isYouTubeShorts = platform.toLowerCase().includes('youtube') && contentType.toLowerCase() === 'short';
        const isInstagramReels = platform.toLowerCase().includes('instagram') && contentType.toLowerCase() === 'reel';
        const isTikTokVideo = platform.toLowerCase().includes('tiktok');
        
        // Match by short form content
        const isShortFormContent = isYouTubeShorts || isInstagramReels || isTikTokVideo;
        
        // Check if current category is in "Short Form" group and content is a short form content
        if (parentCategory === "Short Form" && isShortFormContent) {
          // Check for specific short form category matches
          if (activeCategory === "YouTube Shorts" && isYouTubeShorts) {
            matchesCategory = true;
          } else if (activeCategory === "Instagram Reels" && isInstagramReels) {
            matchesCategory = true;
          } else if (activeCategory === "TikTok Videos" && isTikTokVideo) {
            matchesCategory = true;
          } else if (activeCategory === "Short Tutorials" || 
                    activeCategory === "Code Snippets" || 
                    activeCategory === "Quick Tips") {
            // For specific types of shorts, check content title/type for keywords
            matchesCategory = content.title.toLowerCase().includes(activeCategory.toLowerCase()) ||
                             (contentType && contentType.toLowerCase().includes(activeCategory.toLowerCase()));
          }
        }
        // Check if YouTube regular videos
        else if (parentCategory === "YouTube" && platform.toLowerCase().includes('youtube') && !isYouTubeShorts) {
          if (activeCategory === "Regular Videos") {
            matchesCategory = true;
          } else {
            // For specific YouTube content types, check title/type for keywords
            matchesCategory = content.title.toLowerCase().includes(activeCategory.toLowerCase()) ||
                             (contentType && contentType.toLowerCase().includes(activeCategory.toLowerCase()));
          }
        }
        // Check if Social Media posts
        else if (parentCategory === "Social Media") {
          // Check if platform matches active category (like Facebook, Twitter)
          const directMatch = platform.toLowerCase().includes(activeCategory.toLowerCase());
          
          // For Instagram posts (excluding reels)
          const isInstagramPost = platform.toLowerCase().includes('instagram') && 
                                 activeCategory === "Instagram Posts" && 
                                 !isInstagramReels;
          
          matchesCategory = directMatch || isInstagramPost;
        }
        // Check if Articles
        else if (parentCategory === "Articles") {
          // Articles typically have content_type like "article", "blog", etc.
          matchesCategory = (contentType && contentType.toLowerCase().includes('article')) || 
                           (contentType && contentType.toLowerCase().includes('blog')) ||
                           content.title.toLowerCase().includes(activeCategory.toLowerCase());
        }
      }
      
      // Match search query
      const matchesSearch = searchQuery === "" || 
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (content.platform && content.platform.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (content.content_type && content.content_type.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [contentItems, activeCategory, searchQuery]);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Handle main category click
  const handleMainCategoryClick = (categoryName: string) => {
    if (expandedCategory === categoryName) {
      // If clicking the already expanded category, collapse it
      setExpandedCategory(null);
      // If All is selected when collapsing, keep it, otherwise clear selection
      setActiveCategory(activeCategory === "All" ? "All" : 
                        categoryName === "All" ? "All" : activeCategory);
    } else {
      // Expand the clicked category
      setExpandedCategory(categoryName);
      // If selecting "All", set it as active
      if (categoryName === "All") {
        setActiveCategory("All");
      }
    }
  };
    
  // Handle subcategory click
  const handleSubCategoryClick = (category: string) => {
    setActiveCategory(category);
  };
  
  // Add CSS styles for animations
  useEffect(() => {
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Custom scrollbar for subcategory containers */
      .subcategories-container::-webkit-scrollbar {
        width: 4px;
      }
      
      .subcategories-container::-webkit-scrollbar-track {
        background: rgba(31, 41, 55, 0.5);
        border-radius: 10px;
      }
      
      .subcategories-container::-webkit-scrollbar-thumb {
        background: rgba(255, 182, 0, 0.5);
        border-radius: 10px;
      }
      
      .subcategories-container::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 182, 0, 0.8);
      }
    `;
    
    // Add style element to head
    document.head.appendChild(styleElement);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
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
          <ScrollArea className="h-screen pb-14 lg:pb-0">
            <div className="p-6 lg:p-8 max-w-6xl mx-auto">
              <div className={cn(
                "transition-all duration-700",
                isVisible ? "opacity-100" : "opacity-0 translate-y-4"
              )}>
                <h1 className="text-3xl font-bold mb-2">Content Feed</h1>
                <p className="text-gray-400 mb-8">Videos, articles, podcasts, and tutorials I've created</p>
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  {/* Search input - full width on mobile, inline on desktop */}
                  <div className="relative w-full sm:w-64 lg:w-72 order-1 sm:order-2 sm:ml-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-800/90 border border-gray-700 rounded-lg text-white w-full text-sm focus:outline-none focus:ring-1 focus:ring-[#FFB600] focus:border-transparent"
                    />
                  </div>
                  
                  {/* Categories container */}
                  <div className="space-y-3 order-2 sm:order-1 w-full sm:w-auto">
                    {/* Main Categories */}
                    <div className="flex flex-wrap gap-2">
                      {categoryGroups.map((group) => {
                        // Determine if this category is active (either expanded or "All" selected)
                        const isActive = expandedCategory === group.name || 
                                        (group.name === "All" && activeCategory === "All") ||
                                        (activeCategory !== "All" && 
                                         categoryGroups.find(g => g.name === group.name)?.categories.includes(activeCategory));
                        
                        return (
                          <button
                            key={group.name}
                            onClick={() => handleMainCategoryClick(group.name)}
                            className={cn(
                              "px-4 py-2 mb-1 rounded-lg text-sm font-medium transition-all duration-300",
                              isActive
                                ? "bg-[#FFB600] text-[#151515] shadow-lg shadow-[#FFB600]/20"
                                : "bg-gray-800 text-white hover:bg-gray-700 hover:shadow",
                              "flex items-center gap-1.5"
                            )}
                          >
                            {/* Icon for each category */}
                            <span className="mr-1">
                              {group.name === "YouTube" && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                                  <path d="m10 15 5-3-5-3z"></path>
                                </svg>
                              )}
                              {group.name === "Short Form" && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect width="10" height="16" x="7" y="4" rx="1"></rect>
                                  <path d="M11 5h2"></path>
                                  <path d="M12 17v.01"></path>
                                </svg>
                              )}
                              {group.name === "Social Media" && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                              )}
                              {group.name === "Articles" && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                                  <path d="M8 7h6"></path>
                                  <path d="M8 11h8"></path>
                                </svg>
                              )}
                              {group.name === "All" && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                                  <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                                  <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                                  <rect width="7" height="7" x="3" y="14" rx="1"></rect>
                                </svg>
                              )}
                            </span>
                            
                            {group.name}
                            
                            {/* Dropdown arrow for expandable categories */}
                            {group.name !== "All" && (
                              <span className="ml-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" 
                                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" 
                                  strokeLinejoin="round" className={cn(
                                    "transition-transform duration-300",
                                    expandedCategory === group.name ? "rotate-180" : ""
                                  )}>
                                  <path d="m6 9 6 6 6-6"/>
                                </svg>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Subcategories - animated container */}
                    <div 
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        expandedCategory && expandedCategory !== "All" 
                          ? "opacity-100 mt-3" 
                          : "max-h-0 opacity-0 mt-0"
                      )}
                      style={{
                        maxHeight: expandedCategory && expandedCategory !== "All" ? '300px' : '0px'
                      }}
                    >
                      <div className="bg-gray-900/60 backdrop-blur-sm p-3 rounded-lg border border-gray-800 max-h-[200px] overflow-y-auto subcategories-container">
                        <h3 className="text-xs font-medium text-gray-400 mb-3 sticky top-0 bg-gray-900/90 py-1">
                          {expandedCategory} Categories
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {expandedCategory && categoryGroups
                            .find(group => group.name === expandedCategory)
                            ?.categories.map((category, idx) => (
                              <button
                                key={category}
                                onClick={() => handleSubCategoryClick(category)}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-xs transition-all mb-1 w-full overflow-hidden text-ellipsis whitespace-nowrap",
                                  activeCategory === category 
                                    ? "bg-[#FFB600] text-[#151515] font-medium shadow-lg" 
                                    : "bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:shadow"
                                )}
                                style={{
                                  animationDelay: `${idx * 50}ms`,
                                  animation: "fadeInUp 0.3s ease-out forwards"
                                }}
                              >
                                {category}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
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
