import React from 'react';
import { Sparkles, MessageCircle, Menu, X, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { useQuery } from '@tanstack/react-query';
import { getTools } from '@/lib/services/supabaseService';
import ToolCard from '@/components/ui/ToolCard';

const RightSidebar: React.FC = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['publishedTools'],
    queryFn: async () => {
      const allTools = await getTools();
      return allTools.filter(tool => tool.status === 'Published');
    }
  });
  
  const handleChatClick = () => {
    if (typeof window !== 'undefined' && window.openChatPopup) {
      window.openChatPopup();
    }
  };

  const sidebarContent = (
    <div className="z-20 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-amber-400 gap-1.5">
          <Sparkles className="w-3 h-3" />
          <span className="text-xs font-medium">Tools I Made</span>
        </div>
        {isMobile && (
          <button onClick={() => setOpen(false)} className="p-1 rounded-md text-gray-400 hover:bg-gray-800 z-20">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-2 z-20">
        <div className="flex flex-wrap justify-center gap-3">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500 text-xs">
              Error loading tools
            </div>
          ) : tools && tools.length > 0 ? (
            tools.map(tool => (
              <ToolCard 
                key={tool.id}
                title={tool.title}
                description={tool.description}
                toolUrl={tool.tool_url}
                imageUrl={tool.image_url}
                tags={tool.technologies || []}
                githubUrl={tool.github_url}
              />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 text-xs">
              No tools available
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // For desktop, show the sidebar normally
  if (!isMobile) {
    return (
      <aside className="w-56 h-screen bg-black border-l border-gray-800 p-4 overflow-hidden relative">
        {/* Shooting Stars and Stars Background for visual effect - different colors than the left sidebar */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <ShootingStars
            starColor="#8b5cf6"
            trailColor="#ec4899"
            minSpeed={12}
            maxSpeed={28}
          />
          <StarsBackground
            starDensity={0.0001}
            allStarsTwinkle={true}
          />
        </div>
        
        <div className="relative z-10 h-full overflow-auto">
          <div className="h-full overflow-y-auto pr-1 scrollbar-hide">
            {sidebarContent}
          </div>
        </div>
        
        <div className="fixed bottom-16 right-4 z-30">
          <Button 
            onClick={handleChatClick} 
            size="icon"
            className="h-10 w-10 rounded-full bg-[#FFB600] text-black hover:bg-[#FFB600]/90 transition-colors shadow-lg"
            aria-label="Open chat"
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
        </div>
      </aside>
    );
  }

  // For mobile, use a trigger button and sheet (drawer)
  return (
    <>
      <div className="fixed top-[60px] right-3 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-gray-800 text-white z-30"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open tools menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-black border-l border-gray-800 p-4 overflow-hidden relative">
            {/* Shooting Stars and Stars Background for sheet content */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <ShootingStars
                starColor="#8b5cf6"
                trailColor="#ec4899"
                minSpeed={12}
                maxSpeed={28}
              />
              <StarsBackground
                starDensity={0.0001}
                allStarsTwinkle={true}
              />
            </div>
            
            <div className="relative z-10 overflow-auto">
              <div className="h-full overflow-y-auto pr-1 scrollbar-hide">
                {sidebarContent}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default RightSidebar;
