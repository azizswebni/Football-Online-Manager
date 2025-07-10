import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  // Server Configuration
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASS: process.env.DB_PASS || 'password',
  DB_NAME: process.env.DB_NAME || 'football_manager',
  
  // Redis Configuration
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // Cookie Configuration
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'default-cookie-secret-change-in-production',
  COOKIE_NAME: process.env.COOKIE_NAME || 'auth_token',
  COOKIE_MAX_AGE: Number(process.env.COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  COOKIE_HTTP_ONLY: process.env.COOKIE_HTTP_ONLY !== 'false', // true by default
  COOKIE_SECURE: process.env.NODE_ENV === 'production', // true in production
  COOKIE_SAME_SITE: (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax',
  
  // Application Configuration
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS) || 12,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Logging Configuration
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || 'logs'
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`⚠️  Warning: ${envVar} is not set, using default value`);
  }
}