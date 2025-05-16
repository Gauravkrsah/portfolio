// Test script to verify if the Gemini chat API is working
// Run this with: node test-gemini.js

const fetch = require('node-fetch');

// Update this with your actual API URL
const API_URL = process.env.API_URL || 'http://localhost:4000/api/gemini-chat';

async function testGeminiChat() {
  console.log(`Testing Gemini chat API at: ${API_URL}`);
  console.log('Sending test message...');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, who are you and what skills do you have?'
      })
    });
    
    if (!response.ok) {
      console.error(`API returned status: ${response.status}`);
      console.error(`Error message: ${await response.text()}`);
      return;
    }
    
    const data = await response.json();
    console.log('\nAPI Response:');
    console.log('----------------------------------');
    console.log(data.answer || 'No answer received');
    console.log('----------------------------------');
    
    if (data.answer) {
      console.log('\n✅ Gemini API is working correctly!');
    } else {
      console.log('\n❌ Gemini API response is missing the answer field.');
    }
  } catch (error) {
    console.error('Error testing Gemini API:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Verify that the backend server is running');
    console.log('2. Check that the GEMINI_API_KEY is set in your .env file');
    console.log('3. Ensure the API URL is correct');
    console.log('4. Check server logs for any errors');
  }
}

// Run the test
testGeminiChat();
