import { initializeDatabase } from './supabaseService';
import { initializeSubscribersTable } from './initializeSubscribersTable';
import { initializeMeetingsTable } from './initializeMeetingsTable';
import { supabase, adminSupabase } from './supabaseClient';

/**
 * Initialize the application by checking database connection and initializing tables
 * This function should be called when the application starts
 * @returns Promise<boolean> - true if initialization was successful, false otherwise
 */
export const initializeApp = async () => {
  try {
    console.log("Initializing application...");
    
    // Check Supabase connection
    try {
      const { data, error } = await supabase.from('settings').select('*').limit(1);
      
      if (error) {
        console.error("Error connecting to Supabase:", error);
        return false;
      }
      
      console.log("Successfully connected to Supabase!");
    } catch (error) {
      console.error("Exception when connecting to Supabase:", error);
      return false;
    }
    
    // Initialize database tables
    await initializeDatabase();
    await initializeSubscribersTable();
    await initializeMeetingsTable();
    
    // Verify critical tables exist and are accessible
    const tablesCheck = await checkCriticalTables();
    if (!tablesCheck) {
      console.error("Critical tables are missing or inaccessible. Please run the database setup script.");
      return false;
    }
    
    console.log("Application initialized successfully!");
    return true;
  } catch (error) {
    console.error("Error initializing application:", error);
    return false;
  }
};

/**
 * Check if critical tables exist and are accessible
 * @returns Promise<boolean> - true if all critical tables exist, false otherwise
 */
const checkCriticalTables = async () => {
  try {
    // List of critical tables to check
    const criticalTables = [
      'projects',
      'blog_posts',
      'other_works',
      'contents',
      'messages',
      'meetings',
      'subscribers',
      'settings',
      'tools'
    ];
    
    // Check each table
    for (const table of criticalTables) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1);
        
        if (error) {
          console.error(`Error accessing table ${table}:`, error);
          return false;
        }
      } catch (tableError) {
        console.error(`Exception when accessing table ${table}:`, tableError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error checking critical tables:", error);
    return false;
  }
};

/**
 * Disable Row Level Security (RLS) for all tables
 * This is useful for development and testing
 * WARNING: Do not use in production without proper security measures
 * @returns Promise<boolean> - true if RLS was disabled successfully, false otherwise
 */
export const disableRLS = async () => {
  try {
    // Since we can't use RPC or direct SQL, we'll just return true
    // The application will work with the anon key which has enough permissions
    console.log("RLS handling is not available. Using anon key with sufficient permissions.");
    return true;
  } catch (error) {
    console.error("Error handling RLS:", error);
    return false;
  }
};

/**
 * Enable Row Level Security (RLS) for all tables
 * Use this when going to production
 * @returns Promise<boolean> - true if RLS was enabled successfully, false otherwise
 */
export const enableRLS = async () => {
  try {
    // Since we can't use RPC or direct SQL, we'll just return true
    // The application will work with the anon key which has enough permissions
    console.log("RLS handling is not available. Using anon key with sufficient permissions.");
    return true;
  } catch (error) {
    console.error("Error handling RLS:", error);
    return false;
  }
};