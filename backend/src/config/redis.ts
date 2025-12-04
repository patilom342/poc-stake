import Redis from 'ioredis';
import logger from '../utils/logger';

import dotenv from 'dotenv';
dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  logger.warn('REDIS_URL not found in environment variables', { service: 'Redis' });
} else {
  // Log masked URL for debugging
  const maskedUrl = redisUrl.replace(/:([^:@]+)@/, ':****@');
  logger.info(`Connecting to Redis at ${maskedUrl}`, { service: 'Redis' });
}

// @ts-ignore - Redis constructor handles undefined but types are strict
export const redisClient = new Redis(redisUrl || '', {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('connect', () => {
  logger.success('Connected to Redis', { service: 'Redis' });
});

redisClient.on('error', (err) => {
  logger.error(`Redis error: ${err.message}`, { service: 'Redis' });
});

redisClient.on('ready', () => {
  logger.info('Redis client ready', { service: 'Redis' });
});

export default redisClient;
