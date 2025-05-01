
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  date: string;
  imageUrl?: string;
  tags?: string[];
  link: string;
  className?: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  title,
  excerpt,
  date,
  imageUrl,
  tags = [],
  link,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={cn(
        "group relative overflow-hidden bg-card text-card-foreground rounded-lg",
        "border border-border/40 hover:border-border/80",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imageUrl && (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500",
              isHovered ? "scale-105" : "scale-100"
            )}
            loading="lazy"
          />
        </div>
      )}
      
      <div className="flex flex-col p-2 space-y-1">
        <div>
          <div className="flex items-center justify-between mb-1">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 1).map((tag) => (
                  <span 
                    key={tag} 
                    className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-full text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 1 && (
                  <span className="text-[10px] text-muted-foreground">+{tags.length - 1}</span>
                )}
              </div>
            )}
            <time className="text-[10px] text-muted-foreground">{date}</time>
          </div>
          
          <h3 className="font-medium text-xs tracking-tight">{title}</h3>
        </div>
        
        <p className="text-muted-foreground text-xs line-clamp-2">{excerpt}</p>
        
        <Link 
          to={link} 
          className={cn(
            "inline-flex items-center text-xs font-medium",
            "text-primary hover:text-primary/80 transition-colors",
            "group-hover:underline"
          )}
        >
          Read more
          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default BlogPostCard;
