// Ensure .env variables are loaded in all environments
import 'dotenv/config';
// DEBUG: Print Gemini API Key environment status at backend startup
console.log('[DEBUG] GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY, typeof process.env.GEMINI_API_KEY);

import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes';
import geminiChatRoutes from './routes/geminiChat';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api', geminiChatRoutes); // Changed to /api to match client expectation

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});