
import React, { useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const blogs = [
  {
    id: 1,
    title: 'The Future of AI in Web Development',
    excerpt: 'Exploring how artificial intelligence is transforming the way we build and interact with websites',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80',
    date: 'June 15, 2023',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Designing for Accessibility: Best Practices',
    excerpt: 'How to create inclusive digital experiences that work for everyone, regardless of ability',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    date: 'May 22, 2023',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'The Rise of Web3 Technologies',
    excerpt: 'Understanding the fundamental concepts behind blockchain, crypto, and decentralized applications',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    date: 'April 10, 2023',
    readTime: '8 min read',
  },
];

const RecentBlogs: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <section 
      id="recent-blogs" 
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
              <span className="h-4 w-4 bg-blue-500 rounded-full"></span>
              <h2 
                className={cn(
                  "text-2xl font-bold tracking-tight text-white transition-all duration-700",
                  isVisible ? "opacity-100" : "opacity-0 translate-y-4"
                )}
              >
                Recent Blogs
              </h2>
            </div>
            <p 
              className={cn(
                "text-gray-400 transition-all duration-700 delay-100",
                isVisible ? "opacity-100" : "opacity-0 translate-y-4"
              )}
            >
              Insights and thoughts on design, development, and technology
            </p>
          </div>
          
          <Link
            to="/blogs" 
            className={cn(
              "text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-all duration-700 delay-200",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            View all blogs <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {blogs.map((blog, index) => (
            <div 
              key={blog.id}
              className={cn(
                "bg-gray-900 rounded-lg overflow-hidden transition-all duration-700 group",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${index * 100 + 300}ms` }}
            >
              <div className="h-40 overflow-hidden">
                <img 
                  src={blog.imageUrl} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center text-gray-400 text-xs mb-3">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{blog.date}</span>
                  <span className="mx-2">•</span>
                  <span>{blog.readTime}</span>
                </div>
                <h3 className="text-lg font-medium text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                <Link to={`/blogs/${blog.id}`} className="text-blue-500 text-sm flex items-center gap-1 hover:text-blue-400">
                  Read more <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentBlogs;
