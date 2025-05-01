import { adminSupabase } from './supabaseClient';

/**
 * Initialize the meetings table with sample data
 * This ensures the table exists and has some initial data for testing
 */
export const initializeMeetingsTable = async () => {
  try {
    console.log("Initializing meetings table...");
    
    // Check if the meetings table exists
    const { error: tableCheckError } = await adminSupabase
      .from('meetings')
      .select('id')
      .limit(1);
    
    if (tableCheckError) {
      console.error("Error checking meetings table:", tableCheckError);
      return false;
    }
    
    // Check if there are any meetings already
    const { data: existingMeetings, error: countError } = await adminSupabase
      .from('meetings')
      .select('id')
      .limit(1);
    
    if (countError) {
      console.error("Error checking existing meetings:", countError);
      return false;
    }
    
    // If there are already meetings, don't add more
    if (existingMeetings && existingMeetings.length > 0) {
      console.log("Meetings table already has data, skipping initialization");
      return true;
    }
    
    // Get current date and add days to it for sample meetings
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // Sample meetings data
    const sampleMeetings = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        date: tomorrow.toISOString().split('T')[0],
        time: "10:00:00",
        duration: 60,
        topic: "Project Discussion",
        notes: "Initial consultation about the new website project",
        status: "Confirmed",
        subject: "Website Project Discussion",
        message: "Looking forward to discussing the project requirements"
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1987654321",
        date: dayAfterTomorrow.toISOString().split('T')[0],
        time: "14:30:00",
        duration: 45,
        topic: "UI/UX Review",
        notes: "Review of the latest design mockups",
        status: "Pending",
        subject: "Design Review Meeting",
        message: "Need feedback on the latest UI designs"
      },
      {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        date: nextWeek.toISOString().split('T')[0],
        time: "11:00:00",
        duration: 30,
        topic: "Quick Consultation",
        notes: "Brief discussion about potential collaboration",
        status: "Pending",
        subject: "Potential Collaboration",
        message: "Interested in discussing how we might work together"
      }
    ];
    
    // Insert sample meetings
    const { error: insertError } = await adminSupabase
      .from('meetings')
      .insert(sampleMeetings);
    
    if (insertError) {
      console.error("Error inserting sample meetings:", insertError);
      return false;
    }
    
    console.log("Meetings table initialized successfully!");
    return true;
  } catch (error) {
    console.error("Error initializing meetings table:", error);
    return false;
  }
};