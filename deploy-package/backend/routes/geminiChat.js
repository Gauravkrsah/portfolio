"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const generative_ai_1 = require("@google/generative-ai");
const router = express_1.default.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
console.log('[DEBUG] GEMINI_API_KEY (first 8 chars shown):', GEMINI_API_KEY ? (GEMINI_API_KEY.substring(0, 8) + '...') : '(not set)');
const CHATDATA_PATH = path_1.default.resolve(__dirname, '../../../docs/chatdata.md');
if (!GEMINI_API_KEY) {
    console.error('FATAL: GEMINI_API_KEY is not set in environment variables. Set it in .env and restart the backend!');
    throw new Error('GEMINI_API_KEY missing - server cannot proceed.\nPlease update backend-api/.env.');
}
const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
async function loadChatData() {
    try {
        const data = await promises_1.default.readFile(CHATDATA_PATH, 'utf-8');
        return data;
    }
    catch (error) {
        console.error('Failed to load chat data:', error);
        return '';
    }
}
function findRelevantSnippets(markdown, userQuestion, maxSnippets = 5) {
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
        let score = lowerQ.split(/\W+/).reduce((acc, word) => acc + (section.toLowerCase().includes(word) && word.length > 2 ? 1 : 0), 0);
        // Boost score for sections that match the detected topics
        matchedTopics.forEach(topic => {
            if (section.toLowerCase().includes(topic.toLowerCase())) {
                score += 5; // Give significant boost to relevant topic sections
            }
        });
        return { section, score };
    });
    scored.sort((a, b) => b.score - a.score);
    // Extract the top N highest scoring sections
    let highestScoringSnippets = scored
        .slice(0, Math.max(1, Math.min(maxSnippets - 1, scored.length))) // Leave room for intro
        .map(s => s.section.trim());
    // Always include intro if not already in the high scoring snippets
    if (!highestScoringSnippets.includes(introSection) && introSection) {
        highestScoringSnippets = [introSection, ...highestScoringSnippets];
    }
    return highestScoringSnippets;
}
function createPrompt(relevantData, userMessage) {
    return `You are Gaurav's virtual assistant, trained to respond as if you are Gaurav himself. 
Use a friendly, professional tone and always respond in first person as if you were Gaurav.
Use the information in these documents about Gaurav to answer the user's question:

${relevantData}

Remember: You are Gaurav. Refer to yourself as "I", talk about "my projects", "my experience", etc.
If the user asks something not covered in the information, you can politely indicate that you'd be happy to discuss it in a real meeting.

User: ${userMessage}`;
}
router.post('/gemini-chat', async (req, res) => {
    try {
        if (!req.body?.message) {
            return res.status(400).json({ error: 'Missing \`message\` in request body' });
        }
        const userMessage = req.body.message;
        const chatdata = await loadChatData();
        const relevantSnippets = findRelevantSnippets(chatdata, userMessage).join('\n\n---\n\n');
        const prompt = createPrompt(relevantSnippets, userMessage);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        if (!result || !result.response || !result.response.candidates || !Array.isArray(result.response.candidates) || result.response.candidates.length === 0) {
            return res.status(500).json({ error: 'No answer generated' });
        }
        const candidate = result.response.candidates[0];
        const parts = candidate?.content?.parts || [];
        const answerText = parts.length > 0 ? parts.map((p) => p.text).join('') : '(no content)';
        res.json({ answer: answerText });
    }
    catch (error) {
        console.error('Gemini chat error:', error);
        res.status(500).json({ error: String(error) });
    }
});
exports.default = router;
