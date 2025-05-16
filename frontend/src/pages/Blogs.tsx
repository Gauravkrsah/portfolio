import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import MobileNavbar from '@/components/layout/MobileNavbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Search, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getBlogPosts } from '@/lib/services/supabaseService';
import { BlogPost } from '@/lib/services/supabaseClient';

// Define category groups with hierarchical structure
const categoryGroups = [
  {
    name: "All",
    categories: ["All"]
  },
  {
    name: "Web Development",
    categories: [
      "Frontend Development", 
      "Backend Development", 
      "Full-Stack Development",
      "JavaScript",
      "React",
      "Next.js",
      "Node.js"
    ]
  },
  {
    name: "Design",
    categories: [
      "UI/UX Design", 
      "Web Design", 
      "Graphic Design",
      "Design Systems",
      "Figma",
      "Adobe XD",
      "Prototyping"
    ]
  },
  {
    name: "Machine Learning",
    categories: [
      "AI Basics", 
      "Neural Networks", 
      "Computer Vision",
      "NLP",
      "PyTorch",
      "TensorFlow",
      "Data Science"
    ]
  },
  {
    name: "Career Advice",
    categories: [
      "Job Hunting", 
      "Interviews", 
      "Career Growth",
      "Remote Work",
      "Freelancing",
      "Portfolio Building",
      "Personal Branding"
    ]
  }
];

// Flatten categories for filtering
const allCategories = categoryGroups.flatMap(group => group.categories);

const Blogs: React.FC = () => {
  useEffect(() => {
    document.title = "Blogs | Portfolio";
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Fetch blog posts from Supabase
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: getBlogPosts
  });
  // Filter blog posts based on category and search query
  const filteredBlogs = React.useMemo(() => {
    if (!blogPosts) return [];
    
    return blogPosts.filter(blog => {
      // Determine if blog matches the selected category
      let matchesCategory = false;
      
      if (activeCategory === "All") {
        // When "All" is selected, show all blogs
        matchesCategory = true;
      } else {
        // Find the parent category of the selected subcategory
        const parentCategory = categoryGroups.find(group => 
          group.categories.includes(activeCategory)
        )?.name;
        
        // Check if any blog category matches or contains the active category
        matchesCategory = blog.categories?.some(cat => {
          // Handle direct match with subcategory
          const directMatch = cat === activeCategory;
          
          // Handle partial match with subcategory
          const partialMatch = cat.toLowerCase().includes(activeCategory.toLowerCase()) || 
                              activeCategory.toLowerCase().includes(cat.toLowerCase());
          
          // Match by category group (parent category)
          const categoryMatch = parentCategory && 
                              cat.toLowerCase().includes(parentCategory.toLowerCase());
          
          return directMatch || partialMatch || categoryMatch;
        }) || false;
      }
      
      // Check if blog matches the search query
      const matchesSearch = 
        searchQuery === "" ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.categories?.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase())) || 
        false;
      
      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, activeCategory, searchQuery]);
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

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Estimate read time based on content length
  const estimateReadTime = (content: string) => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#151515] text-white">
      {/* Mobile navbar - only visible on mobile */}
      <MobileNavbar />
      
      <div className="flex flex-1 pt-[60px] lg:pt-0">
        {/* Left sidebar - hidden on mobile */}
        <div className="hidden lg:block sticky top-0 h-screen">
          <LeftSidebar />
        </div>
        
        {/* Main content - always visible */}
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-screen pb-14 lg:pb-0">
          <div className="p-8 max-w-6xl mx-auto">
            <div className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100" : "opacity-0 translate-y-4"
            )}>
              <h1 className="text-3xl font-bold mb-2">Blog</h1>
              <p className="text-gray-400 mb-6">Insights and thoughts on design, development, and technology</p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Search input - full width on mobile, inline on desktop */}
                <div className="relative w-full sm:w-56 lg:w-64 order-1 sm:order-2 sm:ml-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 bg-gray-800/90 border border-gray-700 rounded-lg text-white w-full text-xs focus:outline-none focus:ring-1 focus:ring-[#FFB600] focus:border-transparent"
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
                            "px-3 sm:px-3 py-2 mb-1 rounded-lg text-sm font-medium transition-all duration-300",
                            isActive
                              ? "bg-[#FFB600] text-[#151515] shadow-lg shadow-[#FFB600]/20"
                              : "bg-gray-800 text-white hover:bg-gray-700 hover:shadow",
                            "flex items-center gap-1.5 flex-shrink-0 sm:flex-shrink min-w-[90px] sm:min-w-0 justify-center"
                          )}
                        >
                          {/* Icon for each category */}
                          <span className="mr-1">
                            {group.name === "Design" && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <circle cx="12" cy="12" r="6"></circle>
                                <circle cx="12" cy="12" r="2"></circle>
                              </svg>
                            )}
                            {group.name === "Web Development" && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
                              </svg>
                            )}
                            {group.name === "Machine Learning" && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                                <path d="M7 7h.01"></path>
                              </svg>
                            )}
                            {group.name === "Career Advice" && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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
                  
                  {/* Subcategories - animated container that's always present but only visible when needed */}
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
                  <h3 className="text-lg font-medium mb-2">Error loading blog posts</h3>
                  <p className="text-gray-400 text-sm">
                    There was an error loading the blog posts. Please try again later.
                  </p>
                </div>
              ) : filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogs.map((blog, index) => (
                    <div 
                      key={blog.id}
                      className={cn(
                        "bg-[#111] rounded-xl overflow-hidden border border-[#FFB600]/20 hover:border-[#FFB600]/40 transition-all duration-700 group hover:transform hover:scale-[1.02] shadow-lg hover:shadow-xl",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                      )}
                      style={{ transitionDelay: `${index * 100 + 200}ms` }}
                    >
                      <div className="h-48 overflow-hidden group-hover:brightness-110 transition-all">
                        <img 
                          src={blog.image_url} 
                          alt={blog.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />                        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                          <span className="px-3 py-1 bg-[#FFB600]/90 backdrop-blur-sm text-[#151515] font-medium text-xs rounded-full">
                            {(() => {
                              // Find which main category this blog category belongs to
                              const cat = blog.categories && blog.categories.length > 0 ? blog.categories[0] : 'Blog';
                              for (const group of categoryGroups) {
                                if (group.name !== "All" && group.categories.includes(cat)) {
                                  return group.name; // Show main category name
                                }
                              }
                              return cat; // Default to category name as fallback
                            })()}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 space-y-3">
                        <div className="flex justify-between text-gray-400 text-xs mb-3">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{formatDate(blog.created_at)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{estimateReadTime(blog.content)}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#FFB600] transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{blog.summary}</p>
                        <div className="pt-2 flex justify-end items-center">
                          <Link to={`/blogs/${blog.id}`} className="text-sm text-[#FFB600] flex items-center font-medium">
                            Read Article <ArrowRight className="ml-1 h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
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
                    No blog posts match your current filters. Try adjusting your search or category selection.
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

export default Blogs;
