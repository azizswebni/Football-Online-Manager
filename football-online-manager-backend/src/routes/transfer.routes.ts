import { Router } from 'express';
import { TransferController } from '../controllers/transfer.controller';
import { authenticateJWT, extractUserId } from '../middlewares/authMiddleware';
import { validateDto } from '../middlewares/validationMiddleware';
import { CreateTransferDto, BuyPlayerDto } from '../dtos/transfer.dto';

const router: import('express').Router = Router();
const transferController = new TransferController();

/**
 * @openapi
 * /transfer:
 *   get:
 *     summary: Get transfer list with optional filters
 *     tags:
 *       - Transfer Market
 *     parameters:
 *       - in: query
 *         name: teamName
 *         schema:
 *           type: string
 *         description: Filter by team name
 *       - in: query
 *         name: playerName
 *         schema:
 *           type: string
 *         description: Filter by player name
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: Transfer list retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/', transferController.getTransferList.bind(transferController));

/**
 * @openapi
 * /transfer:
 *   post:
 *     summary: Add player to transfer list
 *     tags:
 *       - Transfer Market
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTransferDto'
 *     responses:
 *       201:
 *         description: Player added to transfer list successfully
 *       400:
 *         description: Validation or business logic error
 *       401:
 *         description: Unauthorized
 */
router.post('/', 
  authenticateJWT, 
  extractUserId, 
  validateDto(CreateTransferDto), 
  transferController.addPlayerToTransferList.bind(transferController)
);

/**
 * @openapi
 * /transfer/{transferId}:
 *   delete:
 *     summary: Remove player from transfer list
 *     tags:
 *       - Transfer Market
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transferId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Player removed from transfer list successfully
 *       400:
 *         description: Validation or business logic error
 *       401:
 *         description: Unauthorized
 */
router.delete('/:transferId', 
  authenticateJWT, 
  extractUserId, 
  transferController.removePlayerFromTransferList.bind(transferController)
);

/**
 * @openapi
 * /transfer/buy:
 *   post:
 *     summary: Buy a player from transfer list
 *     tags:
 *       - Transfer Market
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BuyPlayerDto'
 *     responses:
 *       200:
 *         description: Player purchased successfully
 *       400:
 *         description: Validation or business logic error
 *       401:
 *         description: Unauthorized
 */
router.post('/buy', 
  authenticateJWT, 
  extractUserId, 
  validateDto(BuyPlayerDto), 
  transferController.buyPlayer.bind(transferController)
);

/**
 * @openapi
 * /transfer/team:
 *   get:
 *     summary: Get current user's team transfers
 *     tags:
 *       - Transfer Market
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team transfers retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/team', 
  authenticateJWT, 
  extractUserId, 
  transferController.getTeamTransfers.bind(transferController)
);

export default router; 