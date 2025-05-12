// Minimal test script for Google Gemini API using GoogleGenerativeAI SDK
//
// This script sends a simple prompt "Hello, world" to the Gemini model and logs the raw response.
//
// Usage:
//   1. Ensure you have Node.js installed (v18+ recommended).
//   2. Set the GEMINI_API_KEY environment variable in your shell or .env file.
//      - On Windows CMD: set GEMINI_API_KEY=your_api_key_here
//      - On PowerShell: $env:GEMINI_API_KEY="your_api_key_here"
//   3. Run the script with:
//      npx tsx backend-api/test-gemini.ts
//      (or compile with tsc and run node runtime if preferred)
//
// This helps debug API connectivity and response independent of the main app.

import { config } from 'dotenv';
config(); // Load .env if present

import { GoogleGenerativeAI } from '@google/generative-ai';

async function runTest() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY environment variable is not set.');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = 'Hello, world';
  console.log('Sending prompt to Gemini:', prompt);

  try {
    const response = await model.generateContent(prompt);
    console.log('Raw response from Gemini API:');
    console.dir(response, { depth: null });

    // Attempt to extract and log message content (may vary depending on SDK version)
    if (response && typeof response === 'object' && 'response' in response) {
      const resp: any = (response as any).response;
      if (resp.candidates && Array.isArray(resp.candidates) && resp.candidates.length > 0) {
        const candidate = resp.candidates[0];
        const content = candidate.message?.content || candidate.content || '(no content)';
        console.log('\nExtracted message content:');
        console.log(content);
      } else {
        console.log('No candidates found in response.');
      }
    } else {
      console.log('Unexpected response format:', response);
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
  }
}

runTest();