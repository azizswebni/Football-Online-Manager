import { AppDataSource } from '../config/data-source';
import { Transfer } from '../models/Transfer';
import { Player } from '../models/Player';
import { Team } from '../models/Team';
import { TransferFilterDto, CreateTransferDto, BuyPlayerDto } from '../dtos/transfer.dto';
import { TransferListItem, TransferResponse } from '../interfaces/transfer.interface';
import logger from '../config/logger';

export class TransferService {
  private transferRepository = AppDataSource.getRepository(Transfer);
  private playerRepository = AppDataSource.getRepository(Player);
  private teamRepository = AppDataSource.getRepository(Team);

  async getTransferList(filters: TransferFilterDto): Promise<TransferListItem[]> {
    const queryBuilder = this.transferRepository
      .createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.player', 'player')
      .leftJoinAndSelect('transfer.sellingTeam', 'sellingTeam')
      .where('transfer.status = :status', { status: 'ACTIVE' });

    // Apply filters
    if (filters.teamName) {
      queryBuilder.andWhere('LOWER(sellingTeam.name) LIKE LOWER(:teamName)', {
        teamName: `%${filters.teamName}%`
      });
    }

    if (filters.playerName) {
      queryBuilder.andWhere('LOWER(player.name) LIKE LOWER(:playerName)', {
        playerName: `%${filters.playerName}%`
      });
    }

    if (filters.minPrice) {
      queryBuilder.andWhere('transfer.askingPrice >= :minPrice', {
        minPrice: filters.minPrice
      });
    }

    if (filters.maxPrice) {
      queryBuilder.andWhere('transfer.askingPrice <= :maxPrice', {
        maxPrice: filters.maxPrice
      });
    }

    queryBuilder.orderBy('transfer.createdAt', 'DESC');

    const transfers = await queryBuilder.getMany();

    return transfers.map(transfer => ({
      id: transfer.id,
      player: {
        id: transfer.player.id,
        name: transfer.player.name,
        position: transfer.player.position,
        age: transfer.player.age,
        overall: transfer.player.overall,
        value: transfer.player.value
      },
      sellingTeam: {
        id: transfer.sellingTeam.id,
        name: transfer.sellingTeam.name
      },
      askingPrice: transfer.askingPrice,
      createdAt: transfer.createdAt
    }));
  }

  async addPlayerToTransferList(teamId: string, transferData: CreateTransferDto): Promise<TransferResponse> {
    // Check if player exists and belongs to the team
    const player = await this.playerRepository.findOne({
      where: { id: transferData.playerId, team: { id: teamId } },
      relations: ['team']
    });

    if (!player) {
      throw new Error('Player not found or does not belong to your team');
    }

    // Check if player is already on transfer list
    const existingTransfer = await this.transferRepository.findOne({
      where: { player: { id: transferData.playerId }, status: 'ACTIVE' }
    });

    if (existingTransfer) {
      throw new Error('Player is already on the transfer list');
    }

    // Check team size constraints (15-25 players)
    const team = await this.teamRepository.findOne({
      where:  { id: teamId } ,
      relations: ['players', 'players.transfers']
    });
    if(!team){
      throw new Error('Team not found')
    }

    const availablePlayers = team.players.filter(p => {
      const hasActiveTransfer = p.transfers.some(transfer => transfer.status === 'ACTIVE');
      return !hasActiveTransfer;
    });

    if (availablePlayers.length <= 15) {
      throw new Error('Cannot sell player: team must have at least 15 players');
    }

    // Create transfer
    const transfer = this.transferRepository.create({
      player: { id: transferData.playerId },
      sellingTeam: { id: teamId },
      askingPrice: transferData.askingPrice
    });

    const savedTransfer = await this.transferRepository.save(transfer);

    logger.info(`Player ${player.name} added to transfer list by team ${player.team.name}`);

    return this.formatTransferResponse(savedTransfer);
  }

  async removePlayerFromTransferList(teamId: string, transferId: string): Promise<void> {
    const transfer = await this.transferRepository.findOne({
      where: { id: transferId, sellingTeam: { id: teamId }, status: 'ACTIVE' },
      relations: ['player', 'sellingTeam']
    });

    if (!transfer) {
      throw new Error('Transfer not found or does not belong to your team');
    }

    transfer.status = 'CANCELLED';
    await this.transferRepository.save(transfer);

    logger.info(`Transfer cancelled for player ${transfer.player.name} by team ${transfer.sellingTeam.name}`);
  }

  async buyPlayer(buyingTeamId: string, buyData: BuyPlayerDto): Promise<TransferResponse> {
    const transfer = await this.transferRepository.findOne({
      where: { id: buyData.transferId, status: 'ACTIVE' },
      relations: ['player', 'sellingTeam', 'buyingTeam']
    });

    if (!transfer) {
      throw new Error('Transfer not found or not active');
    }

    // Check if buying team is not the same as selling team
    if (transfer.sellingTeam.id === buyingTeamId) {
      throw new Error('Cannot buy your own player');
    }

    // Calculate purchase price (95% of asking price)
    const purchasePrice = Math.floor(transfer.askingPrice * 0.95);

    // Get buying team
    const buyingTeam = await this.teamRepository.findOne({
      where: { id: buyingTeamId }
    });

    if (!buyingTeam) {
      throw new Error('Buying team not found');
    }

    // Check if buying team has enough budget
    if (buyingTeam.budget < purchasePrice) {
      throw new Error('Insufficient budget to buy this player');
    }

    // Check buying team size constraints (max 25 players)
    const buyingTeamPlayerCount = await this.playerRepository.count({
      where: { team: { id: buyingTeamId } }
    });

    if (buyingTeamPlayerCount >= 25) {
      throw new Error('Cannot buy player: team already has maximum 25 players');
    }

    // Start transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update transfer status
      transfer.status = 'SOLD';
      transfer.buyingTeam = buyingTeam;
      transfer.soldPrice = purchasePrice;
      transfer.soldAt = new Date();
      await queryRunner.manager.save(Transfer, transfer);

      // Transfer player to buying team
      await queryRunner.manager.update(Player, transfer.player.id, {
        team: { id: buyingTeamId }
      });

      // Update budgets
      await queryRunner.manager.update(Team, buyingTeamId, {
        budget: buyingTeam.budget - purchasePrice
      });

      await queryRunner.manager.update(Team, transfer.sellingTeam.id, {
        budget: transfer.sellingTeam.budget + purchasePrice
      });

      await queryRunner.commitTransaction();

      logger.info(`Player ${transfer.player.name} sold from ${transfer.sellingTeam.name} to ${buyingTeam.name} for ${purchasePrice}`);

      return this.formatTransferResponse(transfer);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTeamTransfers(teamId: string): Promise<TransferResponse[]> {
    const transfers = await this.transferRepository.find({
      where: [
        { sellingTeam: { id: teamId } },
        { buyingTeam: { id: teamId } }
      ],
      relations: ['player', 'sellingTeam', 'buyingTeam'],
      order: { createdAt: 'DESC' }
    });

    return transfers.map(transfer => this.formatTransferResponse(transfer));
  }

  private formatTransferResponse(transfer: Transfer): TransferResponse {
    return {
      id: transfer.id,
      player: {
        id: transfer.player.id,
        name: transfer.player.name,
        position: transfer.player.position,
        age: transfer.player.age,
        overall: transfer.player.overall,
        value: transfer.player.value
      },
      sellingTeam: {
        id: transfer.sellingTeam.id,
        name: transfer.sellingTeam.name
      },
      askingPrice: transfer.askingPrice,
      status: transfer.status,
      createdAt: transfer.createdAt
    };
  }
} 