import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
  githubLink?: string;
  liveDemo?: string;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tags,
  imageUrl,
  link,
  githubLink,
  liveDemo,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Extract project ID from link for direct navigation
  const projectId = link.split('/').pop();

  return (
    <motion.div 
      className={cn(
        "group relative overflow-hidden rounded-lg transition-all duration-300",
        "border border-white/5 hover:border-white/20 bg-neutral-900/30 backdrop-blur-sm",
        "h-full flex flex-col",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {/* Image */}
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={title}
          className={cn(
            "h-full w-full object-cover transition-transform duration-700",
            isHovered ? "scale-105 blur-[1px]" : "scale-100"
          )}
          loading="lazy"
        />
        
        {/* Overlay on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/70 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Hover content */}
        <motion.div
          className="absolute inset-0 p-5 flex flex-col justify-end pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <h3 className="font-medium text-lg text-white">{title}</h3>
            <p className="text-neutral-300 text-sm line-clamp-2">{description}</p>
            
            <Link 
              to={link || `/projects/${projectId || '1'}`} 
              className="inline-flex items-center text-green-400 text-sm group pointer-events-auto mt-3"
            >
              View Project
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Card content (always visible) */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="text-[10px] px-2 py-0.5 bg-white/5 text-green-400 rounded-full border border-green-500/10"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] text-neutral-500 flex items-center ml-1">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Title (visible when not hovered) */}
        <motion.h3 
          className="font-medium text-white text-base mb-2 line-clamp-1"
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
        
        <motion.p
          className="text-sm text-neutral-400 line-clamp-2 mb-3"
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {description}
        </motion.p>
        
        {/* Links */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <Link 
            to={link || `/projects/${projectId || '1'}`} 
            className="text-xs text-neutral-400 hover:text-green-400 transition-colors"
          >
            Details
          </Link>
          
          <div className="flex gap-3">
            {githubLink && (
              <a 
                href={githubLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-neutral-500 hover:text-white transition-colors"
                aria-label="View source code on GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            
            {liveDemo && (
              <a 
                href={liveDemo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-white transition-colors"
                aria-label="View live demo"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
