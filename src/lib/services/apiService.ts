
import { Project, BlogPost, OtherWork, Content, Message, Meeting, Subscriber } from '@/lib/models';
import { useQuery } from '@tanstack/react-query';

// Dashboard stats interface
export interface DashboardStats {
  projects: {
    total: number;
    published: number;
    draft: number;
  };
  blogPosts: {
    total: number;
    published: number;
    draft: number;
  };
  otherWorks: {
    total: number;
    published: number;
    draft: number;
  };
  messages: {
    total: number;
    unread: number;
  };
  subscribers: {
    total: number;
    active: number;
  };
  meetings: {
    total: number;
    pending: number;
    confirmed: number;
  };
}

// Mock data (replace with actual API calls later)
let mockProjects: Project[] = [
  {
    id: "1",
    title: 'AI-Powered Social Media Dashboard',
    description: 'A dashboard that uses AI to analyze social media trends and engagement metrics.',
    imageUrl: '/lovable-uploads/63af4e30-199c-4e86-acf9-0c456ce84647.png',
    tags: ['React', 'Node.js', 'AI', 'TypeScript'],
    category: 'Web Application',
    link: 'https://github.com/example',
    githubLink: 'https://github.com/example',
    liveDemo: 'https://example.com',
    githubUrl: 'https://github.com/example',
    demoUrl: 'https://example.com',
    featured: true,
    status: 'Published',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: "2",
    title: 'E-commerce Mobile App',
    description: 'A mobile app for an e-commerce platform, built with React Native.',
    imageUrl: '/lovable-uploads/71ebdfd0-b894-428b-8b13-23379499b18b.png',
    tags: ['React Native', 'Mobile App', 'JavaScript'],
    category: 'Mobile Application',
    link: 'https://github.com/example',
    githubLink: 'https://github.com/example',
    liveDemo: 'https://example.com',
    featured: false,
    status: 'Published',
    createdAt: '2023-02-15T00:00:00.000Z',
    updatedAt: '2023-02-15T00:00:00.000Z',
  },
  {
    id: "3",
    title: 'Personal Portfolio Website',
    description: 'A personal portfolio website built with Next.js and Tailwind CSS.',
    imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80',
    tags: ['Next.js', 'Tailwind CSS', 'Web Design'],
    category: 'Website',
    link: 'https://github.com/example',
    githubLink: 'https://github.com/example',
    liveDemo: 'https://example.com',
    featured: true,
    status: 'Published',
    createdAt: '2023-03-10T00:00:00.000Z',
    updatedAt: '2023-03-10T00:00:00.000Z',
  },
];

let mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: 'The Future of AI in Web Development',
    excerpt: 'An article discussing the potential impact of AI on web development.',
    content: 'An article discussing the potential impact of AI on web development.',
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80',
    tags: ['AI', 'Web Development', 'JavaScript'],
    author: 'Gaurav Kr Sah',
    readTime: '5 min read',
    status: 'Published',
    featured: true,
    createdAt: '2023-04-01T00:00:00.000Z',
    updatedAt: '2023-04-01T00:00:00.000Z',
  },
  {
    id: "2",
    title: 'Mastering React Hooks',
    excerpt: 'A guide to understanding and using React Hooks effectively.',
    content: 'A guide to understanding and using React Hooks effectively.',
    imageUrl: 'https://images.unsplash.com/photo-1557683304-673a23048d34?auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Hooks', 'JavaScript'],
    author: 'Gaurav Kr Sah',
    readTime: '7 min read',
    status: 'Published',
    featured: false,
    createdAt: '2023-05-15T00:00:00.000Z',
    updatedAt: '2023-05-15T00:00:00.000Z',
  },
];

