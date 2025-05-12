# Backend API Setup

## Gemini Integration Quick Guide

1. **Get your Gemini API key:**  
   [Google AI Studio - API Keys](https://makersuite.google.com/app/apikey)

2. **Edit your backend `.env` file:**  
   ```
   GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY_HERE
   ```
   - Make sure there are NO quotes, NO spaces before/after `=`.
   - This line must be present (case matters).

3. **Restart your backend server:**  
   Open a terminal in the `backend-api` directory and run:
   ```
   npm run dev
   ```
   or
   ```
   npm start
   ```
   - Watch for the debug line:
     ```
     [DEBUG] GEMINI_API_KEY present: true string
     ```
   - If it's `false` or `undefined`, your .env variable is not correct!

4. **Test your chatbot:**  
   If set up correctly, messages will use Gemini and respond with smart, context-aware answers.