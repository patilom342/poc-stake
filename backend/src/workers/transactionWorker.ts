import { Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import StakingTransaction from '../models/StakingTransaction';
import logger from '../utils/logger';

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

interface StakeEventData {
  txHash: string;
  userAddress: string;
  protocol: string;
  token: string;
  tokenAddress: string;
  adapterAddress: string;
  amount: string;
  blockNumber: number;
  fee?: string;
}

interface UnstakeEventData {
  txHash: string;
  userAddress: string;
  protocol: string;
  token: string;
  amount: string;
  blockNumber: number;
}

// Map adapter addresses to protocol names
const ADAPTER_TO_PROTOCOL: Record<string, string> = {
  [process.env.SEPOLIA_UNISWAP_ADAPTER?.toLowerCase() || '']: 'Uniswap V3',
  [process.env.SEPOLIA_AAVE_ADAPTER?.toLowerCase() || '']: 'Aave V3',
  [process.env.SEPOLIA_LIDO_ADAPTER?.toLowerCase() || '']: 'Lido',
};

export const transactionWorker = new Worker<StakeEventData | UnstakeEventData>(
  'transaction-processing',
  async (job: Job<StakeEventData | UnstakeEventData>) => {
    const { txHash, userAddress, token, amount, blockNumber } = job.data;
    const jobName = job.name;
    
    logger.info(`Processing ${jobName} event for tx: ${txHash}`, { service: 'TransactionWorker' });

    try {
      if (jobName === 'process-stake') {
        const stakeData = job.data as StakeEventData;
        const { tokenAddress, adapterAddress, fee } = stakeData;
        
        // Determine protocol from adapter address
        const protocol = ADAPTER_TO_PROTOCOL[adapterAddress.toLowerCase()] || 'Unknown';
        
        // Handle stake event
        let transaction = await StakingTransaction.findOne({ txHash });

        if (transaction) {
          if (transaction.status !== 'confirmed') {
            transaction.status = 'confirmed';
            await transaction.save();
            logger.info(`Updated transaction ${txHash} to confirmed`, { service: 'TransactionWorker' });
          } else {
            logger.info(`Transaction ${txHash} already confirmed`, { service: 'TransactionWorker' });
          }
        } else {
          transaction = new StakingTransaction({
            userAddress: userAddress.toLowerCase(),
            protocol,
            token,
            tokenAddress,
            adapterAddress,
            amount,
            txHash,
            status: 'confirmed',
            fee: fee || '0',
            network: process.env.ACTIVE_NETWORK || 'sepolia',
            timestamp: new Date(),
          });
          
          await transaction.save();
          logger.info(`Created new stake transaction from event: ${txHash}`, { service: 'TransactionWorker' });
        }
      } else if (jobName === 'process-unstake') {
        // Handle unstake event
        // Find the original stake transaction and mark it as unstaked
        const transaction = await StakingTransaction.findOne({ 
          userAddress: userAddress.toLowerCase(),
          token,
          status: 'confirmed'
        }).sort({ timestamp: -1 }); // Get most recent stake

        if (transaction) {
          transaction.status = 'unstaked';
          transaction.unstakeTxHash = txHash;
          transaction.unstakedAt = new Date();
          await transaction.save();
          logger.info(`Marked transaction as unstaked: ${transaction.txHash} (unstake tx: ${txHash})`, { service: 'TransactionWorker' });
        } else {
          logger.warn(`No matching stake transaction found for unstake tx: ${txHash}`, { service: 'TransactionWorker' });
          // Optionally create a record of the unstake event anyway
        }
      }

      return { processed: true, txHash, jobName };
    } catch (error: any) {
      logger.error(`Error processing transaction ${txHash}: ${error.message}`, { service: 'TransactionWorker' });
      throw error;
    }
  },
  { connection: redisConnection }
);

transactionWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed`, { service: 'TransactionWorker' });
});

transactionWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed: ${err.message}`, { service: 'TransactionWorker' });
});
