import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Search, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getBlogPosts } from '@/lib/services/supabaseService';
import { BlogPost } from '@/lib/services/supabaseClient';

// Define blog categories
const blogCategories = [
  "All",
  "Web Development",
  "Design",
  "Machine Learning",
  "Career Advice"
];

const Blogs: React.FC = () => {
  useEffect(() => {
    document.title = "Blogs | Portfolio";
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Fetch blog posts from Supabase
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: getBlogPosts
  });

  // Filter blog posts based on category and search query
  const filteredBlogs = React.useMemo(() => {
    if (!blogPosts) return [];
    
    return blogPosts.filter(blog => {
      // Extract category from categories (use first category as main category)
      const blogCategory = blog.categories && blog.categories.length > 0 
        ? blog.categories[0] 
        : "Other";
      
      const matchesCategory = activeCategory === "All" || blogCategory.includes(activeCategory);
      const matchesSearch = searchQuery === "" || 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        blog.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, activeCategory, searchQuery]);

  useEffect(() => {
    setIsVisible(true);
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
    <div className="flex min-h-screen bg-[#151515] text-white">
      <div className="sticky top-0 h-screen">
        <LeftSidebar />
      </div>
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-screen">
          <div className="p-8 max-w-6xl mx-auto">
            <div className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100" : "opacity-0 translate-y-4"
            )}>
              <h1 className="text-3xl font-bold mb-2">Blog</h1>
              <p className="text-gray-400 mb-8">Insights and thoughts on design, development, and technology</p>
              
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                <div className="flex flex-wrap gap-2">
                  {blogCategories.map(category => (
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
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 text-white rounded-md px-4 py-2 pl-10 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#FFB600]"
                  />
                  <Search className="absolute top-2.5 left-3 text-gray-400 w-4 h-4" />
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
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-[#FFB600]/90 backdrop-blur-sm text-[#151515] font-medium text-xs rounded-full">
                            {blog.categories && blog.categories.length > 0 ? blog.categories[0] : 'Blog'}
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
      <div className="sticky top-0 h-screen">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Blogs;
