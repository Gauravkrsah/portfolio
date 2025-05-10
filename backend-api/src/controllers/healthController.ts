import { Request, Response } from 'express';

// Health check controller
export const getHealthStatus = (req: Request, res: Response): void => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
};