let mockOtherWorks: OtherWork[] = [
  {
    id: "1",
    title: 'Open Source Contribution to React Native Elements',
    description: 'Contributed a new component to the React Native Elements library.',
    content: 'Contributed a new component to the React Native Elements library.',
    category: 'Contribution',
    date: '2023-06-01',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    link: 'https://github.com/example',
    featured: true,
    status: 'Published',
    createdAt: '2023-06-01T00:00:00.000Z',
    updatedAt: '2023-06-01T00:00:00.000Z',
  },
  {
    id: "2",
    title: 'Created a Chrome Extension for Productivity',
    description: 'Developed a Chrome extension to help users stay focused and productive.',
    content: 'Developed a Chrome extension to help users stay focused and productive.',
    category: 'Extension',
    date: '2023-07-15',
    imageUrl: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?auto=format&fit=crop&w=800&q=80',
    link: 'https://github.com/example',
    featured: false,
    status: 'Published',
    createdAt: '2023-07-15T00:00:00.000Z',
    updatedAt: '2023-07-15T00:00:00.000Z',
  },
];

let mockVideos: Content[] = [
  {
    id: "1",
    title: 'Building a REST API with Node.js and Express',
    description: 'Learn how to build a REST API using Node.js and Express.',
    imageUrl: 'https://i.ytimg.com/vi/vjf774RKrLc/maxresdefault.jpg',
    thumbnailUrl: 'https://i.ytimg.com/vi/vjf774RKrLc/maxresdefault.jpg',
    platform: 'YouTube',
    duration: '20:30',
    likes: 1000,
    comments: 250,
    shares: 120,
    category: 'Tutorial',
    isVideo: true,
    link: 'https://www.youtube.com/watch?v=vjf774RKrLc',
    videoUrl: 'https://www.youtube.com/embed/vjf774RKrLc',
    views: 0,
    featured: true,
    status: 'Published',
    createdAt: '2023-08-01T00:00:00.000Z',
    updatedAt: '2023-08-01T00:00:00.000Z',
  },
  {
    id: "2",
    title: 'Getting Started with React Native',
    description: 'A beginner-friendly guide to React Native development.',
    imageUrl: 'https://i.ytimg.com/vi/qSRrxpdMpVc/maxresdefault.jpg',
    thumbnailUrl: 'https://i.ytimg.com/vi/qSRrxpdMpVc/maxresdefault.jpg',
    platform: 'YouTube',
    duration: '15:45',
    likes: 1500,
    comments: 320,
    shares: 200,
    category: 'Tutorial',
    isVideo: true,
    link: 'https://www.youtube.com/watch?v=qSRrxpdMpVc',
    videoUrl: 'https://www.youtube.com/embed/qSRrxpdMpVc',
    views: 0,
    featured: false,
    status: 'Published',
    createdAt: '2023-09-15T00:00:00.000Z',
    updatedAt: '2023-09-15T00:00:00.000Z',
  },
];

let mockMessages: Message[] = [
  {
    id: "1",
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Project Inquiry',
    message: 'Hello, I am interested in discussing a potential project. Could we schedule a call?',
    read: false,
    createdAt: '2023-10-01T00:00:00.000Z',
  },
  {
    id: "2",
    name: 'Jane Smith',
    email: 'jane@example.com',
    subject: 'Collaboration Opportunity',
    message: 'Hi there, I found your portfolio and would like to discuss a collaboration opportunity with you.',
    read: true,
    createdAt: '2023-10-05T00:00:00.000Z',
  },
  {
    id: "3",
    name: 'Michael Johnson',
    email: 'michael@example.com',
    subject: 'Speaking Engagement',
    message: 'We would like to invite you to speak at our upcoming tech conference in December.',
    read: false,
    createdAt: '2023-10-10T00:00:00.000Z',
  },
];

