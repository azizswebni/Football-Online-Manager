import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateDto } from '../middlewares/validationMiddleware';
import { AuthDto } from '../dtos/auth.dto';

const router: import('express').Router = Router();
const authController = new AuthController();

/**
 * @openapi
 * /auth:
 *   post:
 *     summary: Login or register a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthDto'
 *     responses:
 *       200:
 *         description: Authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponseDto'
 *         headers:
 *           Set-Cookie:
 *             description: JWT token set as HTTP-only cookie
 *             schema:
 *               type: string
 *       400:
 *         description: Validation or authentication error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validateDto(AuthDto), authController.authenticate.bind(authController));

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Logout failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/logout', authController.logout.bind(authController));

export default router; 