import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dtos/auth.dto';
import logger from '../config/logger';

export class AuthController {
  private authService = new AuthService();

  async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const authData: AuthDto = req.body;
      
      const result = await this.authService.authenticateUser(authData);
      
      res.status(200).json(result);
    } catch (error) {
      logger.error('Authentication error:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Authentication failed',
        status: 400,
        timestamp: new Date().toISOString()
      });
    }
  }
} 