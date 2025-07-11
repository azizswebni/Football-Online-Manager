import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { teamCreationQueue } from './queue';
import logger from './logger';

// Create Express adapter
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

// Create Bull Board
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [
    new BullAdapter(teamCreationQueue)
  ],
  serverAdapter: serverAdapter,
});

logger.info('✅ Bull Board initialized');

export { serverAdapter, addQueue, removeQueue, setQueues, replaceQueues }; 