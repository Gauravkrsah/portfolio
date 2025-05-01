
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Calendar, ArrowRight, Search } from 'lucide-react';

const categories = [
  "All",
  "Talks",
  "Workshops",
  "Consultations",
  "UX Research",
  "Open Source"
];

const otherWorks = [
  {
    id: "1",
    title: "UX Workshop at Design Conference 2023",
    description: "Led an interactive workshop on user-centered design principles for over 200 attendees",
    category: "Workshops",
    date: "June 15, 2023",
    imageUrl: "https://images.unsplash.com/photo-1536148935331-408321065b18?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "2",
    title: "UX Research for Non-Profit Education Platform",
    description: "Conducted comprehensive user research to improve the learning experience for an educational non-profit",
    category: "UX Research",
    date: "January - March 2023",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "3",
    title: "Contributed to React Native Navigation Library",
    description: "Developed and contributed key features to an open source React Native navigation library",
    category: "Open Source",
    date: "November 2022",
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "4",
    title: "Keynote Speaker at JavaScript Conference",
    description: "Delivered a keynote presentation on the future of front-end development and emerging web technologies",
    category: "Talks",
    date: "September 2022",
    imageUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "5",
    title: "UX Audit for E-commerce Platform",
    description: "Performed a detailed UX audit for a major e-commerce platform, leading to a 30% improvement in conversion rates",
    category: "Consultations",
    date: "July 2022",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "6",
    title: "Technical Review for Web Development Book",
    description: "Served as a technical reviewer for 'Advanced React Patterns', ensuring accuracy and relevance of content",
    category: "Consultations",
    date: "May 2022",
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80"
  },
];

const OtherWorks: React.FC = () => {
  useEffect(() => {
    document.title = "Other Works | Gaurav Kr Sah";
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredWorks, setFilteredWorks] = useState(otherWorks);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Filter works based on category and search query
    const filtered = otherWorks.filter(work => {
      const matchesCategory = activeCategory === "All" || work.category === activeCategory;
      const matchesSearch = 
        work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        work.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
    
    setFilteredWorks(filtered);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className="sticky top-0 h-screen">
        <LeftSidebar />
      </div>
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-screen">
          <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100" : "opacity-0 translate-y-4"
            )}>
              <h1 className="text-2xl font-bold mb-1">Other Works</h1>
              <p className="text-gray-400 text-sm mb-6">A collection of my consulting, speaking, research, and contributions</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs transition-colors",
                        activeCategory === category 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                  <input
                    type="text"
                    placeholder="Search works..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white w-full sm:w-56 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>
              
              {filteredWorks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredWorks.map((work, index) => (
                    <div 
                      key={work.id}
                      className={cn(
                        "transition-all duration-700",
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                      )}
                      style={{ transitionDelay: `${index * 100 + 200}ms` }}
                    >
                      <div className="glass-card rounded-lg overflow-hidden h-full flex flex-col group">
                        <div className="relative h-32 overflow-hidden">
                          <img 
                            src={work.imageUrl} 
                            alt={work.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 bg-blue-600/80 backdrop-blur-sm text-white text-[10px] rounded-full">
                              {work.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 flex flex-col flex-grow">
                          <div className="flex items-center text-gray-400 text-[10px] mb-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {work.date}
                          </div>
                          <h3 className="text-sm font-bold mb-1 transition-colors group-hover:text-blue-400 line-clamp-1">{work.title}</h3>
                          <p className="text-gray-400 text-xs mb-2 flex-grow line-clamp-2">{work.description}</p>
                          <Link 
                            to={`/other-works/${work.id}`}
                            className="inline-flex items-center text-xs text-blue-500 hover:text-blue-400 transition-colors"
                          >
                            View Details <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-gray-400 text-sm">
                    No works match your current filters. Try adjusting your search or category selection.
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </main>
      <div className="sticky top-0 h-screen">
        <RightSidebar />
      </div>
    </div>
  );
};

export default OtherWorks;
