import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dtos/auth.dto';
import { ENV } from '../config/env';
import logger from '../config/logger';

export class AuthController {
  private authService = new AuthService();

  async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const authData: AuthDto = req.body;
      
      const result = await this.authService.authenticateUser(authData);
      
      // Set JWT token as HTTP-only cookie
      res.cookie(ENV.COOKIE_NAME, result.token, {
        httpOnly: ENV.COOKIE_HTTP_ONLY,
        secure: ENV.COOKIE_SECURE,
        sameSite: ENV.COOKIE_SAME_SITE,
        maxAge: ENV.COOKIE_MAX_AGE,
        path: '/'
      });
      
      // Return response without token in body
      res.status(200).json({
        user: result.user,
        message: result.message
      });
    } catch (error) {
      logger.error('Authentication error:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Authentication failed',
        status: 400,
        timestamp: new Date().toISOString()
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      // Clear the auth cookie
      res.clearCookie(ENV.COOKIE_NAME, {
        httpOnly: ENV.COOKIE_HTTP_ONLY,
        secure: ENV.COOKIE_SECURE,
        sameSite: ENV.COOKIE_SAME_SITE,
        path: '/'
      });
      
      res.status(200).json({
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        message: 'Logout failed',
        status: 500,
        timestamp: new Date().toISOString()
      });
    }
  }
} 