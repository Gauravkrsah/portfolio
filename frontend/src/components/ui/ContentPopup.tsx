import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Image, Video, Play, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogOverlay, DialogClose } from '@/components/ui/dialog';
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
    if (!open) return;
    setIsLoading(true);
  }, [open]);

  useEffect(() => {
    if (!url) return;

    // Handle YouTube Shorts specifically
    if (platform.toLowerCase().includes('shorts')) {
      const shortsRegex = /(?:youtube\.com\/shorts\/|youtube\.com\/v\/|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(shortsRegex);
      if (match && match[1]) {
        setEmbedUrl(`https://www.youtube.com/embed/${match[1]}?autoplay=0`);
        return;
      }
    } else if (platform.toLowerCase().includes('youtube')) {
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        setEmbedUrl(`https://www.youtube.com/embed/${match[1]}?autoplay=0`);
        return;
      }
    } else if (platform.toLowerCase().includes('vimeo')) {
      const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;
      const match = url.match(vimeoRegex);
      if (match && match[1]) {
        setEmbedUrl(`https://player.vimeo.com/video/${match[1]}?autoplay=0`);
        return;
      }
    } else if (platform.toLowerCase().includes('facebook')) {
      const facebookVideoRegex = /facebook\.com\/(?:watch\/\?v=|[\w.]+\/videos\/)(\d+)/;
      const match = url.match(facebookVideoRegex);
      if (match && match[1] && contentType.toLowerCase() === 'video') {
        setEmbedUrl(`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=734&height=411`);
        return;
      } else if (contentType.toLowerCase() === 'post') {
        setEmbedUrl(`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=true&width=500`);
        return;
      }
    } else if (platform.toLowerCase().includes('instagram')) {
      const instagramRegex = /instagram\.com\/p\/([a-zA-Z0-9_-]+)(?:\/)?/;
      const reelRegex = /instagram\.com\/(?:reel|reels)\/([a-zA-Z0-9_-]+)(?:\/)?/;
      const storyRegex = /instagram\.com\/stories\/([^\/]+)\/([0-9]+)(?:\/)?/;
      const videoRegex = /instagram\.com\/(?:tv|videos)\/([a-zA-Z0-9_-]+)(?:\/)?/;

      const postMatch = url.match(instagramRegex);
      const reelMatch = url.match(reelRegex);
      const videoMatch = url.match(videoRegex);
      const storyMatch = url.match(storyRegex);

      if ((postMatch && postMatch[1]) || (reelMatch && reelMatch[1]) || (videoMatch && videoMatch[1])) {
        const postId = postMatch ? postMatch[1] : reelMatch ? reelMatch[1] : videoMatch![1];
        if (reelMatch && contentType.toLowerCase() === 'reel') {
          setEmbedUrl(`https://www.instagram.com/reel/${postId}/embed/`);
          return;
        } else {
          setEmbedUrl(`https://www.instagram.com/p/${postId}/embed/`);
          return;
        }
      } else if (storyMatch) {
        setEmbedUrl(url);
        return;
      }
    } else if (platform.toLowerCase().includes('tiktok')) {
      const tiktokRegex = /tiktok\.com\/@([^\/]+)\/video\/(\d+)/;
      const match = url.match(tiktokRegex);
      if (match && match[2] && (contentType.toLowerCase() === 'video' || contentType.toLowerCase() === 'short')) {
        setEmbedUrl(`https://www.tiktok.com/embed/v2/${match[2]}`);
        return;
      }
    } else if (platform.toLowerCase().includes('twitter') || platform.toLowerCase().includes('x')) {
      const tweetRegex = /twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/;
      const xRegex = /x\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/;
      const tweetMatch = url.match(tweetRegex);
      const xMatch = url.match(xRegex);
      if ((tweetMatch && tweetMatch[2]) || (xMatch && xMatch[2])) {
        const tweetId = tweetMatch ? tweetMatch[2] : xMatch![2];
        setEmbedUrl(`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}`);
        return;
      }
    } else if (platform.toLowerCase().includes('pinterest')) {
      const pinRegex = /pinterest\.com\/pin\/(\d+)/;
      const match = url.match(pinRegex);
      if (match && match[1]) {
        setEmbedUrl(`https://assets.pinterest.com/ext/embed.html?id=${match[1]}`);
        return;
      }
    } else {
      setEmbedUrl(url);
    }
  }, [open, url, platform, contentType]);

  const shouldRenderIframe = () => {
    const platformLower = platform.toLowerCase();
    const contentTypeLower = contentType.toLowerCase();
    if (
      platformLower.includes('youtube') ||
      platformLower.includes('shorts') ||
      platformLower.includes('vimeo')
    ) {
      return true;
    }
    if (platformLower.includes('instagram')) {
      return ['video', 'reel', 'post'].includes(contentTypeLower);
    }
    if (platformLower.includes('facebook')) {
      return ['video', 'post'].includes(contentTypeLower);
    }
    if (platformLower.includes('tiktok')) {
      return ['video', 'short'].includes(contentTypeLower);
    }
    if (platformLower.includes('twitter') || platformLower.includes('x')) {
      return ['post', 'tweet'].includes(contentTypeLower);
    }
    if (platformLower.includes('pinterest')) {
      return ['pin', 'post'].includes(contentTypeLower);
    }
    return false;
  };

  const getAspectRatioClass = () => {
    const platformLower = platform.toLowerCase();
    const contentTypeLower = contentType.toLowerCase();
    if (
      platformLower.includes('shorts') ||
      (platformLower.includes('instagram') && contentTypeLower === 'reel') ||
      platformLower.includes('tiktok')
    ) {
      return 'aspect-[9/16] max-w-[320px] mx-auto';
    }
    if (
      (platformLower.includes('instagram') && contentTypeLower === 'post') ||
      platformLower.includes('pinterest')
    ) {
      return 'aspect-square max-w-[450px] mx-auto';
    }
    if (platformLower.includes('facebook') && contentTypeLower === 'post') {
      return 'aspect-auto min-h-[500px]';
    }
    if ((platformLower.includes('twitter') || platformLower.includes('x')) && contentTypeLower === 'post') {
      return 'aspect-auto min-h-[400px]';
    }
    return 'aspect-video w-full';
  };

  const handleExternalLinkClick = () => {
    window.open(url, '_blank');
    onOpenChange(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent className="w-[320px] p-0 bg-[#0f0f0f] text-white border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-[51]">
        <div className="flex flex-col">
          <div className="w-full bg-black relative">
            {shouldRenderIframe() ? (
              <div
                className={cn(
                  'w-full overflow-hidden relative',
                  getAspectRatioClass()
                )}
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
                      <span className="text-sm text-gray-300">
                        Loading {contentType}...
                      </span>
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
                    This {contentType.toLowerCase()} from {platform} cannot be
                    displayed directly.
                  </p>
                </div>
                <Button
                  onClick={handleExternalLinkClick}
                  className="bg-primary hover:bg-primary/80 text-white flex items-center gap-2 px-6 py-5 rounded-full"
                >
                  <ExternalLink className="h-5 w-5 mr-1" />
                  Open in {platform}
                </Button>
              </div>
            )}
          </div>
          <div className="p-2 bg-gradient-to-b from-[#151515] to-[#0f0f0f]">
            <h2 className="text-lg font-bold mb-1 text-white line-clamp-1">
              {title}
            </h2>

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
