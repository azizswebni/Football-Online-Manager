import { Request, Response } from "express";
import { TeamService } from "../services/team.service";
import { getUserIdFromRequest } from "../utils/auth";
import logger from "../config/logger";

export class TeamController {
  private teamService = new TeamService();

  async getTeam(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserIdFromRequest(req);

      if (!userId) {
        throw new Error("User Not found in request");
      }
      const team = await this.teamService.getTeamWithPlayers(userId);
      res.status(200).json({
        team,
        message: "Team retrieved successfully",
      });
    } catch (error) {
      logger.error("Failed to get team:", error);
      res.status(400).json({
        message: error instanceof Error ? error.message : "Failed to get team",
        status: 400,
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getTeamStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = getUserIdFromRequest(req);
      if (!userId) {
        throw new Error("User Not found in request");
      }
      const stats = await this.teamService.getTeamStats(userId);
      res.status(200).json({
        stats,
        message: "Team statistics retrieved successfully",
      });
    } catch (error) {
      logger.error("Failed to get team stats:", error);
      res.status(400).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to get team statistics",
        status: 400,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
