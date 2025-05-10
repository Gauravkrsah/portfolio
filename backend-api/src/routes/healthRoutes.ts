import { Router } from 'express';
import { getHealthStatus } from '../controllers/healthController';

const router = Router();

// Health check route
router.get('/health', getHealthStatus);

export default router;