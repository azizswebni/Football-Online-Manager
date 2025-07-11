import { DataSource } from 'typeorm';
import { ENV } from './env';
import { User } from '../models/User';
import { Team } from '../models/Team';
import { Player } from '../models/Player';
import { Transfer } from '../models/Transfer';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USER,
  password: ENV.DB_PASS,
  database: ENV.DB_NAME,
  synchronize: ENV.NODE_ENV === 'development', // true for dev only
  logging: ENV.NODE_ENV === 'development',
  entities: [User, Team, Player, Transfer],
  migrations: ['dist/migrations/*.js']
});