let mockMeetings: Meeting[] = [
  {
    id: "1",
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    subject: 'Initial Project Discussion',
    message: 'Looking forward to discussing the project requirements.',
    date: '2023-11-10',
    time: '10:00 AM',
    status: 'Confirmed',
    createdAt: '2023-10-15T00:00:00.000Z',
  },
  {
    id: "2",
    name: 'David Thompson',
    email: 'david@example.com',
    subject: 'Portfolio Review',
    message: 'Would like to get feedback on my portfolio design.',
    date: '2023-11-15',
    time: '2:00 PM',
    status: 'Pending',
    createdAt: '2023-10-20T00:00:00.000Z',
  },
];

let mockSubscribers: Subscriber[] = [
  {
    id: "1",
    email: 'subscriber1@example.com',
    name: 'Alex Turner',
    subscriptionDate: '2023-09-01T00:00:00.000Z',
    active: true,
  },
  {
    id: "2",
    email: 'subscriber2@example.com',
    name: 'Emily Davis',
    subscriptionDate: '2023-09-15T00:00:00.000Z',
    active: true,
  },
];

// Add a debounce utility function to prevent too frequent API calls
const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(...args: any[]) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Trigger the websocket notification when data is updated
const triggerWebSocketNotification = (event: string) => {
  const wsEvent = new CustomEvent('websocket_event', { 
    detail: { type: event } 
  });
  document.dispatchEvent(wsEvent);
  
  console.log(`WebSocket event triggered: ${event}`);
};

// Simulated API delay to mimic real API calls
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 300));

// Function to fetch all projects
export const getProjects = async (): Promise<Project[]> => {
  await simulateApiDelay();
  return mockProjects;
};

// Function to fetch a single project by ID
export const getProjectById = async (id: string): Promise<Project | undefined> => {
  await simulateApiDelay();
  return mockProjects.find(project => project.id === id);
};

// Function to fetch all blog posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  await simulateApiDelay();
  return mockBlogPosts;
};

// Function to fetch a single blog post by ID
export const getBlogPostById = async (id: string): Promise<BlogPost | undefined> => {
  await simulateApiDelay();
  return mockBlogPosts.find(blogPost => blogPost.id === id);
};

// Function to fetch all other works
export const getOtherWorks = async (): Promise<OtherWork[]> => {
  await simulateApiDelay();
  return mockOtherWorks;
};

// Function to fetch a single other work by ID
export const getOtherWorkById = async (id: string): Promise<OtherWork | undefined> => {
  await simulateApiDelay();
  return mockOtherWorks.find(otherWork => otherWork.id === id);
};

// Function to fetch all videos
export const getVideos = async (): Promise<Content[]> => {
  await simulateApiDelay();
  return mockVideos;
};

// Function to fetch a single video by ID
export const getVideoById = async (id: string): Promise<Content | undefined> => {
  await simulateApiDelay();
  return mockVideos.find(video => video.id === id);
};

// Update the functions to implement proper synchronization and WebSocket notifications

export const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
  await simulateApiDelay();
  
  const now = new Date().toISOString();
  const newProject: Project = {
    ...project,
    id: (mockProjects.length + 1).toString(),
    createdAt: now,
    updatedAt: now
  };
  
  mockProjects.push(newProject);
  triggerWebSocketNotification('project_updated');
  
  return newProject;
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
  await simulateApiDelay();
  
  const index = mockProjects.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Project with id ${id} not found`);
  }
  
  const updatedProject = {
    ...mockProjects[index],
    ...project,
    updatedAt: new Date().toISOString()
  };
  
  mockProjects[index] = updatedProject;
  triggerWebSocketNotification('project_updated');
  
  return updatedProject;
};

export const deleteProject = async (id: string): Promise<void> => {
  await simulateApiDelay();
  
  const index = mockProjects.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Project with id ${id} not found`);
  }
  
  mockProjects.splice(index, 1);
  triggerWebSocketNotification('project_updated');
};

