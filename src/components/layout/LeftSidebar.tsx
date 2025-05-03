import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github, Linkedin, Twitter, Home, FolderKanban, BookOpen, Layers, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';
import { cn } from '@/lib/utils';

const NavItem = ({
  icon: Icon,
  label,
  href,
  active = false
}: {
  icon: React.ElementType,
  label: string,
  href: string,
  active?: boolean
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 py-2 px-3 rounded-md transition-all hover:bg-gray-800 text-sm group z-50", // Increased z-index
        active ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
      )}
    >
      <Icon className={cn("w-4 h-4", active ? "text-[#FFB600]" : "text-gray-400 group-hover:text-[#FFB600]")} />
      <span>{label}</span>
    </Link>
  );
};

const LeftSidebar: React.FC = () => {
  const location = useLocation();

  const handleSubscribeClick = () => {
    if (typeof window !== 'undefined' && window.openSubscribePopup) {
      window.openSubscribePopup();
    }
  };

  const handleMessageClick = () => {
    if (typeof window !== 'undefined' && window.openMessagePopup) {
      window.openMessagePopup();
    }
  };

  return (
    <aside className="w-56 h-screen bg-black border-r border-gray-800 p-4 overflow-hidden relative">
      {/* Shooting Stars and Stars Background for visual effect - with z-index to keep them in the sidebar only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {/* Use different colors for sidebar background */}
        <ShootingStars
          starColor="#3b82f6"
          trailColor="#10b981"
          minSpeed={10}
          maxSpeed={25}
        />
        <StarsBackground
          starDensity={0.0001}
        />
      </div>
      <div className="flex flex-col h-full relative" style={{ zIndex: 10 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB600] to-[#e2eeff] flex items-center justify-center overflow-hidden border-2 border-gray-700">
          <div
  className="cursor-pointer w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center relative"
  onClick={() => console.log('Avatar clicked')}
>
  <img
    id="profile-img"
    src="https://i.pinimg.com/736x/4f/e1/d5/4fe1d50c67fe8ffbcc6cbc67a4510edc.jpg"
    alt="Gaurav's Profile"
    className="w-full h-full object-cover"
    onError={(e) => {
      const target = e.target as HTMLImageElement; // Type-cast the event target to HTMLImageElement
      target.style.display = 'none'; // Hide image if error occurs
      const fallbackText = document.getElementById('fallback-text');
      if (fallbackText) {
        fallbackText.style.display = 'block'; // Show fallback text
      }
    }}
  />
  <span
    id="fallback-text"
    className="text-white text-lg font-bold absolute"
    style={{ display: 'none' }} // Initially hidden
  >
    G
  </span>
</div>

          </div>
          <div>
            <h2 className="font-bold text-white">Gaurav Kr Sah</h2>
            <p className="text-gray-400 text-xs">Designer & Developer</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            size="sm"
            className="h-6 text-xs bg-[#FFB600] hover:bg-[#FFB600]/90 text-[#151515] font-medium px-2 py-0"
            onClick={handleSubscribeClick}
          >
            Subscribe
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-6 text-xs border-gray-700 hover:bg-gray-800 hover:text-white px-2 py-0"
            onClick={handleMessageClick}
          >
            Message
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-xs font-medium uppercase text-gray-500 mb-2 px-3">Navigation</p>
          <nav className="space-y-1 relative" style={{ zIndex: 50 }}>
            <NavItem
              icon={Home}
              label="Home"
              href="/"
              active={location.pathname === '/'}
            />
            <NavItem
              icon={FolderKanban}
              label="Projects"
              href="/projects"
              active={location.pathname === '/projects'}
            />
            <NavItem
              icon={BookOpen}
              label="Blogs"
              href="/blogs"
              active={location.pathname === '/blogs' || location.pathname.startsWith('/blogs/')}
            />
            <NavItem
              icon={Layers}
              label="Contents"
              href="/contents"
              active={location.pathname === '/contents'}
            />
            <NavItem
              icon={Mail}
              label="Contact"
              href="/contacts"
              active={location.pathname === '/contacts' || location.pathname === '/contact'}
            />
          </nav>
        </div>

        <div className="mt-auto">
          <div className="flex justify-center gap-2">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-md bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-md bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-md bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
