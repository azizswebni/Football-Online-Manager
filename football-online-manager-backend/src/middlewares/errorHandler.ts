import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(`${req.method} ${req.url} - ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
    timestamp: new Date().toISOString()
  });
} 