// Test Email Script
import { Resend } from 'resend';

// Use the provided API key (public key)
const RESEND_API_KEY = '30e6F1xc9x9XAb1js';

// Create a new Resend instance
const resend = new Resend(RESEND_API_KEY);

// Email sender address - using a verified Resend domain
const FROM_EMAIL = 'onboarding@resend.dev';

// Admin email address for notifications
const TO_EMAIL = 'jyensah@gmail.com';

async function sendTestEmail() {
  try {
    console.log('Sending test email to:', TO_EMAIL);
    console.log('Using Resend API key:', RESEND_API_KEY);
    
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: 'Test Email from Portfolio App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h1 style="color: #FFB600;">Test Email</h1>
          <p>This is a test email from the Portfolio App.</p>
          <p>If you're receiving this, the email sending functionality is working correctly.</p>
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

// Send the test email
sendTestEmail()
  .then(result => {
    console.log('Email sending result:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Error sending email:', error);
    process.exit(1);
  });