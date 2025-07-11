import { Router } from 'express';
import { authenticateJWT, extractUserId } from '../middlewares/authMiddleware';
import { TeamController } from '../controllers/team.controller';

const router: import('express').Router = Router();
const teamController = new TeamController();

/**
 * @openapi
 * /user/team:
 *   get:
 *     summary: Get current user's team with players
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 team:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     budget:
 *                       type: number
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                     players:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           position:
 *                             type: string
 *                           age:
 *                             type: number
 *                           overall:
 *                             type: number
 *                           value:
 *                             type: number
 *                     playerCount:
 *                       type: number
 *                     totalValue:
 *                       type: number
 *                     averageOverall:
 *                       type: number
 *       400:
 *         description: Team not found or other error
 *       401:
 *         description: Unauthorized
 */
router.get('/team', 
  authenticateJWT, 
  extractUserId, 
  teamController.getTeam.bind(teamController)
);

/**
 * @openapi
 * /user/team/stats:
 *   get:
 *     summary: Get current user's team statistics
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     playerCount:
 *                       type: number
 *                     totalValue:
 *                       type: number
 *                     averageOverall:
 *                       type: number
 *                     playersByPosition:
 *                       type: object
 *                       properties:
 *                         GK:
 *                           type: number
 *                         DEF:
 *                           type: number
 *                         MID:
 *                           type: number
 *                         FWD:
 *                           type: number
 *                     budget:
 *                       type: number
 *       400:
 *         description: Team not found or other error
 *       401:
 *         description: Unauthorized
 */
router.get('/team/stats', 
  authenticateJWT, 
  extractUserId, 
  teamController.getTeamStats.bind(teamController)
);

export default router; 