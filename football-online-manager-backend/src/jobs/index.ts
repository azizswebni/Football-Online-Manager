import { teamCreationQueue } from '../config/queue';
import { processTeamCreation } from './teamCreation.job';
import logger from '../config/logger';

export function initializeJobProcessors(): void {
  // Register job processors 
  teamCreationQueue.process(processTeamCreation);
  
  logger.info('✅ Job processors initialized');
} 