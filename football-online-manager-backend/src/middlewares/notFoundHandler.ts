import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    message: 'Resource not found',
    status: 404,
    timestamp: new Date().toISOString()
  });
} 