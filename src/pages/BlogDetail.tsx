import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Calendar, User, Tag, Share2, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getBlogPostById } from '@/lib/services/supabaseService';
import { BlogPost } from '@/lib/services/supabaseClient';
import ReactMarkdown from 'react-markdown';
 
const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch blog post from Supabase
  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: () => getBlogPostById(id || ''),
    enabled: !!id
  });
 
  useEffect(() => {
    document.title = "Blog Detail | Portfolio";
    
    if (blog) {
      document.title = `${blog.title} | Portfolio`;
    }
  }, [blog]);

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
 
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#151515] text-white">
        <div className="sticky top-0 h-screen">
          <LeftSidebar />
        </div>
        <main className="flex-1 p-8 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#FFB600]" />
        </main>
        <div className="sticky top-0 h-screen">
          <RightSidebar />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex min-h-screen bg-[#151515] text-white">
        <div className="sticky top-0 h-screen">
          <LeftSidebar />
        </div>
        <main className="flex-1 p-8 flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold mb-4">Blog Not Found</h1>
          <p className="text-gray-400 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blogs" className="flex items-center text-[#FFB600] hover:text-[#e2eeff]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>
        </main>
        <div className="sticky top-0 h-screen">
          <RightSidebar />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#151515] text-white">
      <div className="sticky top-0 h-screen">
        <LeftSidebar />
      </div>
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-screen">
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              <Link to="/blogs" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blogs
              </Link>
              
              <article className="space-y-8">
                <header className="space-y-6">
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight">{blog.title}</h1>
                  
                  <div className="flex flex-wrap items-center text-gray-400 gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {blog.author || 'Admin'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(blog.created_at)}
                    </div>
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      {blog.categories && blog.categories.length > 0 ? blog.categories[0] : 'Blog'}
                    </div>
                    <div>{estimateReadTime(blog.content)}</div>
                  </div>
                  
                  {blog.categories && blog.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.categories.map((tag: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </header>
                
                <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
                  <img 
                    src={blog.image_url} 
                    alt={blog.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div 
className="prose prose-invert max-w-none text-gray-300 lg:text-lg"
>
                  <ReactMarkdown>{blog.content}</ReactMarkdown>
                </div>
                
                <footer className="border-t border-gray-800 pt-6 mt-10">
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[#FFB600] flex items-center justify-center">
                        <span className="text-[#151515] font-bold">A</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{blog.author || 'Admin'}</h3>
                        <p className="text-gray-400 text-sm">Developer and Consultant</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                      <button className="p-2 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </footer>
              </article>
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

export default BlogDetail;
