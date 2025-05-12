"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Ensure .env variables are loaded in all environments
require("dotenv/config");
// DEBUG: Print Gemini API Key environment status at backend startup
console.log('[DEBUG] GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY, typeof process.env.GEMINI_API_KEY);
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const geminiChat_1 = __importDefault(require("./routes/geminiChat"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api', healthRoutes_1.default);
app.use('/api', geminiChat_1.default); // Changed to /api to match client expectation
// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
