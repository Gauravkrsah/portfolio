
import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { getContents } from '@/lib/services/supabaseService';
import { Content } from '@/lib/services/supabaseClient';
import ContentCard from '@/components/ui/ContentCard';

const RecentContents: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { data: allContents, isLoading, error } = useQuery({
    queryKey: ['contents'],
    queryFn: getContents
  });
  
  // Filter contents to show only featured ones if available, otherwise show all
  const contents = React.useMemo(() => {
    if (!allContents) return [];
    
    const featuredContents = allContents.filter(c => c.featured);
    return featuredContents.length > 0 ? featuredContents.slice(0, 8) : allContents.slice(0, 8);
  }, [allContents]);
  
  return (
    <section 
      id="recent-contents" 
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
      <div className="container mx-auto">
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
                Featured Content
              </h2>
            </div>
            <p 
              className={cn(
                "text-gray-400 transition-all duration-700 delay-100",
                isVisible ? "opacity-100" : "opacity-0 translate-y-4"
              )}
            >
              Videos, tutorials and educational content I've created
            </p>
          </div>
          
          <Link
            to="/contents" 
            className={cn(
              "text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-all duration-700 delay-200",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            View all content <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {isLoading ? (
            <div className="col-span-4 flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#FFB600]" />
            </div>
          ) : error ? (
            <div className="col-span-4 text-center py-20">
              <p className="text-red-500">Error loading content. Please try again later.</p>
            </div>
          ) : contents && contents.length === 0 ? (
            <div className="col-span-4 text-center py-20">
              <p className="text-gray-400">No content available at the moment.</p>
            </div>
          ) : contents ? (
            contents.map((content: Content, index: number) => (
            <div
              key={content.id}
              className={cn(
                "transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${index * 100 + 300}ms` }}
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
                isVideo={content.is_video}
                contentType={content.content_type}
                link={content.content_url}
              />
            </div>
            ))
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default RecentContents;
