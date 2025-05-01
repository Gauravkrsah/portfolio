import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ExternalLink } from 'lucide-react';

interface VideoPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  platform: string;
  contentType?: string;
}

const VideoPopup = ({ open, onOpenChange, title, url, platform, contentType = 'video' }: VideoPopupProps) => {
  const [embedUrl, setEmbedUrl] = useState<string>('');

  useEffect(() => {
    if (!url) return;
    
    // Convert URL to embed URL based on platform
    if (platform.toLowerCase().includes('youtube')) {
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
      if (match && match[1] && contentType === 'video') {
        setEmbedUrl(`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=734&height=411`);
      } else {
        setEmbedUrl(url);
      }
    } else if (platform.toLowerCase().includes('instagram')) {
      // Try to extract Instagram post ID for embed
      const instagramRegex = /instagram\.com\/p\/([a-zA-Z0-9_-]+)/;
      const reelRegex = /instagram\.com\/reel\/([a-zA-Z0-9_-]+)/;
      const postMatch = url.match(instagramRegex);
      const reelMatch = url.match(reelRegex);
      
      if ((postMatch && postMatch[1]) || (reelMatch && reelMatch[1])) {
        const postId = postMatch ? postMatch[1] : reelMatch![1];
        setEmbedUrl(`https://www.instagram.com/p/${postId}/embed/`);
      } else {
        setEmbedUrl(url);
      }
    } else if (platform.toLowerCase().includes('tiktok')) {
      // TikTok embed is complex and requires script injection
      // For simplicity, we'll just use the original URL
      setEmbedUrl(url);
    } else if (platform.toLowerCase().includes('pinterest')) {
      // Pinterest embed is also complex
      setEmbedUrl(url);
    } else {
      // Default to the original URL for other platforms
      setEmbedUrl(url);
    }
  }, [url, platform, contentType]);

  // Determine if we should render an iframe or redirect
  const shouldRenderIframe = platform.toLowerCase().includes('youtube') || platform.toLowerCase().includes('vimeo') || (platform.toLowerCase().includes('facebook') && contentType === 'video') || platform.toLowerCase().includes('instagram');

  // Handle external link click
  const handleExternalLinkClick = () => {
    window.open(url, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] w-[95vw] p-0 overflow-hidden bg-black border-none text-white">
        <DialogClose asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 z-50 text-white hover:text-white hover:bg-white/10 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogClose>
        <DialogHeader className="p-4">
          <DialogTitle className="text-white text-xl pr-8">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="relative w-full bg-black min-h-[300px]">
          {shouldRenderIframe ? (
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
                This {contentType} from {platform} cannot be displayed directly in this popup.
              </p>
              <Button onClick={handleExternalLinkClick} className="bg-primary hover:bg-primary/80 text-primary-foreground flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Open {platform} {contentType}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPopup;