
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, ArrowRight, Clock, Calendar, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import gsap from 'gsap';
import { getVideos } from '@/lib/services/apiService';
import { useQuery } from '@tanstack/react-query';
import { useWebSocketEvent } from '@/lib/services/websocketService';
import { useMediaQuery } from '@/hooks/use-media-query';
import { toast } from '@/components/ui/use-toast';

const VideosHero: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  
  // Fetch video data
  const { data: videos, isLoading, error, refetch } = useQuery({
    queryKey: ['videos'],
    queryFn: getVideos
  });
  
  // Listen for video updates via WebSocket
  useWebSocketEvent('video_updated', useCallback(() => {
    // Refetch videos when they're updated
    refetch();
    toast({
      title: "Videos updated",
      description: "The video content has been refreshed with the latest data.",
    });
  }, [refetch]));
  
  useEffect(() => {
    if (sectionRef.current && videos) {
      const videoTitles = sectionRef.current.querySelectorAll('.video-title');
      const videoCards = sectionRef.current.querySelectorAll('.video-card');
      
      gsap.from(videoTitles, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
      
      gsap.from(videoCards, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.3,
      });
    }
  }, [videos]);
  
  const openVideoModal = (video: any) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };
  
  const closeVideoModal = () => {
    setIsPlaying(false);
    setSelectedVideo(null);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (error) {
    return (
      <section className="py-16 md:py-24 px-4 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Featured <span className="text-gradient">Videos</span>
          </h2>
          <p className="text-red-500 dark:text-red-400">
            Error loading videos. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 px-4 relative overflow-hidden bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white video-title">
              Featured <span className="text-gradient">Videos</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto video-title text-balance">
              Check out my latest tutorials, code walkthroughs, and tech discussions
            </p>
          </motion.div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-video w-full bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                <div className="mt-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                  <div className="mt-1 h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {videos.map((video, index) => (
              <motion.div 
                key={video.id} 
                className="video-card group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {isDesktop ? (
                  <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="aspect-video w-full overflow-hidden">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`${video.videoUrl || video.link}`} 
                        title={video.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{video.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">{video.description}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(video.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {video.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="relative overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                    onClick={() => openVideoModal(video)}
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={video.thumbnailUrl || video.imageUrl} 
                        alt={video.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-white text-xs flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {video.duration}
                    </div>
                    
                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-white text-xs flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(video.createdAt)}
                    </div>
                  </div>
                )}
                
                {!isDesktop && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{video.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">{video.description}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No videos available at the moment.</p>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <a 
              href="/contents"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View all videos <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </div>
      
      <Dialog open={!!selectedVideo && !isDesktop} onOpenChange={(open) => !open && closeVideoModal()}>
        <DialogContent className="sm:max-w-4xl p-1 bg-black border border-gray-800 shadow-2xl">
          <DialogClose className="absolute top-2 right-2 z-10 bg-black/50 text-white rounded-full p-1">
            <X className="h-5 w-5" />
          </DialogClose>
          <div className="aspect-video w-full">
            {selectedVideo && isPlaying && (
              <iframe 
                width="100%" 
                height="100%" 
                src={`${selectedVideo.videoUrl || selectedVideo.link}?autoplay=1`} 
                title={selectedVideo.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-blue-400/5 dark:bg-blue-600/10 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-400/5 dark:bg-purple-600/10 rounded-full filter blur-3xl -z-10"></div>
    </section>
  );
};

export default VideosHero;
