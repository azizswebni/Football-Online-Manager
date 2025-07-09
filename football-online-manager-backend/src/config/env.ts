import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 4000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USER: process.env.DB_USER!,
  DB_PASS: process.env.DB_PASS!,
  DB_NAME: process.env.DB_NAME!,
  JWT_SECRET: process.env.JWT_SECRET!
};