export const createBlogPost = async (blogPost: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
  await simulateApiDelay();
  
  const now = new Date().toISOString();
  const newBlogPost: BlogPost = {
    ...blogPost,
    id: (mockBlogPosts.length + 1).toString(),
    createdAt: now,
    updatedAt: now,
    readingTime: blogPost.readTime || `${Math.floor(Math.random() * 10) + 3} min read`
  };
  
  mockBlogPosts.push(newBlogPost);
  triggerWebSocketNotification('blog_updated');
  
  return newBlogPost;
};

export const updateBlogPost = async (id: string, blogPost: Partial<BlogPost>): Promise<BlogPost> => {
  await simulateApiDelay();
  
  const index = mockBlogPosts.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Blog post with id ${id} not found`);
  }
  
  const updatedBlogPost = {
    ...mockBlogPosts[index],
    ...blogPost,
    updatedAt: new Date().toISOString()
  };
  
  mockBlogPosts[index] = updatedBlogPost;
  triggerWebSocketNotification('blog_updated');
  
  return updatedBlogPost;
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  await simulateApiDelay();
  
  const index = mockBlogPosts.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Blog post with id ${id} not found`);
  }
  
  mockBlogPosts.splice(index, 1);
  triggerWebSocketNotification('blog_updated');
};

export const createOtherWork = async (otherWork: Omit<OtherWork, 'id' | 'createdAt' | 'updatedAt'>): Promise<OtherWork> => {
  await simulateApiDelay();
  
  const now = new Date().toISOString();
  const newOtherWork: OtherWork = {
    ...otherWork,
    id: (mockOtherWorks.length + 1).toString(),
    createdAt: now,
    updatedAt: now
  };
  
  mockOtherWorks.push(newOtherWork);
  triggerWebSocketNotification('other_work_updated');
  
  return newOtherWork;
};

export const updateOtherWork = async (id: string, otherWork: Partial<OtherWork>): Promise<OtherWork> => {
  await simulateApiDelay();
  
  const index = mockOtherWorks.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Other work with id ${id} not found`);
  }
  
  const updatedOtherWork = {
    ...mockOtherWorks[index],
    ...otherWork,
    updatedAt: new Date().toISOString()
  };
  
  mockOtherWorks[index] = updatedOtherWork;
  triggerWebSocketNotification('other_work_updated');
  
  return updatedOtherWork;
};

export const deleteOtherWork = async (id: string): Promise<void> => {
  await simulateApiDelay();
  
  const index = mockOtherWorks.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Other work with id ${id} not found`);
  }
  
  mockOtherWorks.splice(index, 1);
  triggerWebSocketNotification('other_work_updated');
};

export const createVideo = async (video: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>): Promise<Content> => {
  await simulateApiDelay();
  
  const now = new Date().toISOString();
  const newVideo: Content = {
    ...video,
    id: (mockVideos.length + 1).toString(),
    createdAt: now,
    updatedAt: now,
    thumbnailUrl: video.thumbnailUrl || video.imageUrl,
    views: 0
  };
  
  mockVideos.push(newVideo);
  triggerWebSocketNotification('video_updated');
  
  return newVideo;
};

export const updateVideo = async (id: string, video: Partial<Content>): Promise<Content> => {
  await simulateApiDelay();
  
  const index = mockVideos.findIndex(v => v.id === id);
  if (index === -1) {
    throw new Error(`Video with id ${id} not found`);
  }
  
  if (video.imageUrl && !video.thumbnailUrl) {
    video.thumbnailUrl = video.imageUrl;
  }
  
  const updatedVideo = {
    ...mockVideos[index],
    ...video,
    updatedAt: new Date().toISOString()
  };
  
  mockVideos[index] = updatedVideo;
  triggerWebSocketNotification('video_updated');
  
  return updatedVideo;
};

export const deleteVideo = async (id: string): Promise<void> => {
  await simulateApiDelay();
  
  const index = mockVideos.findIndex(v => v.id === id);
  if (index === -1) {
    throw new Error(`Video with id ${id} not found`);
  }
  
  mockVideos.splice(index, 1);
  triggerWebSocketNotification('video_updated');
};

