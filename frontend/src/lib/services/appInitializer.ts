import { supabase } from './supabaseClient';

/**
 * Initialize the application by checking database connection
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
      return true;
    } catch (error) {
      console.error("Exception when connecting to Supabase:", error);
      return false;
    }
  } catch (error) {
    console.error("Error initializing application:", error);
    return false;
  }
};

/**
 * This function is only needed in development environment
 * and should be removed in production
 */
export const disableRLS = async () => {
  console.warn("This function should not be used in production");
  return true;
};