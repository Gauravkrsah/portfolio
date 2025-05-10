// Mock Email Service
// This service logs email content to the console instead of sending real emails

// Interface for meeting data
interface MeetingData {
  name: string;
  email: string;
  subject: string;
  date: Date;
  time: string;
  message?: string;
}

/**
 * Sends a meeting confirmation email to the user (mock implementation)
 * @param meetingData - The meeting details
 * @returns Promise with the send result
 */
export const sendMeetingConfirmation = async (meetingData: MeetingData) => {
  const { name, email, subject, date, time, message } = meetingData;
  
  // Format the date for display
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  try {
    console.log('=== MOCK EMAIL SERVICE ===');
    console.log('Sending meeting confirmation email to:', email);
    
    const emailContent = `
      To: ${email}
      From: onboarding@resend.dev
      Subject: Meeting Confirmation: ${subject}
      
      Hello ${name},
      
      Your meeting has been scheduled successfully. Here are the details:
      
      Subject: ${subject}
      Date: ${formattedDate}
      Time: ${time}
      ${message ? `Your message: ${message}` : ''}
      
      I'll be sending you a calendar invitation with a meeting link shortly.
      
      If you need to reschedule or have any questions, please reply to this email.
      
      Looking forward to our meeting!
      
      Best regards,
      Gaurav
    `;
    
    console.log('Email Content:');
    console.log(emailContent);
    console.log('=== END MOCK EMAIL ===');
    
    // Log to database or file for debugging
    const fs = await import('fs');
    fs.appendFileSync('email_logs.txt', `${new Date().toISOString()} - CONFIRMATION EMAIL TO: ${email}\n${emailContent}\n\n`);
    
    return { success: true, data: { id: 'mock-email-id' } };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};

/**
 * Sends a notification email to the admin about a new meeting (mock implementation)
 * @param meetingData - The meeting details
 * @returns Promise with the send result
 */
export const sendAdminNotification = async (meetingData: MeetingData) => {
  const { name, email, subject, date, time, message } = meetingData;
  const ADMIN_EMAIL = 'jyensah@gmail.com';
  
  // Format the date for display
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  try {
    console.log('=== MOCK EMAIL SERVICE ===');
    console.log('Sending admin notification email to:', ADMIN_EMAIL);
    
    const emailContent = `
      To: ${ADMIN_EMAIL}
      From: onboarding@resend.dev
      Subject: New Meeting Request: ${subject}
      
      You have received a new meeting request with the following details:
      
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Date: ${formattedDate}
      Time: ${time}
      ${message ? `Message: ${message}` : ''}
      
      Please confirm this meeting by sending a calendar invitation.
    `;
    
    console.log('Email Content:');
    console.log(emailContent);
    console.log('=== END MOCK EMAIL ===');
    
    // Log to database or file for debugging
    const fs = await import('fs');
    fs.appendFileSync('email_logs.txt', `${new Date().toISOString()} - ADMIN NOTIFICATION TO: ${ADMIN_EMAIL}\n${emailContent}\n\n`);
    
    return { success: true, data: { id: 'mock-email-id' } };
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return { success: false, error };
  }
};