// Function to increment views for a video
export const incrementVideoViews = async (id: string): Promise<Content | undefined> => {
  await simulateApiDelay();

  const index = mockVideos.findIndex(v => v.id === id);
  if (index === -1) {
    throw new Error(`Video with id ${id} not found`);
  }

  if (mockVideos[index].views === undefined) {
    mockVideos[index].views = 0;
  }
  
  mockVideos[index].views = (mockVideos[index].views || 0) + 1;
  triggerWebSocketNotification('video_updated');
  return mockVideos[index];
};

// Add new functions for messages and dashboard stats
export const getMessages = async (): Promise<Message[]> => {
  await simulateApiDelay();
  return mockMessages;
};

export const getMessageById = async (id: string): Promise<Message | undefined> => {
  await simulateApiDelay();
  return mockMessages.find(message => message.id === id);
};

export const createMessage = async (message: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<Message> => {
  await simulateApiDelay();
  
  const now = new Date().toISOString();
  const newMessage: Message = {
    ...message,
    id: (mockMessages.length + 1).toString(),
    read: false,
    createdAt: now,
  };
  
  mockMessages.push(newMessage);
  triggerWebSocketNotification('message_updated');
  
  return newMessage;
};

export const markMessageAsRead = async (id: string): Promise<Message> => {
  await simulateApiDelay();
  
  const index = mockMessages.findIndex(m => m.id === id);
  if (index === -1) {
    throw new Error(`Message with id ${id} not found`);
  }
  
  mockMessages[index].read = true;
  triggerWebSocketNotification('message_updated');
  
  return mockMessages[index];
};

export const deleteMessage = async (id: string): Promise<void> => {
  await simulateApiDelay();
  
  const index = mockMessages.findIndex(m => m.id === id);
  if (index === -1) {
    throw new Error(`Message with id ${id} not found`);
  }
  
  mockMessages.splice(index, 1);
  triggerWebSocketNotification('message_updated');
};

// Dashboard stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  await simulateApiDelay();
  
  return {
    projects: {
      total: mockProjects.length,
      published: mockProjects.filter(p => p.status === 'Published').length,
      draft: mockProjects.filter(p => p.status === 'Draft').length,
    },
    blogPosts: {
      total: mockBlogPosts.length,
      published: mockBlogPosts.filter(p => p.status === 'Published').length,
      draft: mockBlogPosts.filter(p => p.status === 'Draft').length,
    },
    otherWorks: {
      total: mockOtherWorks.length,
      published: mockOtherWorks.filter(p => p.status === 'Published').length,
      draft: mockOtherWorks.filter(p => p.status === 'Draft').length,
    },
    messages: {
      total: mockMessages.length,
      unread: mockMessages.filter(m => !m.read).length,
    },
    subscribers: {
      total: mockSubscribers.length,
      active: mockSubscribers.filter(s => s.active).length,
    },
    meetings: {
      total: mockMeetings.length,
      pending: mockMeetings.filter(m => m.status === 'Pending').length,
      confirmed: mockMeetings.filter(m => m.status === 'Confirmed').length,
    },
  };
};

// Update the websocket service integration
export const setQueryClientForAPI = (queryClient: any) => {
  document.addEventListener('websocket_event', ((event: CustomEvent) => {
    const { type } = event.detail;
    
    switch (type) {
      case 'project_updated':
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        break;
      case 'blog_updated':
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
        break;
      case 'other_work_updated':
        queryClient.invalidateQueries({ queryKey: ['other-works'] });
        break;
      case 'video_updated':
        queryClient.invalidateQueries({ queryKey: ['videos'] });
        break;
      case 'message_updated':
        queryClient.invalidateQueries({ queryKey: ['messages'] });
        break;
      default:
        break;
    }
  }) as EventListener);
};
