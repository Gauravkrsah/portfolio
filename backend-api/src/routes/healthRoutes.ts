import { Router } from 'express';
import { getHealthStatus } from '../controllers/healthController';

const router = Router();

// Health check routes
router.get('/health', getHealthStatus);
router.get('/gemini-chat/health', getHealthStatus); // Add specific health endpoint for chat

// Simple ping route that always responds quickly
router.get('/ping', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'pong' });
});

export default router;