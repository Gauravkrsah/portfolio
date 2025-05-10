
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, Loader2 } from 'lucide-react';

import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlogPosts } from '@/lib/services/supabaseService';
import { BlogPost } from '@/lib/services/supabaseClient';

const Blog: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { data: allBlogPosts, isLoading, error } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: getBlogPosts
  });
  
  // Filter blog posts to show only featured ones if available, otherwise show all
  const blogPosts = React.useMemo(() => {
    if (!allBlogPosts) return [];
    
    const featuredPosts = allBlogPosts.filter(p => p.featured);
    return featuredPosts.length > 0 ? featuredPosts.slice(0, 4) : allBlogPosts.slice(0, 4);
  }, [allBlogPosts]);
  
  return (
    <section 
      id="blog" 
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
                Featured Blogs
              </h2>
            </div>
            <p 
              className={cn(
                "text-gray-400 transition-all duration-700 delay-100",
                isVisible ? "opacity-100" : "opacity-0 translate-y-4"
              )}
            >
              Thoughts, tutorials, and insights
            </p>
          </div>
          
          <a 
            href="/blogs" 
            className={cn(
              "text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-all duration-700 delay-200",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            View all posts <ArrowRight className="h-3 w-3" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {isLoading ? (
            <div className="col-span-2 flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#FFB600]" />
            </div>
          ) : error ? (
            <div className="col-span-2 text-center py-20">
              <p className="text-red-500">Error loading blog posts. Please try again later.</p>
            </div>
          ) : blogPosts && blogPosts.length === 0 ? (
            <div className="col-span-2 text-center py-20">
              <p className="text-gray-400">No blog posts available at the moment.</p>
            </div>
          ) : blogPosts ? (
            blogPosts.map((post: BlogPost, index: number) => (
            <Link 
              to={`/blogs/${post.id}`} 
              key={post.id}
              className={cn(
                "transition-all duration-700 group hover:transform hover:scale-[1.02]",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${index * 100 + 300}ms` }}
            >
              <div className="bg-[#111] rounded-xl overflow-hidden border border-[#FFB600]/20 hover:border-[#FFB600]/40 h-full shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-video overflow-hidden relative group-hover:brightness-110 transition-all">
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 bg-[#e2eeff]/80 backdrop-blur-sm text-[#151515] font-medium text-xs rounded-full">
                      {post.categories?.[0] || 'Blog'}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FFB600] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{post.summary}</p>
                  
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-sm text-[#FFB600] flex items-center font-medium">
                      Read more <ArrowRight className="ml-1 h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
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

export default Blog;

/*
Original hardcoded data:
const blogPosts = [
  {
    id: 1,
    title: 'Building Scalable Web Applications with Next.js',
    excerpt: 'Learn how to build performant and scalable web applications using Next.js and React...',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
    link: '#',
  },
  {
    id: 2,
    title: 'Machine Learning in Production: Best Practices',
    excerpt: 'A comprehensive guide to deploying and maintaining ML models in production environments...',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    link: '#',
  },
];
*/

/*
Original render code:
{blogPosts.map((post, index) => (
            <a 
              href={post.link} 
              key={post.id}
              className={cn(
                "transition-all duration-700 group hover:transform hover:scale-[1.02]",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${index * 100 + 300}ms` }}
            >
              <div className="bg-[#111] rounded-xl overflow-hidden border border-[#FFB600]/20 hover:border-[#FFB600]/40 h-full shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-video overflow-hidden relative group-hover:brightness-110 transition-all">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 bg-[#e2eeff]/80 backdrop-blur-sm text-[#151515] font-medium text-xs rounded-full">
                      Blog
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FFB600] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{post.excerpt}</p>
                  
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-sm text-[#FFB600] flex items-center font-medium">
                      Read more <ArrowRight className="ml-1 h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}

*/
