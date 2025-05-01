
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Calendar, ExternalLink, Clock, User } from 'lucide-react';

// Simulated other works data
const otherWorksData = [
  {
    id: '1',
    title: 'UX Workshop at Design Conference 2023',
    description: 'Led an interactive workshop on user-centered design principles for over 200 attendees',
    content: `
      <p>In June 2023, I had the privilege of leading a hands-on UX workshop at the prestigious Design Conference 2023. This workshop focused on practical applications of user-centered design principles and attracted over 200 participants from various backgrounds in design, development, and product management.</p>
      
      <h2>Workshop Overview</h2>
      
      <p>The workshop was structured as a three-hour interactive session with both theoretical components and practical exercises. Participants were guided through the entire UX design process, from initial user research to prototype testing.</p>
      
      <p>Key topics covered included:</p>
      
      <ul>
        <li>Conducting effective user interviews</li>
        <li>Creating user personas based on research</li>
        <li>Journey mapping and identifying pain points</li>
        <li>Rapid prototyping techniques</li>
        <li>Guerrilla usability testing methods</li>
      </ul>
      
      <h2>Hands-on Activities</h2>
      
      <p>What made this workshop particularly effective was the emphasis on practical application. Participants were divided into small teams and given a real-world design challenge to solve using the techniques learned during the session.</p>
      
      <p>Each team went through an accelerated design thinking process, creating rough prototypes that were then tested with other workshop participants. This hands-on approach allowed attendees to immediately apply the concepts and see their value in practice.</p>
      
      <h2>Outcomes and Feedback</h2>
      
      <p>The workshop received overwhelmingly positive feedback, with participants particularly appreciating the balance between theory and practice. Many attendees reported that they were able to implement the techniques in their workplaces immediately following the conference.</p>
      
      <p>Some notable feedback included:</p>
      
      <blockquote>
        <p>"This was the most useful workshop I've attended at a conference. The practical exercises really helped solidify the concepts."</p>
        <cite>- Senior Product Designer</cite>
      </blockquote>
      
      <blockquote>
        <p>"I've always struggled with user research, but the techniques taught in this workshop made it seem much more approachable. I've already started using the interview framework with my team."</p>
        <cite>- UX Designer</cite>
      </blockquote>
      
      <h2>Resources Shared</h2>
      
      <p>As part of the workshop, I created and shared several resources with attendees:</p>
      
      <ul>
        <li>A comprehensive UX research toolkit</li>
        <li>Templates for user personas and journey maps</li>
        <li>Checklist for conducting effective usability tests</li>
        <li>Recommended tools for different stages of the UX process</li>
      </ul>
      
      <p>These resources were designed to help participants continue applying the workshop principles in their day-to-day work.</p>
      
      <h2>Impact and Future Workshops</h2>
      
      <p>Following the success of this workshop, I've been invited to present it at several other conferences and corporate training sessions. I'm continuously refining the content based on feedback and evolving industry practices.</p>
      
      <p>The workshop has evolved into an ongoing program that has now reached over 500 designers and product professionals, helping to promote user-centered design practices across the industry.</p>
    `,
    category: 'Workshop',
    date: 'June 15, 2023',
    duration: '3 hours',
    location: 'San Francisco, CA',
    externalLink: 'https://designconference2023.example.com/workshops',
    imageUrl: 'https://images.unsplash.com/photo-1536148935331-408321065b18?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'UX Research for Non-Profit Education Platform',
    description: 'Conducted comprehensive user research to improve the learning experience for an educational non-profit',
    content: `
      <p>In early 2023, I had the opportunity to lead a pro bono UX research project for EducateAll, a non-profit organization dedicated to providing free educational resources to underserved communities. The organization had developed an online learning platform but was struggling with user engagement and course completion rates.</p>
      
      <h2>Challenge</h2>
      
      <p>The primary challenges facing EducateAll were:</p>
      
      <ul>
        <li>Low course completion rates (less than 15%)</li>
        <li>Difficulty in attracting and retaining users</li>
        <li>Limited understanding of their users' needs and constraints</li>
        <li>Resource constraints typical of non-profit organizations</li>
      </ul>
      
      <p>The organization needed to better understand their users' experiences to make informed decisions about platform improvements, but lacked the expertise and resources to conduct proper UX research.</p>
      
      <h2>Research Approach</h2>
      
      <p>Working with a small team of volunteer UX researchers, I designed and implemented a comprehensive research plan that included:</p>
      
      <h3>1. Quantitative Analysis</h3>
      
      <p>We began by analyzing existing platform data to identify patterns and potential problem areas:</p>
      
      <ul>
        <li>User registration and dropout points</li>
        <li>Navigation paths through the platform</li>
        <li>Time spent on different sections</li>
        <li>Course selection and completion patterns</li>
      </ul>
      
      <h3>2. Qualitative Research</h3>
      
      <p>To gain deeper insights into user needs and behaviors, we conducted:</p>
      
      <ul>
        <li>15 in-depth interviews with users from different demographic backgrounds</li>
        <li>5 contextual inquiry sessions observing users in their typical learning environments</li>
        <li>3 focus groups with teachers who were recommending the platform to students</li>
      </ul>
      
      <h3>3. Usability Testing</h3>
      
      <p>We ran moderated usability tests with 12 users of varying tech proficiency levels, focusing on:</p>
      
      <ul>
        <li>Course discovery and enrollment</li>
        <li>Navigation between lessons</li>
        <li>Interaction with various content types (video, text, quizzes)</li>
        <li>Progress tracking and certificate acquisition</li>
      </ul>
      
      <h2>Key Findings</h2>
      
      <p>Our research revealed several critical insights:</p>
      
      <h3>Connectivity Challenges</h3>
      
      <p>Many users were accessing the platform from areas with unreliable internet connections. Video-heavy content was causing frustration as it frequently buffered or failed to load. Users expressed a strong preference for text and image-based content that could load quickly.</p>
      
      <h3>Mobile Usage Patterns</h3>
      
      <p>Contrary to the organization's assumptions, over 78% of users were primarily accessing the platform via mobile devices, often with smaller screens and limited data plans. The desktop-optimized interface was causing navigation difficulties on mobile.</p>
      
      <h3>Learning Context</h3>
      
      <p>Users were typically studying in short bursts (15-20 minutes) between other activities, rather than in longer dedicated sessions. Content structured for hour-long study sessions wasn't aligning with actual usage patterns.</p>
      
      <h3>Motivation and Recognition</h3>
      
      <p>Users expressed a strong desire for recognition of their achievements. The existing certificate system was only available upon full course completion, which was demotivating for many users who valued incremental progress recognition.</p>
      
      <h2>Recommendations and Implementation</h2>
      
      <p>Based on our findings, we developed a set of actionable recommendations:</p>
      
      <ol>
        <li>Restructure courses into shorter, modular lessons (5-15 minutes each)</li>
        <li>Create text/image versions of all video content</li>
        <li>Implement a responsive, mobile-first redesign of the interface</li>
        <li>Develop an offline mode for content access without constant connectivity</li>
        <li>Introduce milestone certificates and achievement badges</li>
        <li>Simplify navigation with a persistent progress indicator</li>
      </ol>
      
      <p>The EducateAll team implemented these changes incrementally over six months, prioritizing based on potential impact and development complexity.</p>
      
      <h2>Results</h2>
      
      <p>Six months after implementing the recommended changes, EducateAll saw significant improvements:</p>
      
      <ul>
        <li>Course completion rates increased from 15% to 42%</li>
        <li>User registration increased by 64%</li>
        <li>Average time spent on the platform increased by 35%</li>
        <li>User satisfaction scores improved from 6.2/10 to 8.7/10</li>
      </ul>
      
      <h2>Impact</h2>
      
      <p>This project demonstrated how targeted UX research could dramatically improve educational outcomes for underserved communities. The improvements to the platform made education more accessible to thousands of users who previously struggled with the interface or technical limitations.</p>
      
      <p>Additionally, the research methodology and findings have been shared as a case study for other educational non-profits, extending the impact beyond just one organization.</p>
    `,
    category: 'UX Research',
    date: 'January - March 2023',
    duration: '3 months',
    location: 'Remote',
    contributor: 'Gaurav Kr Sah (Lead UX Researcher)',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
  },
  // More works data would be here
];

const OtherWorkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [work, setWork] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Other Work Detail | Gaurav Kr Sah";
    
    // Simulate API call to fetch work data
    setTimeout(() => {
      const foundWork = otherWorksData.find(w => w.id === id);
      setWork(foundWork);
      setIsLoading(false);
      
      if (foundWork) {
        document.title = `${foundWork.title} | Gaurav Kr Sah`;
      }
    }, 500);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-black text-white">
        <div className="sticky top-0 h-screen">
          <LeftSidebar />
        </div>
        <main className="flex-1 p-8 flex justify-center items-center">
          <div className="animate-pulse space-y-8 w-full max-w-3xl">
            <div className="h-8 bg-gray-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2"></div>
            <div className="h-64 bg-gray-800 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded"></div>
              <div className="h-4 bg-gray-800 rounded"></div>
            </div>
          </div>
        </main>
        <div className="sticky top-0 h-screen">
          <RightSidebar />
        </div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="flex min-h-screen bg-black text-white">
        <div className="sticky top-0 h-screen">
          <LeftSidebar />
        </div>
        <main className="flex-1 p-8 flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold mb-4">Work Not Found</h1>
          <p className="text-gray-400 mb-6">The work you're looking for doesn't exist or has been removed.</p>
          <Link to="/other-works" className="flex items-center text-blue-500 hover:text-blue-400">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Other Works
          </Link>
        </main>
        <div className="sticky top-0 h-screen">
          <RightSidebar />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <div className="sticky top-0 h-screen">
        <LeftSidebar />
      </div>
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-screen">
          <div className="p-8">
            <div className="max-w-3xl mx-auto">
              <Link to="/other-works" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Other Works
              </Link>
              
              <article className="space-y-8">
                <header className="space-y-6">
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight">{work.title}</h1>
                  <p className="text-xl text-gray-400">{work.description}</p>
                  
                  <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p>{work.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p>{work.duration}</p>
                      </div>
                    </div>
                    
                    {work.location && (
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p>{work.location}</p>
                      </div>
                    )}
                    
                    {work.contributor && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Contributor</p>
                          <p>{work.contributor}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <span className="inline-block px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                    {work.category}
                  </span>
                </header>
                
                <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
                  <img 
                    src={work.imageUrl} 
                    alt={work.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div 
                  className="prose prose-invert max-w-none text-gray-300 lg:text-lg"
                  dangerouslySetInnerHTML={{ __html: work.content }}
                />
                
                {work.externalLink && (
                  <div className="mt-8">
                    <a 
                      href={work.externalLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md py-3 px-6 transition-colors w-full md:w-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Visit Project Website</span>
                    </a>
                  </div>
                )}
              </article>
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

export default OtherWorkDetail;
