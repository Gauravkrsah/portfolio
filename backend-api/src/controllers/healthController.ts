import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

// Health check controller
export const getHealthStatus = async (req: Request, res: Response): Promise<void> => {
  const healthStatus = {
    status: 'OK',
    message: 'API is running',
    services: {
      geminiApi: {
        status: process.env.GEMINI_API_KEY ? 'OK' : 'ERROR',
        message: process.env.GEMINI_API_KEY ? 'API key configured' : 'API key missing'
      },
      chatData: {
        status: 'CHECKING',
        message: 'Checking chatdata.md availability'
      }
    },
    timestamp: new Date().toISOString()
  };
  
  try {
    // Check for chatdata.md in production or development paths
    const productionPath = path.resolve(__dirname, '../../docs/chatdata.md');
    const developmentPath = path.resolve(__dirname, '../../../docs/chatdata.md');
    
    let chatDataExists = false;
    
    try {
      // Try production path first
      await fs.access(productionPath);
      healthStatus.services.chatData = {
        status: 'OK',
        message: `Found at ${productionPath}`
      };
      chatDataExists = true;
    } catch (err) {
      // If not found, try development path
      try {
        await fs.access(developmentPath);
        healthStatus.services.chatData = {
          status: 'OK',
          message: `Found at ${developmentPath}`
        };
        chatDataExists = true;
      } catch (err2) {
        healthStatus.services.chatData = {
          status: 'ERROR',
          message: 'chatdata.md not found in any expected location'
        };
      }
    }
    
    // Update overall status
    if (!process.env.GEMINI_API_KEY || !chatDataExists) {
      healthStatus.status = 'WARNING';
      healthStatus.message = 'API is running with issues';
    }
    
    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: String(error)
    });
  }
};