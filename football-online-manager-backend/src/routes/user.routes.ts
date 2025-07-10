import { Router } from 'express';
import { authenticateJWT, extractUserId } from '../middlewares/authMiddleware';
import { getUserIdFromRequest, getUserFromRequest } from '../utils/auth';

const router: import('express').Router = Router();

/**
 * @openapi
 * /user/profile:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticateJWT, extractUserId, (req, res) => {
  try {
    const userId = getUserIdFromRequest(req);
    const user = getUserFromRequest(req);
    
    res.status(200).json({
      userId,
      email: user?.email,
      role: user?.role,
      message: 'Profile retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve profile',
      status: 500,
      timestamp: new Date().toISOString()
    });
  }
});

export default router; 