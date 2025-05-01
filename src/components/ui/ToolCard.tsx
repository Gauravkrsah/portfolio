import React from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  toolUrl: string;
  githubUrl?: string;
  className?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  tags,
  imageUrl,
  toolUrl,
  githubUrl,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // Generate a random gradient for each card
  const gradients = [
    "from-blue-500/20 to-purple-500/20",
    "from-green-500/20 to-blue-500/20",
    "from-purple-500/20 to-pink-500/20",
    "from-amber-500/20 to-red-500/20",
    "from-teal-500/20 to-green-500/20",
  ];
  
  const randomGradient = React.useMemo(() => {
    return gradients[Math.floor(Math.random() * gradients.length)];
  }, []);

  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden rounded-xl transition-all duration-300 transform",
        "border border-white/5 bg-black/30 backdrop-blur-sm shadow-lg",
        "h-[150px] w-[150px]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0.9 }}
      whileHover={{ 
        scale: 1.08,
        opacity: 1,
        boxShadow: "0 10px 25px -5px rgba(255, 182, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.3)"
      }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 15
      }}
    >
      {/* Background gradient */}
      <motion.div 
        className={`absolute inset-0 bg-gradient-to-br ${randomGradient}`}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: isHovered ? 0.6 : 0.3 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full w-full p-3 flex flex-col">
        {/* Title */}
        <h3 className="font-bold text-white text-sm mb-1 truncate">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-xs text-white/70 line-clamp-2 mb-2">
          {description}
        </p>
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto mb-2">
            {tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="text-[8px] px-1.5 py-0.5 bg-white/10 text-white/90 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="mt-auto flex justify-between items-center">
          <a 
            href={toolUrl}
            target="_blank"
            rel="noopener noreferrer"
 
            className="text-[10px] font-medium text-[#FFB600] hover:text-[#FFB600]/80 transition-colors"
          >
            Try Tool
          </a>
          
          <div className="flex gap-2">
            {githubUrl && (
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/50 hover:text-[#FFB600] transition-colors"
                aria-label="View source code on GitHub"
              >
                <Github className="h-3 w-3" />
              </a>
            )}
            <a 
              href={toolUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/50 hover:text-[#FFB600] transition-colors"
              aria-label="Open tool"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Hover effects */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Image overlay (visible on hover) */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.15 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={imageUrl || '/placeholder.svg'}
          alt=""
          className="w-full h-full object-cover filter blur-[2px]"
        />
      </motion.div>
      
      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
 
          boxShadow: isHovered ? "inset 0 0 0 1.5px rgba(255, 182, 0, 0.3)" : "inset 0 0 0 0px rgba(255, 255, 255, 0)"
        }}
 
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default ToolCard;