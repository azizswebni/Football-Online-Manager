import { DataSource } from 'typeorm';
import { ENV } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USER,
  password: ENV.DB_PASS,
  database: ENV.DB_NAME,
  synchronize: false, // true for dev only
  logging: false,
  entities: [],
  migrations: ['dist/migrations/*.js']
});