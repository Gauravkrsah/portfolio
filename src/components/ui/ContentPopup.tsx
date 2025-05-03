import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Image, Video, Loader2, Play } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ContentPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  platform: string;
  contentType?: string;
}

const ContentPopup: React.FC<ContentPopupProps> = ({ open, onOpenChange, title, url, platform, contentType = 'video' }) => {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!url) return;
    
    // Handle YouTube Shorts specifically
    if (platform.toLowerCase().includes('shorts')) {
      // Extract YouTube Shorts video ID
      const shortsRegex = /(?:youtube\.com\/shorts\/|youtube\.com\/v\/|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(shortsRegex);
      if (match && match[1]) {
        setEmbedUrl(`https://www.youtube.com/embed/${match[1]}?autoplay=0`);
      } else {
        setEmbedUrl(url);
      }
    }
    // Handle regular YouTube videos
    else if (platform.toLowerCase().includes('youtube')) {
      // Extract YouTube video ID
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        setEmbedUrl(`https://www.youtube.com/embed/${match[1]}?autoplay=0`);
      } else {
        setEmbedUrl(url);
      }
    } else if (platform.toLowerCase().includes('vimeo')) {
      // Extract Vimeo video ID
      const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;
      const match = url.match(vimeoRegex);
      if (match && match[1]) {
        setEmbedUrl(`https://player.vimeo.com/video/${match[1]}?autoplay=0`);
      } else {
        setEmbedUrl(url);
      }
    } else if (platform.toLowerCase().includes('facebook')) {
      // Try to extract Facebook video ID for embed
      const facebookVideoRegex = /facebook\.com\/(?:watch\/\?v=|[\w.]+\/videos\/)(\d+)/;
      const match = url.match(facebookVideoRegex);
      if (match && match[1] && contentType.toLowerCase() === 'video') {
        setEmbedUrl(`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=734&height=411`);
      } else if (contentType.toLowerCase() === 'post') {
        // Handle Facebook posts
        setEmbedUrl(`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`);
      } else {
        setEmbedUrl(url);
      }
    } else if (platform.toLowerCase().includes('instagram')) {
      // Try to extract Instagram post ID for embed
      const instagramRegex = /instagram\.com\/p\/([a-zA-Z0-9_-]+)(?:\/)?/;
      const reelRegex = /instagram\.com\/(?:reel|reels)\/([a-zA-Z0-9_-]+)(?:\/)?/;
      const storyRegex = /instagram\.com\/stories\/([^\/]+)\/([0-9]+)(?:\/)?/;
      // For Instagram videos that might be in a different format
      const videoRegex = /instagram\.com\/(?:tv|videos)\/([a-zA-Z0-9_-]+)(?:\/)?/;
      
      const postMatch = url.match(instagramRegex);
      const reelMatch = url.match(reelRegex);
      const videoMatch = url.match(videoRegex);
      const storyMatch = url.match(storyRegex);
      
      if ((postMatch && postMatch[1]) || (reelMatch && reelMatch[1]) || (videoMatch && videoMatch[1])) {
        const postId = postMatch ? postMatch[1] : (reelMatch ? reelMatch[1] : videoMatch![1]);
        
        // For reels, use a different embed URL that focuses on the video
        if (reelMatch && contentType.toLowerCase() === 'reel') {
          setEmbedUrl(`https://www.instagram.com/reel/${postId}/embed/`);
        } else {
          setEmbedUrl(`https://www.instagram.com/p/${postId}/embed/`);
        }
      } else if (storyMatch) {
        // Stories can't be embedded directly, use external link
        setEmbedUrl(url);
      } else {
        // For other Instagram URLs, try to create a general embed
        // Instagram requires the URL to be in a specific format for embedding
        const generalInstagramRegex = /instagram\.com\/([^\/]+)(?:\/)?/;
        const generalMatch = url.match(generalInstagramRegex);
        
        if (generalMatch && generalMatch[1]) {
          // For profile or other content, we'll use the original URL
          // as Instagram's oEmbed API requires authentication
          setEmbedUrl(url);
        } else {
          setEmbedUrl(url);
        }
      }
    } else if (platform.toLowerCase().includes('tiktok')) {
      // TikTok embed is complex and requires script injection
      const tiktokRegex = /tiktok\.com\/@([^\/]+)\/video\/(\d+)/;
      const match = url.match(tiktokRegex);
      
      if (match && match[2] && (contentType.toLowerCase() === 'video' || contentType.toLowerCase() === 'short')) {
        // Use TikTok's embed URL format
        setEmbedUrl(`https://www.tiktok.com/embed/v2/${match[2]}`);
      } else {
        setEmbedUrl(url);
      }
    } else if (platform.toLowerCase().includes('twitter') || platform.toLowerCase().includes('x')) {
      // Twitter/X embed
      const tweetRegex = /twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/;
      const xRegex = /x\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/;
      
      const tweetMatch = url.match(tweetRegex);
      const xMatch = url.match(xRegex);
      
      if ((tweetMatch && tweetMatch[2]) || (xMatch && xMatch[2])) {
        const tweetId = tweetMatch ? tweetMatch[2] : xMatch![2];
        setEmbedUrl(`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}`);
      } else {
        setEmbedUrl(url);
      }
    } else if (platform.toLowerCase().includes('pinterest')) {
      // Pinterest embed is also complex
      const pinRegex = /pinterest\.com\/pin\/(\d+)/;
      const match = url.match(pinRegex);
      
      if (match && match[1]) {
        setEmbedUrl(`https://assets.pinterest.com/ext/embed.html?id=${match[1]}`);
      } else {
        setEmbedUrl(url);
      }
    } else {
      // Default to the original URL for other platforms
      setEmbedUrl(url);
    }
  }, [url, platform, contentType]);

  // Reset loading state when popup opens
  useEffect(() => {
    if (open) {
      setIsLoading(true);
    }
  }, [open]);


  // Determine if we should render an iframe or redirect based on platform and content type
  const shouldRenderIframe = () => {
    const platformLower = platform.toLowerCase();
    const contentTypeLower = contentType.toLowerCase();
    
    // Video platforms that always use iframes
    if (
      platformLower.includes('youtube') || 
      platformLower.includes('shorts') || 
      platformLower.includes('vimeo')
    ) {
      return true;
    }
    
    // Instagram - supports posts, reels, and videos
    if (platformLower.includes('instagram')) {
      return ['video', 'reel', 'post'].includes(contentTypeLower);
    }
    
    // Facebook - supports videos and posts
    if (platformLower.includes('facebook')) {
      return ['video', 'post'].includes(contentTypeLower);
    }
    
    // TikTok - supports videos and shorts
    if (platformLower.includes('tiktok')) {
      return ['video', 'short'].includes(contentTypeLower);
    }
    
    // Twitter/X - supports posts
    if (platformLower.includes('twitter') || platformLower.includes('x')) {
      return ['post', 'tweet'].includes(contentTypeLower);
    }
    
    // Pinterest - supports pins
    if (platformLower.includes('pinterest')) {
      return ['pin', 'post'].includes(contentTypeLower);
    }
    
    // Default to false for other combinations
    return false;
  };

  // Get the appropriate aspect ratio class based on content type and platform
  const getAspectRatioClass = () => {
    const platformLower = platform.toLowerCase();
    const contentTypeLower = contentType.toLowerCase();
    
    // Vertical content (shorts, reels)
    if (
      platformLower.includes('shorts') || 
      (platformLower.includes('instagram') && contentTypeLower === 'reel') ||
      (platformLower.includes('tiktok'))
    ) {
      return 'aspect-[9/16] max-w-[320px] mx-auto';
    }
    
    // Square content (Instagram posts)
    if (
      (platformLower.includes('instagram') && contentTypeLower === 'post') ||
      platformLower.includes('pinterest')
    ) {
      return 'aspect-square max-w-[450px] mx-auto';
    }
    
    // Facebook posts
    if (platformLower.includes('facebook') && contentTypeLower === 'post') {
      return 'aspect-auto min-h-[500px]';
    }
    
    // Twitter/X posts
    if ((platformLower.includes('twitter') || platformLower.includes('x')) && contentTypeLower === 'post') {
      return 'aspect-auto min-h-[400px]';
    }
    
    // Default for videos (16:9)
    return 'aspect-video w-full';
  };
  
  // Get the appropriate icon based on content type
  const getContentTypeIcon = () => {
    const type = contentType.toLowerCase();
    
    if (type === 'video' || type === 'short' || type === 'reel') {
      return <Video className="h-5 w-5 mr-2" />;
    } else if (type === 'post' || type === 'story' || type === 'tweet' || type === 'pin') {
      return <Image className="h-5 w-5 mr-2" />;
    }
    
    return null;
  };

  // Handle external link click
  const handleExternalLinkClick = () => {
    window.open(url, '_blank');
    onOpenChange(false);
  };

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Add a custom overlay that prevents event propagation */}
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-black/50",
          open ? "block" : "hidden"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(false);
        }}
      />
      
      <DialogContent className="w-[320px] p-0 bg-[#0f0f0f] text-white border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-[51]">
        {/* Content container */}
        <div className="flex flex-col">
          {/* Video/content area */}
          <div className="w-full bg-black relative">
            {shouldRenderIframe() ? (
              <div className={cn(
                "w-full overflow-hidden relative",
                getAspectRatioClass()
              )}>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
                      <span className="text-sm text-gray-300">Loading {contentType}...</span>
                    </div>
                  </div>
                )}
                {embedUrl && (
                  <iframe
                    ref={iframeRef}
                    src={embedUrl} 
                    width="100%" 
                    height="100%" 
                    className="border-0 block w-full h-full" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    onLoad={handleIframeLoad}
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-3 text-center min-h-[150px]">
                <div className="mb-6 text-gray-300">
                  <Image className="h-16 w-16 mb-4 opacity-30 mx-auto" />
                  <p className="text-lg">
                    This {contentType.toLowerCase()} from {platform} cannot be displayed directly.
                  </p>
                </div>
                <Button onClick={handleExternalLinkClick} className="bg-primary hover:bg-primary/80 text-white flex items-center gap-2 px-6 py-5 rounded-full">
                  <ExternalLink className="h-5 w-5 mr-1" />
                  Open in {platform}
                </Button>
              </div>
            )}
          </div>
        
          {/* Content details */}
          <div className="p-2 bg-gradient-to-b from-[#151515] to-[#0f0f0f]">
            <h2 className="text-lg font-bold mb-1 text-white line-clamp-1">{title}</h2>

            
            <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
              <div className="flex items-center">
                {platform.toLowerCase().includes('youtube') ? (
                  <div className="flex items-center gap-1 bg-red-600/20 text-red-500 px-2 py-1 rounded-full">
                    <Play className="h-3 w-3" fill="currentColor" />
                    <span className="font-medium">YouTube</span>
                  </div>
                ) : platform.toLowerCase().includes('instagram') ? (
                  <div className="flex items-center gap-1 bg-purple-600/20 text-purple-400 px-2 py-1 rounded-full">
                    <Image className="h-3 w-3" />
                    <span className="font-medium">Instagram</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full">
                    <Video className="h-3 w-3" />
                    <span className="font-medium">{platform}</span>
                  </div>
                )}
              </div>
              
              {contentType && (
                <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
                  {contentType.toLowerCase().includes('video') ? (
                    <Video className="h-3 w-3" />
                  ) : (
                    <Image className="h-3 w-3" />
                  )}
                  <span className="capitalize">{contentType}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-2 pt-2 border-t border-gray-800">
              <Button 
                onClick={handleExternalLinkClick} 
                className="bg-primary hover:bg-primary/80 text-white flex items-center gap-1 w-full justify-center"
                size="default"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open Original
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPopup;
