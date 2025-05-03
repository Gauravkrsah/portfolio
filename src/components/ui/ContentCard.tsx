import React, { useState } from 'react';
import { 
  Clock, 
  ExternalLink, 
  Heart, 
  MessageSquare, 
  Share2, 
  Play, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter, 
  Linkedin,
  Image,
  Video,
  Pin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ContentPopup from './ContentPopup';

export interface ContentCardProps {
  id: string;
  title: string;
  imageUrl: string;
  platform: string;
  duration: string;
  likes?: number;
  comments?: number;
  shares?: number;
  category?: string;
  isVideo?: boolean;
  contentType?: string;
  link: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  imageUrl,
  platform,
  duration,
  likes = 0,
  comments = 0,
  shares = 0,
  category,
  isVideo = false,
  contentType = 'video',
  link
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Get platform icon based on platform name
  const getPlatformIcon = () => {
    const platformLower = platform.toLowerCase();

    if (platformLower.includes('shorts')) {
      return <Youtube className="h-3 w-3 mr-1" />;
    } else if (platformLower.includes('youtube')) {
      return <Youtube className="h-3 w-3 mr-1" />;
    } else if (platformLower.includes('instagram reels')) {
      return <Instagram className="h-3 w-3 mr-1" />;
    } else if (platformLower.includes('instagram')) {
      return <Instagram className="h-3 w-3 mr-1" />;
    } else if (platformLower.includes('facebook') || platformLower === 'facebook') {
      return <Facebook className="h-3 w-3 mr-1" />;
    } else if (platformLower.includes('twitter') || platformLower.includes('x') || platformLower === 'twitter') {
      return <Twitter className="h-3 w-3 mr-1" />;
    } else if (platformLower.includes('linkedin') || platformLower === 'linkedin') {
      return <Linkedin className="h-3 w-3 mr-1" />;
    } else if (platformLower.includes('pinterest') || platformLower === 'pinterest') {
      return <Pin className="h-3 w-3 mr-1" />;
    } else if (platformLower.includes('tiktok') || platformLower === 'tiktok') {
      return <Video className="h-3 w-3 mr-1" />;
    } else if (platformLower.includes('other')) {
      return <Image className="h-3 w-3 mr-1" />;
    }
    
    return null;
  };

  // Handle card click
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Card clicked!', { title, platform, contentType, link });
    
    // Don't trigger if clicking on the external link button or engagement buttons
    if ((e.target as HTMLElement).closest('a') || 
        (e.target as HTMLElement).closest('.engagement-buttons')) {
      return;
    }
    
    console.log('Setting isPopupOpen to true');
    setIsPopupOpen(true);
  };

  // Get content type icon
  const getContentTypeIcon = () => {
    if (contentType === 'video' || contentType === 'short') {
      return contentType === 'short' ? 
        <Video className="h-3 w-3 mr-1" /> : 
        <Video className="h-3 w-3 mr-1" />;
    } else if (contentType === 'post') {
      return <Image className="h-3 w-3 mr-1" />;
    } else if (contentType === 'reel') {
      return <Instagram className="h-3 w-3 mr-1" />;
    }
    return null;
  };

  return (
    <div 
      className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all group hover:transform hover:scale-[1.02] shadow-lg hover:shadow-xl duration-300 cursor-pointer"
      onClick={handleCardClick}
      aria-label={`${title} - Click to view content`}
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
          {duration && (
            <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {duration}
            </div>
          )}
          
          {category && (
            <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm text-primary-foreground font-medium text-xs rounded-full px-3 py-1">
              {category}
            </div>
          )}
          
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
              </div>
            </div>
          )}
          
          <div className="absolute bottom-2 left-2 flex items-center gap-2">
            <div className="text-white text-xs font-medium px-2 py-1 rounded bg-black/70 backdrop-blur-sm flex items-center">
              {getPlatformIcon()}
              {platform}
            </div>
            {contentType && <div className="text-white text-xs font-medium px-2 py-1 rounded bg-black/70 backdrop-blur-sm capitalize flex items-center">{getContentTypeIcon()}{contentType}</div>}
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="text-card-foreground text-sm font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 engagement-buttons">
            <div className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <Heart className="w-3.5 h-3.5" />
              <span className="text-xs">{likes}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-xs">{comments}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              <Share2 className="w-3.5 h-3.5" />
              <span className="text-xs">{shares}</span>
            </div>
          </div>
          
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
      
      {/* Content Popup */}
      <ContentPopup
        open={isPopupOpen}
        onOpenChange={setIsPopupOpen}
        title={title}
        url={link}
        platform={platform}
        contentType={contentType}
      />
    </div>
  );
};

export default ContentCard;
