import { supabase, adminSupabase } from './supabaseClient';
import type { 
  Project, 
  BlogPost, 
  OtherWork, 
  Content, 
  Message, 
  Meeting, 
  Settings,
  Subscriber,
  Tool
} from './supabaseClient';

// Projects
export const getProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Project[];
  } catch (error) {
    console.error("Error getting projects:", error);
    return [];
  }
};

export const getFeaturedProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Project[];
  } catch (error) {
    console.error("Error getting featured projects:", error);
    return [];
  }
};

export const getProjectById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Project;
  } catch (error) {
    console.error("Error getting project:", error);
    return null;
  }
};

export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log("Creating project with admin client:", project);
    
    // Ensure technologies is an array
    if (typeof project.technologies === 'string') {
      project.technologies = (project.technologies as unknown as string).split(',').map(t => t.trim());
    }
    
    // Make sure technologies is not null or undefined
    if (!project.technologies) {
      project.technologies = [];
    }
    
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('projects')
      .insert([{
        ...project,
        featured: project.featured || false,
        status: project.status || 'Draft'
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Supabase error creating project:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    console.log("Project created successfully:", data);
    return data as Project;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('projects')
      .update({
        ...project,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Project;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { error } = await adminSupabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// Blog Posts
export const getBlogPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as BlogPost[];
  } catch (error) {
    console.error("Error getting blog posts:", error);
    return [];
  }
};

export const getFeaturedBlogPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as BlogPost[];
  } catch (error) {
    console.error("Error getting featured blog posts:", error);
    return [];
  }
};

export const getBlogPostById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as BlogPost;
  } catch (error) {
    console.error("Error getting blog post:", error);
    return null;
  }
};

