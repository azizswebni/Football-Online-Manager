import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/User';
import { Team } from '../models/Team';
import { Player } from '../models/Player';
import { generateToken } from '../utils/jwt';
import { ENV } from '../config/env';
import logger from '../config/logger';
import { AuthDto, AuthResponseDto } from '../dtos/auth.dto';
import { TeamCreationData } from '../interfaces/auth.interface';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private teamRepository = AppDataSource.getRepository(Team);
  private playerRepository = AppDataSource.getRepository(Player);

  async authenticateUser(authData: AuthDto): Promise<AuthResponseDto> {
    const { email, password } = authData;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
      relations: ['team']
    });

    if (existingUser) {
      // Login flow
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken({
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role
      });

      logger.info(`User logged in: ${email}`);

      return {
        token,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          role: existingUser.role
        },
        message: 'Login successful'
      };
    } else {
      // Registration flow
      const hashedPassword = await bcrypt.hash(password, ENV.BCRYPT_ROUNDS);
      
      const newUser = this.userRepository.create({
        email,
        password: hashedPassword
      });

      const savedUser = await this.userRepository.save(newUser);

      // Start asynchronous team creation
      this.createTeamAsync({
        userId: savedUser.id,
        userEmail: savedUser.email
      });

      const token = generateToken({
        userId: savedUser.id,
        email: savedUser.email,
        role: savedUser.role
      });

      logger.info(`New user registered: ${email}`);

      return {
        token,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          role: savedUser.role
        },
        message: 'Registration successful. Team creation in progress...'
      };
    }
  }

  private async createTeamAsync(teamData: TeamCreationData): Promise<void> {
    try {
      logger.info(`Starting team creation for user: ${teamData.userEmail}`);

      // Create team
      const team = this.teamRepository.create({
        name: `${teamData.userEmail.split('@')[0]} FC`,
        budget: 5000000
      });

      const savedTeam = await this.teamRepository.save(team);

      // Create players asynchronously
      await this.createPlayersAsync(savedTeam.id);

      // Update user with team
      await this.userRepository.update(teamData.userId, {
        team: savedTeam
      });

      logger.info(`Team creation completed for user: ${teamData.userEmail}`);
    } catch (error) {
      logger.error(`Team creation failed for user ${teamData.userEmail}:`, error);
    }
  }

  private async createPlayersAsync(teamId: string): Promise<void> {
    const players = [
      // Goalkeepers (3)
      ...this.generatePlayers('GK', 3, 18, 35),
      // Defenders (6)
      ...this.generatePlayers('DEF', 6, 18, 35),
      // Midfielders (6)
      ...this.generatePlayers('MID', 6, 18, 35),
      // Attackers (5)
      ...this.generatePlayers('FWD', 5, 18, 35)
    ];

    for (const playerData of players) {
      const player = this.playerRepository.create({
        ...playerData,
        team: { id: teamId }
      });
      await this.playerRepository.save(player);
    }

    logger.info(`Created ${players.length} players for team: ${teamId}`);
  }

  private generatePlayers(position: string, count: number, minAge: number, maxAge: number): any[] {
    const players = [];
    const names = this.getPlayerNames(position);

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

  private getPlayerNames(position: string): string[] {
    const nameLists = {
      GK: ['David De Gea', 'Alisson Becker', 'Ederson', 'Thibaut Courtois', 'Marc-André ter Stegen'],
      DEF: ['Virgil van Dijk', 'Rúben Dias', 'Sergio Ramos', 'Kalidou Koulibaly', 'Marquinhos', 'Aymeric Laporte'],
      MID: ['Kevin De Bruyne', 'Luka Modrić', 'Toni Kroos', 'Frenkie de Jong', 'Jorginho', 'N\'Golo Kanté'],
      FWD: ['Lionel Messi', 'Cristiano Ronaldo', 'Kylian Mbappé', 'Erling Haaland', 'Robert Lewandowski']
    };

    return nameLists[position as keyof typeof nameLists] || ['Player'];
  }
} 