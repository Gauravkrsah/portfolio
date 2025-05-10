import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Image, Video } from 'lucide-react';

interface ContentPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  platform: string;
  contentType?: string;
}

const ContentPopup = ({ open, onOpenChange, title, url, platform, contentType = 'video' }: ContentPopupProps) => {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close the modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onOpenChange]);

  // Close the modal when pressing Escape
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!url) return;
    
    // Handle YouTube Shorts specifically
    if (platform.toLowerCase().includes('shorts')) {
      // Extract YouTube Shorts video ID
      const shortsRegex = /(?:youtube\.com\/shorts\/|youtube\.com\/v\/|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(shortsRegex);
      if (match && match[1]) {
        setEmbedUrl(`https://www.youtube.com/embed/${match[1]}?autoplay=1`);
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
        setEmbedUrl(`https://www.youtube.com/embed/${match[1]}?autoplay=1`);
      } else {
        setEmbedUrl(url);
      }
    } else if (platform.toLowerCase().includes('vimeo')) {
      // Extract Vimeo video ID
      const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;
      const match = url.match(vimeoRegex);
      if (match && match[1]) {
        setEmbedUrl(`https://player.vimeo.com/video/${match[1]}?autoplay=1`);
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
        setEmbedUrl(`https://www.instagram.com/p/${postId}/embed/`);
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

  // Handle close button click
  const handleClose = () => {
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div 
        ref={modalRef}
        className="sm:max-w-[800px] w-[95vw] bg-black border-none text-white relative overflow-hidden rounded-lg"
      >
        <button
          type="button"
          className="absolute right-2 top-2 z-50 rounded-full p-2 text-white hover:bg-white/10 hover:text-white focus:outline-none"
          onClick={handleClose}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-4">
          <h2 className="text-white text-xl pr-8">{title}</h2>
        </div>
        
        <div className="relative w-full bg-black min-h-[300px]">
          {shouldRenderIframe() ? (
            <div className="w-full h-[50vh] min-h-[300px]">
              <iframe
                src={embedUrl} 
                width="100%" 
                height="100%" 
                className="border-0 block w-full h-full" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-white mb-6">
                This {contentType.toLowerCase()} from {platform} cannot be displayed directly in this popup.
              </p>
              <Button onClick={handleExternalLinkClick} className="bg-primary hover:bg-primary/80 text-primary-foreground flex items-center gap-2">
                {getContentTypeIcon()}
                <ExternalLink className="h-4 w-4 ml-1" />
                Open {platform} {contentType}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPopup;