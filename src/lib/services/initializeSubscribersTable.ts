import { adminSupabase } from './supabaseClient';

/**
 * Initialize the subscribers table with sample data
 * This ensures the table exists and has some initial data for testing
 */
export const initializeSubscribersTable = async () => {
  try {
    console.log("Initializing subscribers table...");
    
    // Check if the subscribers table exists
    const { error: tableCheckError } = await adminSupabase
      .from('subscribers')
      .select('id')
      .limit(1);
    
    if (tableCheckError) {
      console.error("Error checking subscribers table:", tableCheckError);
      return false;
    }
    
    // Check if there are any subscribers already
    const { data: existingSubscribers, error: countError } = await adminSupabase
      .from('subscribers')
      .select('id')
      .limit(1);
    
    if (countError) {
      console.error("Error checking existing subscribers:", countError);
      return false;
    }
    
    // If there are already subscribers, don't add more
    if (existingSubscribers && existingSubscribers.length > 0) {
      console.log("Subscribers table already has data, skipping initialization");
      return true;
    }
    
    // Sample subscribers data
    const sampleSubscribers = [
      {
        email: "subscriber1@example.com",
        name: "John Doe",
        status: "Active",
        source: "website"
      },
      {
        email: "subscriber2@example.com",
        name: "Jane Smith",
        status: "Active",
        source: "blog"
      },
      {
        email: "subscriber3@example.com",
        name: "Alex Johnson",
        status: "Active",
        source: "portfolio"
      }
    ];
    
    // Insert sample subscribers
    const { error: insertError } = await adminSupabase
      .from('subscribers')
      .insert(sampleSubscribers);
    
    if (insertError) {
      console.error("Error inserting sample subscribers:", insertError);
      return false;
    }
    
    console.log("Subscribers table initialized successfully!");
    return true;
  } catch (error) {
    console.error("Error initializing subscribers table:", error);
    return false;
  }
};