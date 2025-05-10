
// Portfolio content types

export interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  tags: string[];
  category: string;
  imageUrl: string;
  link: string;
  githubLink?: string;
  liveDemo?: string;
  githubUrl?: string; // Added to match ProjectDetail usage
  demoUrl?: string;   // Added to match ProjectDetail usage
  featured: boolean;
  status: 'Draft' | 'Published';
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl: string;
  tags: string[];
  author: string;
  readTime: string;
  status: 'Draft' | 'Published';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  readingTime?: string; // Fix for readingTime vs readTime inconsistency in apiService
}

export interface OtherWork {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: string;
  date: string;
  imageUrl: string;
  link?: string;
  featured: boolean;
  status: 'Draft' | 'Published';
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  platform: string;
  duration: string;
  likes: number;
  comments: number;
  shares: number;
  category: string;
  isVideo: boolean;
  link: string;
  videoUrl?: string; // Added to match VideosHero usage
  views?: number;     // Added to match apiService usage
  featured: boolean;
  status: 'Draft' | 'Published';
  createdAt: string;
  updatedAt: string;
}

export type Video = Content;

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Meeting {
  id: string;
  name: string;
  email: string;
  subject: string;
  message?: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscriptionDate: string;
  active: boolean;
}