export const createBlogPost = async (blogPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('blog_posts')
      .insert([{
        ...blogPost,
        featured: blogPost.featured || false,
        status: blogPost.status || 'Draft'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as BlogPost;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw new Error(`Failed to create blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateBlogPost = async (id: string, blogPost: Partial<BlogPost>) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('blog_posts')
      .update({
        ...blogPost,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as BlogPost;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { error } = await adminSupabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
};

// Other Works
export const getOtherWorks = async () => {
  try {
    const { data, error } = await supabase
      .from('other_works')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as OtherWork[];
  } catch (error) {
    console.error("Error getting other works:", error);
    return [];
  }
};

export const getFeaturedOtherWorks = async () => {
  try {
    const { data, error } = await supabase
      .from('other_works')
      .select('*')
      .eq('featured', true)
      .eq('status', 'Published')
      .limit(3);
    
    if (error) throw error;
    return data as OtherWork[];
  } catch (error) {
    console.error("Error getting featured other works:", error);
    return [];
  }
};

export const getOtherWorkById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('other_works')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as OtherWork;
  } catch (error) {
    console.error("Error getting other work:", error);
    return null;
  }
};

export const createOtherWork = async (work: Omit<OtherWork, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('other_works')
      .insert([{
        ...work,
        featured: work.featured || false,
        status: work.status || 'Draft'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as OtherWork;
  } catch (error) {
    console.error("Error creating other work:", error);
    throw new Error(`Failed to create other work: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateOtherWork = async (id: string, work: Partial<OtherWork>) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('other_works')
      .update({
        ...work,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as OtherWork;
  } catch (error) {
    console.error("Error updating other work:", error);
    throw error;
  }
};

export const deleteOtherWork = async (id: string) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { error } = await adminSupabase
      .from('other_works')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting other work:", error);
    throw error;
  }
};

// Contents/Videos
export const getContents = async () => {
  try {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Content[];
  } catch (error) {
    console.error("Error getting contents:", error);
    return [];
  }
};

export const getVideos = async () => {
  try {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .eq('is_video', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Content[];
  } catch (error) {
    console.error("Error getting videos:", error);
    return [];
  }
};

export const getFeaturedVideos = async () => {
  try {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .eq('is_video', true)
      .eq('featured', true)
      .eq('status', 'Published')
      .limit(2);
    
    if (error) throw error;
    return data as Content[];
  } catch (error) {
    console.error("Error getting featured videos:", error);
    return [];
  }
};

export const getFeaturedContents = async () => {
  try {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Content[];
  } catch (error) {
    console.error("Error getting featured contents:", error);
    return [];
  }
};

export const getContentById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Content;
  } catch (error) {
    console.error("Error getting content:", error);
    return null;
  }
};

export const createContent = async (content: Omit<Content, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('contents')
      .insert([{
        ...content,
        featured: content.featured || false,
        status: content.status || 'Draft',
        is_video: content.is_video || false,
        likes: content.likes || 0,
        comments: content.comments || 0,
        shares: content.shares || 0,
        views: content.views || 0
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Content;
  } catch (error) {
    console.error("Error creating content:", error);
    throw new Error(`Failed to create content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateContent = async (id: string, content: Partial<Content>) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('contents')
      .update({
        ...content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Content;
  } catch (error) {
    console.error("Error updating content:", error);
    throw error;
  }
};

export const deleteContent = async (id: string) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { error } = await adminSupabase
      .from('contents')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting content:", error);
    throw error;
  }
};

// Messages
export const getMessages = async () => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Message[];
  } catch (error) {
    console.error("Error getting messages:", error);
    return [];
  }
};

export const createMessage = async (message: Omit<Message, 'id' | 'created_at' | 'status'>) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('messages')
      .insert([{
        ...message,
        status: 'New'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Message;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

export const updateMessageStatus = async (id: string, status: Message['status']) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Message;
  } catch (error) {
    console.error("Error updating message status:", error);
    throw error;
  }
};

export const deleteMessage = async (id: string) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { error } = await adminSupabase
      .from('messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

// Meetings
export const getMeetings = async () => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data as Meeting[];
  } catch (error) {
    console.error("Error getting meetings:", error);
    return [];
  }
};

export const createMeeting = async (meeting: Omit<Meeting, 'id' | 'created_at' | 'status'>) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('meetings')
      .insert([{
        ...meeting,
        status: 'Pending'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Meeting;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};

export const updateMeetingStatus = async (id: string, status: Meeting['status']) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('meetings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Meeting;
  } catch (error) {
    console.error("Error updating meeting status:", error);
    throw error;
  }
};

export const deleteMeeting = async (id: string) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { error } = await adminSupabase
      .from('meetings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting meeting:", error);
    throw error;
  }
};

// Settings
export const getSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');
    
    if (error) throw error;
    
    // Convert to key-value object
    const settings: Record<string, string> = {};
    (data as Settings[]).forEach(setting => {
      settings[setting.key] = setting.value;
    });
    
    return settings;
  } catch (error) {
    console.error("Error getting settings:", error);
    return {};
  }
};

export const updateSetting = async (key: string, value: string) => {
  try {
    // Check if setting exists
    const { data: existingData } = await adminSupabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();
    
    if (existingData) {
      // Update existing setting
      const { data, error } = await adminSupabase
        .from('settings')
        .update({ 
          value,
          updated_at: new Date().toISOString()
        })
        .eq('key', key)
        .select()
        .single();
      
      if (error) throw error;
      return data as Settings;
    } else {
      // Create new setting
      const { data, error } = await adminSupabase
        .from('settings')
        .insert([{
          key,
          value
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as Settings;
    }
  } catch (error) {
    console.error("Error updating setting:", error);
    throw error;
  }
};

// Subscribers
export const getSubscribers = async () => {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    
    if (error) throw error;
    return data as Subscriber[];
  } catch (error) {
    console.error("Error getting subscribers:", error);
    return [];
  }
};

export const getActiveSubscribers = async () => {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('status', 'Active')
      .order('subscribed_at', { ascending: false });
    
    if (error) throw error;
    return data as Subscriber[];
  } catch (error) {
    console.error("Error getting active subscribers:", error);
    return [];
  }
};

export const getSubscriberById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Subscriber;
  } catch (error) {
    console.error("Error getting subscriber:", error);
    return null;
  }
};

export const createSubscriber = async (subscriber: Omit<Subscriber, 'id' | 'subscribed_at' | 'status'>) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('subscribers')
      .insert([{
        ...subscriber,
        status: 'Active'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Subscriber;
  } catch (error) {
    console.error("Error creating subscriber:", error);
    throw new Error(`Failed to create subscriber: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateSubscriber = async (id: string, subscriber: Partial<Subscriber>) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('subscribers')
      .update(subscriber)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Subscriber;
  } catch (error) {
    console.error("Error updating subscriber:", error);
    throw error;
  }
};

export const deleteSubscriber = async (id: string) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { error } = await adminSupabase
      .from('subscribers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    throw error;
  }
};

// Tools
export const getTools = async () => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Tool[];
  } catch (error) {
    console.error("Error getting tools:", error);
    return [];
  }
};

export const getToolById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Tool;
  } catch (error) {
    console.error("Error getting tool:", error);
    return null;
  }
};

