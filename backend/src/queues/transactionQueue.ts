import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import logger from '../utils/logger';

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const transactionQueue = new Queue('transaction-processing', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
  },
});

logger.info('Transaction queue initialized', { service: 'QueueService' });
