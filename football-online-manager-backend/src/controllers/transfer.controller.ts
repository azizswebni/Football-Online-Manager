import { Request, Response } from 'express';
import { TransferService } from '../services/transfer.service';
import { TransferFilterDto, CreateTransferDto, BuyPlayerDto } from '../dtos/transfer.dto';
import { getUserIdFromRequest } from '../utils/auth';
import logger from '../config/logger';

export class TransferController {
  private transferService = new TransferService();

  async getTransferList(req: Request, res: Response): Promise<void> {
    try {
      const filters: TransferFilterDto = req.query as any;
      const transfers = await this.transferService.getTransferList(filters);
      
      res.status(200).json({
        transfers,
        count: transfers.length
      });
    } catch (error) {
      logger.error('Failed to get transfer list:', error);
      res.status(500).json({
        message: 'Failed to get transfer list',
        status: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  async addPlayerToTransferList(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserIdFromRequest(req);
      const transferData: CreateTransferDto = req.body;
      
      // Get user's team ID (you'll need to implement this)
      const teamId = await this.getUserTeamId(userId);
      
      const transfer = await this.transferService.addPlayerToTransferList(teamId, transferData);
      
      res.status(201).json({
        transfer,
        message: 'Player added to transfer list successfully'
      });
    } catch (error) {
      logger.error('Failed to add player to transfer list:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Failed to add player to transfer list',
        status: 400,
        timestamp: new Date().toISOString()
      });
    }
  }

  async removePlayerFromTransferList(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserIdFromRequest(req);
      const { transferId } = req.params;
      
      const teamId = await this.getUserTeamId(userId);
      
      await this.transferService.removePlayerFromTransferList(teamId, transferId);
      
      res.status(200).json({
        message: 'Player removed from transfer list successfully'
      });
    } catch (error) {
      logger.error('Failed to remove player from transfer list:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Failed to remove player from transfer list',
        status: 400,
        timestamp: new Date().toISOString()
      });
    }
  }

  async buyPlayer(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserIdFromRequest(req);
      const buyData: BuyPlayerDto = req.body;
      
      const teamId = await this.getUserTeamId(userId);
      
      const transfer = await this.transferService.buyPlayer(teamId, buyData);
      
      res.status(200).json({
        transfer,
        message: 'Player purchased successfully'
      });
    } catch (error) {
      logger.error('Failed to buy player:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Failed to buy player',
        status: 400,
        timestamp: new Date().toISOString()
      });
    }
  }

  async getTeamTransfers(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserIdFromRequest(req);
      const teamId = await this.getUserTeamId(userId);
      
      const transfers = await this.transferService.getTeamTransfers(teamId);
      
      res.status(200).json({
        transfers,
        count: transfers.length
      });
    } catch (error) {
      logger.error('Failed to get team transfers:', error);
      res.status(500).json({
        message: 'Failed to get team transfers',
        status: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  private async getUserTeamId(userId: string): Promise<string> {
    // This should be implemented to get the user's team ID
    // You can use the existing AuthService or create a separate method
    const { AppDataSource } = await import('../config/data-source');
    const { User } = await import('../models/User');
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['team']
    });

    if (!user || !user.team) {
      throw new Error('User team not found');
    }

    return user.team.id;
  }
} 