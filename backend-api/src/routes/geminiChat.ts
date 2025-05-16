import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
console.log('[DEBUG] GEMINI_API_KEY (first 8 chars shown):', GEMINI_API_KEY ? (GEMINI_API_KEY.substring(0, 8) + '...') : '(not set)');

// Determine chatdata.md path based on environment
const CHATDATA_PATH = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../docs/chatdata.md')
  : path.resolve(__dirname, '../../../docs/chatdata.md');

console.log('[DEBUG] Looking for chatdata.md at:', CHATDATA_PATH);

if (!GEMINI_API_KEY) {
  console.error('FATAL: GEMINI_API_KEY is not set in environment variables. Set it in .env and restart the backend!');
  throw new Error('GEMINI_API_KEY missing - server cannot proceed.\nPlease update backend-api/.env.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function loadChatData(): Promise<string> {
  try {
    const data = await fs.readFile(CHATDATA_PATH, 'utf-8');
    console.log('[DEBUG] Successfully loaded chatdata.md');
    return data;
  } catch (error) {
    console.error('Failed to load chat data from path:', CHATDATA_PATH, error);
    
    // Fallback content if the file cannot be found
    const fallbackContent = `
**Gaurav Kr Sah - Portfolio Summary**

I am Gaurav Kr Sah, pursuing Bachelor's in Computer Applications (BCA), specializing in product designing, digital marketing, UI/UX design, and website development. I have experience in HTML, CSS, JavaScript, React, and digital marketing strategies including SEO, social media marketing, and paid advertising.

My expertise includes product designing using Figma, UI/UX design with user research, frontend development, and digital marketing across various channels. I've worked on several projects including CropSay, an agricultural startup, and RJIT College website redesign.
    `;
    
    console.log('[DEBUG] Using fallback content for chat responses');
    return fallbackContent;
  }
}

function findRelevantSnippets(markdown: string, userQuestion: string, maxSnippets = 5): string[] {
  // Always include the introduction section for context
  const introSection = markdown.match(/Introduction:.*?(?=\n\s*---+\s*\n)/s)?.[0] || '';
  
  const lowerQ = userQuestion.toLowerCase();
  
  // Key topics to check for in the question
  const topics = {
    skills: /skill|expert|proficient|know|technology|tool|program/i,
    projects: /project|work|portfolio|built|developed|created|startup|cropsay/i,
    experience: /experience|job|work|career|background|history/i,
    education: /education|degree|study|college|university|school|bca/i,
    contact: /contact|reach|email|phone|message/i
  };
  
  // Check for topic matches in the question
  const matchedTopics = Object.entries(topics)
    .filter(([_, regex]) => regex.test(userQuestion))
    .map(([topic]) => topic);
    
  const sections = markdown.split(/\n\s*---+\s*\n/g);
  const scored = sections.map((section) => {
    // Base score from word matching
    let score = lowerQ.split(/\W+/).reduce(
      (acc, word) =>
        acc + (section.toLowerCase().includes(word) && word.length > 2 ? 1 : 0),
      0
    );
    
    // Boost score for sections that match the detected topics
    matchedTopics.forEach(topic => {
      if (section.toLowerCase().includes(topic.toLowerCase())) {
        score += 5;  // Give significant boost to relevant topic sections
      }
    });
    
    return { section, score };
  });
  
  scored.sort((a, b) => b.score - a.score);
  
  // Extract the top N highest scoring sections
  let highestScoringSnippets = scored
    .slice(0, Math.max(1, Math.min(maxSnippets - 1, scored.length)))  // Leave room for intro
    .map(s => s.section.trim());
  
  // Always include intro if not already in the high scoring snippets
  if (!highestScoringSnippets.includes(introSection) && introSection) {
    highestScoringSnippets = [introSection, ...highestScoringSnippets];
  }
  
  return highestScoringSnippets;
}

function createPrompt(relevantData: string, userMessage: string): string {
  return `You are Gaurav's virtual assistant, trained to respond as if you are Gaurav himself. 
Use a friendly, professional tone and always respond in first person as if you were Gaurav.
Use the information in these documents about Gaurav to answer the user's question:

${relevantData}

Remember: You are Gaurav. Refer to yourself as "I", talk about "my projects", "my experience", etc.
If the user asks something not covered in the information, you can politely indicate that you'd be happy to discuss it in a real meeting.

User: ${userMessage}`;
}

router.post('/gemini-chat', async (req, res) => {
  console.log('[DEBUG] Gemini chat request received:', req.body ? 'Has body' : 'No body');
  try {
    if (!req.body?.message) {
      console.error('[ERROR] Missing message in request body');
      return res.status(400).json({ error: 'Missing message in request body' });
    }

    const userMessage = req.body.message;
    console.log('[DEBUG] User message:', userMessage.substring(0, 30) + '...');
    
    const chatdata = await loadChatData();
    if (!chatdata || chatdata.trim() === '') {
      console.error('[ERROR] No chat data available, even after fallback');
      return res.status(500).json({ 
        answer: "I apologize, I could not access my knowledge base right now. Please try again or contact Gaurav directly."
      });
    }
    
    const relevantSnippets = findRelevantSnippets(chatdata, userMessage).join('\n\n---\n\n');
    const prompt = createPrompt(relevantSnippets, userMessage);
    
    console.log('[DEBUG] Calling Gemini API...');
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);

      if (!result || !result.response || !result.response.candidates || !Array.isArray(result.response.candidates) || result.response.candidates.length === 0) {
        console.error('[ERROR] No valid response from Gemini API');
        return res.status(500).json({ 
          answer: "I apologize, I couldn't generate a response at the moment. Please try again or contact Gaurav directly." 
        });
      }

      const candidate = result.response.candidates[0];
      const parts = candidate?.content?.parts || [];
      const answerText = parts.length > 0 ? parts.map((p: any) => p.text).join('') : '(no content)';
      
      console.log('[DEBUG] Got Gemini response:', answerText.substring(0, 30) + '...');
      res.json({ answer: answerText });
    } catch (geminiError) {
      console.error('[ERROR] Gemini API error:', geminiError);
      // Return a friendly response instead of an error status
      return res.json({ 
        answer: "I apologize, I'm having trouble connecting to my knowledge base right now. Please try again in a moment or contact Gaurav directly."
      });
    }
  } catch (error) {
    console.error('[ERROR] General chat error:', error);
    // Return a friendly response instead of an error status
    res.json({ 
      answer: "I apologize, I could not process your question right now. Please try again or contact Gaurav directly."
    });
  }
});

export default router;