export const createTool = async (tool: Omit<Tool, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('tools')
      .insert([{
        ...tool,
        featured: tool.featured || false,
        status: tool.status || 'Draft'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Tool;
  } catch (error) {
    console.error("Error creating tool:", error);
    throw new Error(`Failed to create tool: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateTool = async (id: string, tool: Partial<Tool>) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { data, error } = await adminSupabase
      .from('tools')
      .update({
        ...tool,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Tool;
  } catch (error) {
    console.error("Error updating tool:", error);
    throw error;
  }
};

export const deleteTool = async (id: string) => {
  try {
    // Use adminSupabase client to bypass RLS
    const { error } = await adminSupabase
      .from('tools')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting tool:", error);
    throw error;
  }
};

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    // Get projects count
    const { count: projectsCount, error: projectsError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });
    
    if (projectsError) throw projectsError;
    
    // Get blog posts count
    const { count: blogPostsCount, error: blogPostsError } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    
    if (blogPostsError) throw blogPostsError;
    
    // Get videos count
    const { count: videosCount, error: videosError } = await supabase
      .from('contents')
      .select('*', { count: 'exact', head: true })
      .eq('is_video', true);
    
    if (videosError) throw videosError;
    
    // Get other works count
    const { count: otherWorksCount, error: otherWorksError } = await supabase
      .from('other_works')
      .select('*', { count: 'exact', head: true });
    
    if (otherWorksError) throw otherWorksError;
    
    // Get messages count
    const { count: messagesCount, error: messagesError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });
    
    if (messagesError) throw messagesError;
    
    // Get meetings count
    const { count: meetingsCount, error: meetingsError } = await supabase
      .from('meetings')
      .select('*', { count: 'exact', head: true });
    
    if (meetingsError) throw meetingsError;
    
    // Get subscribers count
    const { count: subscribersCount, error: subscribersError } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true });
    
    if (subscribersError) throw subscribersError;
    
    // Get tools count
    const { count: toolsCount, error: toolsError } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });
    
    if (toolsError) throw toolsError;
    
    return {
      projects: projectsCount || 0,
      blogPosts: blogPostsCount || 0,
      videos: videosCount || 0,
      otherWorks: otherWorksCount || 0,
      messages: messagesCount || 0,
      meetings: meetingsCount || 0,
      subscribers: subscribersCount || 0,
      tools: toolsCount || 0
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return {
      projects: 0,
      blogPosts: 0,
      videos: 0,
      otherWorks: 0,
      messages: 0,
      meetings: 0,
      subscribers: 0,
      tools: 0
    };
  }
};

// Initialize database with some basic collections if they don't exist
export const initializeDatabase = async () => {
  try {
    // Check if settings table has any entries
    const { data: settingsData, error: settingsError } = await adminSupabase
      .from('settings')
      .select('*');
    
    if (settingsError) throw settingsError;
    
    // If no settings, add some default ones
    if (!settingsData || settingsData.length === 0) {
      await adminSupabase.from('settings').insert([
        { key: 'site_title', value: 'My Portfolio' },
        { key: 'site_description', value: 'A showcase of my work and skills' },
        { key: 'contact_email', value: 'hello@gauravsah.com.np' },
        { key: 'social_twitter', value: 'https://twitter.com/example' },
        { key: 'social_linkedin', value: 'https://linkedin.com/in/example' },
        { key: 'social_github', value: 'https://github.com/example' }
      ]);
    }

    // Check if subscribers table has any entries
    const { data: subscribersData, error: subscribersError } = await adminSupabase
      .from('subscribers')
      .select('*');
    
    if (subscribersError) {
      console.log("Creating subscribers table...");
      // Table doesn't exist yet, it will be created when we run the SQL script
    }

    // Check if tools table has any entries
    const { data: toolsData, error: toolsError } = await adminSupabase
      .from('tools')
      .select('*');
    
    if (toolsError) {
      console.log("Creating tools table...");
      // Table doesn't exist yet, it will be created when we run the SQL script
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
};

// Export Supabase instance in case it's needed elsewhere
export { supabase, adminSupabase };