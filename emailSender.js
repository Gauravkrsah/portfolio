// Email Sender Script
// This script uses the Resend API to send emails
// Run with: node emailSender.js

import { Resend } from 'resend';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Use the provided API key
const RESEND_API_KEY = 'vc_8V1OHUPd17EQwe57uJ';

// Create a new Resend instance
const resend = new Resend(RESEND_API_KEY);

// Email sender address - using a verified Resend domain
// For Resend, you can use 'onboarding@resend.dev' for testing
const FROM_EMAIL = 'onboarding@resend.dev';

// Admin email address for notifications
const ADMIN_EMAIL = 'jyensah@gmail.com';

// Function to send a meeting confirmation email to the user
async function sendMeetingConfirmation(meetingData) {
  const { name, email, subject, date, time, message } = meetingData;
  
  // Format the date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  try {
    console.log('Sending meeting confirmation email to:', email);
    console.log('Using Resend API key:', RESEND_API_KEY);
    
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Meeting Confirmation: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #FFB600; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #151515; margin: 0;">Meeting Scheduled</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #eee;">
            <p>Hello ${name},</p>
            
            <p>Your meeting has been scheduled successfully. Here are the details:</p>
            
            <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFB600;">
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${time}</p>
              ${message ? `<p><strong>Your message:</strong> ${message}</p>` : ''}
            </div>
            
            <p>I'll be sending you a calendar invitation with a meeting link shortly.</p>
            
            <p>If you need to reschedule or have any questions, please reply to this email.</p>
            
            <p>Looking forward to our meeting!</p>
            
            <p>Best regards,<br>Gaurav</p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} Gaurav's Portfolio. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    
    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

// Function to send a notification email to the admin about a new meeting
async function sendAdminNotification(meetingData) {
  const { name, email, subject, date, time, message } = meetingData;
  
  // Format the date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  try {
    console.log('Sending admin notification email to:', ADMIN_EMAIL);
    
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Meeting Request: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #151515; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #FFB600; margin: 0;">New Meeting Request</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #eee;">
            <p>You have received a new meeting request with the following details:</p>
            
            <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFB600;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${time}</p>
              ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
            </div>
            
            <p>Please confirm this meeting by sending a calendar invitation.</p>
          </div>
        </div>
      `,
    });
    
    console.log('Admin notification email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return { success: false, error };
  }
}

// Main function to send both emails
async function sendEmails(meetingData) {
  try {
    // Send confirmation email to the user
    const userEmailResult = await sendMeetingConfirmation(meetingData);
    
    // Send notification email to the admin
    const adminEmailResult = await sendAdminNotification(meetingData);
    
    return {
      userEmail: userEmailResult,
      adminEmail: adminEmailResult
    };
  } catch (error) {
    console.error('Error sending emails:', error);
    return {
      userEmail: { success: false, error },
      adminEmail: { success: false, error }
    };
  }
}

// Check if this script is being run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Get meeting data from command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node emailSender.js \'{"name":"John Doe","email":"john@example.com","subject":"Meeting Subject","date":"2023-01-01","time":"10:00 AM","message":"Optional message"}\'');
    process.exit(1);
  }
  
  try {
    // Parse the meeting data from the command line argument
    const meetingData = JSON.parse(args[0]);
    
    // Send the emails
    sendEmails(meetingData)
      .then(result => {
        console.log('Email sending result:', result);
        process.exit(0);
      })
      .catch(error => {
        console.error('Error sending emails:', error);
        process.exit(1);
      });
  } catch (error) {
    console.error('Error parsing meeting data:', error);
    process.exit(1);
  }
}

// Export the functions for use in other files
export {
  sendMeetingConfirmation,
  sendAdminNotification,
  sendEmails
};