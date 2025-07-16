import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import { Transfer } from "../models/Transfer";

export interface TeamWithPlayers {
  id: string;
  name: string;
  budget: number;
  user: {
    id: string;
    email: string;
    role: string;
  };
  players: {
    id: string;
    name: string;
    position: string;
    age: number;
    overall: number;
    value: number;
    isInTransferMarket: boolean;
    transferId?: string;
    askingPrice?: number;
  }[];
  playerCount: number;
  totalValue: number;
  averageOverall: number;
}

export class TeamService {
  private userRepository = AppDataSource.getRepository(User);
  private transferRepository = AppDataSource.getRepository(Transfer);

  async getTeamWithPlayers(userId: string): Promise<TeamWithPlayers> {
    // Get user with team and players
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["team", "team.players"],
    });

    if (!user || !user.team) {
      throw new Error("Team not found for this user");
    }

    const team = user.team;
    const players = team.players || [];

    // Get active transfers for all players in the team
    const activeTransfers = await this.transferRepository.find({
      where: {
        sellingTeam: { id: team.id },
        status: "ACTIVE",
      },
      relations: ["player"],
    });

    // Create a map of player IDs to their transfer information
    const transferMap = new Map<
      string,
      { transferId: string; askingPrice: number }
    >();
    activeTransfers.forEach((transfer) => {
      transferMap.set(transfer.player.id, {
        transferId: transfer.id,
        askingPrice: transfer.askingPrice,
      });
    });

    // Calculate team statistics
    const playerCount = players.length;
    const totalValue = players.reduce((sum, player) => sum + player.value, 0);
    const averageOverall =
      playerCount > 0
        ? Math.round(
            players.reduce((sum, player) => sum + player.overall, 0) /
              playerCount
          )
        : 0;

    // Group players by position and include transfer market status
    const playersByPosition = players.reduce((acc, player) => {
      if (!acc[player.position]) {
        acc[player.position] = [];
      }

      const transferInfo = transferMap.get(player.id);
      const isInTransferMarket = !!transferInfo;

      acc[player.position].push({
        id: player.id,
        name: player.name,
        position: player.position,
        age: player.age,
        overall: player.overall,
        value: player.value,
        isInTransferMarket,
        transferId: transferInfo?.transferId,
        askingPrice: transferInfo?.askingPrice,
      });
      return acc;
    }, {} as Record<string, any[]>);

    // Sort players by overall rating (descending)
    Object.keys(playersByPosition).forEach((position) => {
      playersByPosition[position].sort((a, b) => b.overall - a.overall);
    });

    // Flatten players array
    const sortedPlayers = Object.values(playersByPosition).flat();

    return {
      id: team.id,
      name: team.name,
      budget: team.budget,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      players: sortedPlayers,
      playerCount,
      totalValue,
      averageOverall,
    };
  }

  async getTeamStats(userId: string): Promise<{
    playerCount: number;
    totalValue: number;
    averageOverall: number;
    playersByPosition: Record<string, number>;
    budget: number;
  }> {
    const team = await this.getTeamWithPlayers(userId);

    // Count players by position
    const playersByPosition = team.players.reduce((acc, player) => {
      acc[player.position] = (acc[player.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      playerCount: team.playerCount,
      totalValue: team.totalValue,
      averageOverall: team.averageOverall,
      playersByPosition,
      budget: team.budget,
    };
  }
}
