
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { getFeaturedVideos } from '@/lib/services/supabaseService';
import { Content } from '@/lib/services/supabaseClient';
import ContentCard from '@/components/ui/ContentCard';
import { useQuery } from '@tanstack/react-query';

const Videos: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['featuredVideos'],
    queryFn: getFeaturedVideos
  });
  
  if (isLoading) {
    return (
      <section id="videos" className="py-20 bg-black">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-4 w-4 bg-[#FFB600] rounded-full"></span>
                <h2 className="text-2xl font-bold tracking-tight text-white">Latest Videos</h2>
              </div>
              <p className="text-gray-400">Educational content and tech insights</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {[1, 2].map((index) => (
              <div key={index} className="bg-[#111] rounded-xl overflow-hidden border border-gray-800 h-full animate-pulse">
                <div className="aspect-video bg-gray-800"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-800 rounded-md mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded-md w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section 
      id="videos" 
      className="py-20 bg-black"
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
                Latest Videos
              </h2>
            </div>
            <p 
              className={cn(
                "text-gray-400 transition-all duration-700 delay-100",
                isVisible ? "opacity-100" : "opacity-0 translate-y-4"
              )}
            >
              Educational content and tech insights
            </p>
          </div>
          
          <a 
            href="#" 
            className={cn(
              "text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-all duration-700 delay-200",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            View all videos <ArrowRight className="h-3 w-3" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {videos && videos.length > 0 ? (
            videos.map((video, index) => (
              <div 
                key={video.id}
                className={cn(
                  "transition-all duration-700 group",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: `${index * 100 + 300}ms` }}
              >
                <ContentCard
                  id={video.id}
                  title={video.title}
                  imageUrl={video.thumbnail_url}
                  platform={video.platform || "YouTube"}
                  duration="3:45"
                  likes={video.likes || 0}
                  comments={video.comments || 0}
                  shares={video.shares || 0}
                  category={video.content_type}
                  isVideo={true}
                  link={video.content_url}
                />
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-400">No videos available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Videos;
