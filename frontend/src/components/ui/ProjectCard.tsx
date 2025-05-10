import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
  meta?: string; // For e.g., date or custom string below image
  className?: string;
}

/**
 * A project card matching the FeaturedProjects.tsx card design,
 * with the entire card as a clickable Link and updated style.
 */
const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tags,
  imageUrl,
  link,
  meta,
  className,
}) => {
  const cardLink = link || `/projects/${link?.split('/').pop() || '1'}`;
  return (
    <Link
      to={cardLink}
      className={cn(
        "transition-all duration-300 group hover:scale-[1.015]",
        "bg-[#151515] rounded-xl overflow-hidden border border-[#FFB600] hover:border-[#FFB600] h-full shadow-md hover:shadow-lg",
        "flex flex-col min-h-[340px]",
        className
      )}
      style={{ textDecoration: 'none' }}
      tabIndex={0}
      aria-label={`View project: ${title}`}
    >
      {/* Image section with yellow tag badge */}
      <div className="aspect-video w-full relative overflow-hidden bg-neutral-800">
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {tags && tags.length > 0 && (
          <div className="absolute top-3 left-3 ">
            <span className="px-3 py-[0.25rem] bg-[#FFB600] text-[#151515] font-semibold text-xs rounded-full shadow-sm">
              {tags[0]}
            </span>
          </div>
        )}
      </div>
      {/* Content section */}
      <div className="flex flex-col flex-1 px-5 pt-4 pb-5">
        {/* Meta row (e.g., date) if any */}
        {meta && (
          <div className="mb-1 text-gray-300 text-xs flex items-center gap-2">
            {/* Optionally left icon here if needed in future */}
            {meta}
          </div>
        )}
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#FFB600] transition-colors">
          {title}
        </h3>
        <p
          className={cn(
            "text-gray-400 text-[15px] leading-relaxed mb-4",
            "line-clamp-4" // Show up to 4 lines (or remove this for full)
          )}
          style={{ minHeight: "4.5em" }} // Small helper for tidy 3+ lines
        >
          {description}
        </p>
        <div className="flex-1" />
        <div className="pt-1 flex items-center">
          <span className="text-[16px] text-[#FFB600] flex items-center font-bold group-hover:underline">
            View Project
            <ArrowRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
