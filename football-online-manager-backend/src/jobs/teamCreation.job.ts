import { Job } from 'bull';
import { AppDataSource } from '../config/data-source';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { Player } from '../models/Player';
import logger from '../config/logger';
import { getIO } from '../config/socket';

interface TeamCreationJobData {
  userId: string;
  userEmail: string;
}

export async function processTeamCreation(job: Job<TeamCreationJobData>): Promise<void> {
  const { userId, userEmail } = job.data;
  
  try {
    logger.info(`Processing team creation for user: ${userEmail} (ID: ${userId})`);
    
    // Get repositories
    const userRepository = AppDataSource.getRepository(User);
    const teamRepository = AppDataSource.getRepository(Team);
    const playerRepository = AppDataSource.getRepository(Player);
    
    // Verify user exists
    const user = await userRepository.findOne({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
    
    // Check if team already exists
    const existingTeam = await teamRepository.findOne({
      where: { user: { id: userId } }
    });
    
    if (existingTeam) {
      logger.info(`Team already exists for user: ${userEmail}`);
      return;
    }
    
    // Create team
    const team = teamRepository.create({
      name: `${userEmail.split('@')[0]} FC`,
      budget: 5000000,
      user: { id: userId }
    });
    
    const savedTeam = await teamRepository.save(team);
    
    logger.info(`Team created successfully: ${savedTeam.name} (ID: ${savedTeam.id})`);
    
    // Create players
    await createPlayersAsync(savedTeam.id, playerRepository);
    
    logger.info(`Team creation completed for user: ${userEmail} (ID: ${userId})`);
    
    // Emit Socket.IO event to notify frontend
    try {
      const io = getIO();
      io.to(`user-${userId}`).emit('team-created', {
        success: true,
        message: 'Team creation completed successfully!',
        teamId: savedTeam.id,
        teamName: savedTeam.name,
        playerCount: 20,
        timestamp: new Date().toISOString()
      });
      
      logger.info(`Socket.IO event emitted for user: ${userId}`);
    } catch (socketError) {
      logger.error(`Failed to emit Socket.IO event for user ${userId}:`, socketError);
      // Don't throw error here, team creation was successful
    }
    
  } catch (error) {
    logger.error(`Team creation failed for user ${userEmail}:`, error);
    
    // Emit error event to frontend
    try {
      const io = getIO();
      io.to(`user-${userId}`).emit('team-creation-failed', {
        success: false,
        message: 'Team creation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } catch (socketError) {
      logger.error(`Failed to emit Socket.IO error event for user ${userId}:`, socketError);
    }
    
    throw error;
  }
}

async function createPlayersAsync(teamId: string, playerRepository: any): Promise<void> {
  const players = [
    // Goalkeepers (3)
    ...generatePlayers('GK', 3, 18, 35),
    // Defenders (6)
    ...generatePlayers('DEF', 6, 18, 35),
    // Midfielders (6)
    ...generatePlayers('MID', 6, 18, 35),
    // Attackers (5)
    ...generatePlayers('FWD', 5, 18, 35)
  ];

  for (const playerData of players) {
    const player = playerRepository.create({
      ...playerData,
      team: { id: teamId }
    });
    await playerRepository.save(player);
  }

  logger.info(`Created ${players.length} players for team: ${teamId}`);
}

function generatePlayers(position: string, count: number, minAge: number, maxAge: number): any[] {
  const players = [];
  const names = getPlayerNames(position);

  for (let i = 0; i < count; i++) {
    const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
    const overall = Math.floor(Math.random() * 30) + 60; // 60-89 overall
    const value = overall * 10000 + Math.floor(Math.random() * 50000);

    players.push({
      name: names[i % names.length],
      position,
      age,
      overall,
      value
    });
  }

  return players;
}

function getPlayerNames(position: string): string[] {
  const nameLists = {
    GK: ['David De Gea', 'Alisson Becker', 'Ederson', 'Thibaut Courtois', 'Marc-André ter Stegen'],
    DEF: ['Virgil van Dijk', 'Rúben Dias', 'Sergio Ramos', 'Kalidou Koulibaly', 'Marquinhos', 'Aymeric Laporte'],
    MID: ['Kevin De Bruyne', 'Luka Modrić', 'Toni Kroos', 'Frenkie de Jong', 'Jorginho', 'N\'Golo Kanté'],
    FWD: ['Lionel Messi', 'Cristiano Ronaldo', 'Kylian Mbappé', 'Erling Haaland', 'Robert Lewandowski']
  };

  return nameLists[position as keyof typeof nameLists] || ['Player'];
} 