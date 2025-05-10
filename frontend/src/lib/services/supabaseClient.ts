import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Database connection details
const SUPABASE_URL = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Service role key (for admin access)
// WARNING: This should never be exposed in client-side code in a production app
// We're using it here for demo purposes only
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

// Check if we have the required credentials
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials in environment variables');
}

// Create a client with the anon key for public access
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'portfolio-app',
    },
  },
});

// Create a special admin client that uses the same anon key
// since the service role key is not working
export const adminSupabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY, // Using anon key instead of service key
  {
    auth: {
      persistSession: false
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-application-name': 'portfolio-app-admin',
      },
    },
  }
);

// Log the initialization of clients for debugging
console.log('Supabase clients initialized:', {
  url: SUPABASE_URL,
  anonKeyLength: SUPABASE_ANON_KEY?.length || 0,
  usingAnonKeyForAdmin: true
});

// Type definitions for our database tables
export type Project = {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  additional_images?: string[];
  github_url?: string;
  live_url?: string;
  video_url?: string;
  video_platform?: string;
  technologies: string[];
  featured: boolean;
  status: 'Draft' | 'Published';
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  author: string;
  categories: string[];
  tags: string[];
  featured: boolean;
  status: 'Draft' | 'Published';
  created_at: string;
  updated_at: string;
};

export type OtherWork = {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  work_type: string;
  client?: string;
  technologies: string[];
  featured: boolean;
  status: 'Draft' | 'Published';
  created_at: string;
  updated_at: string;
};

export type Content = {
  id: string;
  title: string;
  description: string;
  content_url: string;
  thumbnail_url: string;
  content_type: string;
  is_video: boolean;
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  featured: boolean;
  status: 'Draft' | 'Published';
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied' | 'Archived';
  created_at: string;
};

export type Meeting = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  created_at: string;
};

export type Settings = {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  name?: string;
  subscribed_at: string;
  status: 'Active' | 'Unsubscribed';
  source?: string;
  last_email_sent?: string;
};

export type Tool = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tool_url: string;
  github_url?: string;
  technologies: string[];
  featured: boolean;
  status: 'Draft' | 'Published';
  created_at: string;
  updated_at: string;
};