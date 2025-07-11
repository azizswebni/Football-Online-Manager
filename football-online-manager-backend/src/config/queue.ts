import Queue from 'bull';
import { ENV } from './env';
import logger from './logger';

// Redis connection configuration
const redisConfig = {
  host: ENV.REDIS_HOST,
  port: ENV.REDIS_PORT,
};

// Create a basic queue
export const teamCreationQueue = new Queue('team-creation', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 10,
    removeOnFail: 5,
  },
});

// Queue event listeners
teamCreationQueue.on('error', (error) => {
  logger.error('Team creation queue error:', error);
});

teamCreationQueue.on('completed', (job) => {
  logger.info(`Team creation job ${job.id} completed`);
});

teamCreationQueue.on('failed', (job, error) => {
  logger.error(`Team creation job ${job.id} failed:`, error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Shutting down queues gracefully...');
  await teamCreationQueue.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Shutting down queues gracefully...');
  await teamCreationQueue.close();
  process.exit(0);
});

export default {
  teamCreationQueue,
}; 