import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { fetchAllTokensData, DEXData } from '../services/dexService';
import { getConfiguredAdapters } from '../config/adapters';
import ProtocolOption from '../models/ProtocolOption';
import logger from '../utils/logger';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Create queue for updating staking options
export const updateOptionsQueue = new Queue('update-staking-options', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
});

/**
 * Worker to process staking options update job
 * 
 * This worker:
 * 1. Fetches real-time data from DeFiLlama
 * 2. Only creates/updates options for protocols with configured adapters
 * 3. Calculates dynamic risk based on TVL
 * 4. Deactivates options for protocols no longer supported
 */
export const updateOptionsWorker = new Worker('update-staking-options', async (job: Job) => {
  logger.info(`Processing update options job: ${job.id}`, {
    service: 'Queue', method: 'updateOptionsWorker'
  });

  try {
    const network = process.env.ACTIVE_NETWORK || 'sepolia';
    
    // Check configured adapters
    const configuredAdapters = getConfiguredAdapters();
    if (configuredAdapters.length === 0) {
      logger.warn('No adapters configured! Skipping update. Set ADAPTER_UNISWAP, ADAPTER_AAVE, ADAPTER_LIDO environment variables.', {
        service: 'Queue', method: 'updateOptionsWorker'
      });
      return {
        success: false,
        reason: 'No adapters configured',
        timestamp: new Date().toISOString()
      };
    }

    // Fetch real data from DeFiLlama (already filtered by configured adapters)
    const allData = await fetchAllTokensData();

    let totalUpdated = 0;
    let totalCreated = 0;
    const processedIds: string[] = [];

    // Process each token's data
    for (const [token, dexDataArray] of Object.entries(allData)) {
      for (const data of dexDataArray) {
        // Validate adapter address exists
        if (!data.adapterAddress || data.adapterAddress === '0x0000000000000000000000000000000000000000') {
          logger.warn(`Skipping ${data.protocol} ${token}: Invalid adapter address`, {
            service: 'Queue', method: 'updateOptionsWorker'
          });
          continue;
        }

        const optionId = `${data.protocol.toLowerCase().replace(/\s+/g, '-')}-${token.toLowerCase()}-${network}`;
        processedIds.push(optionId);

        const optionData = {
          id: optionId,
          protocol: data.protocol,
          token: token,
          apy: data.apy,
          tvl: data.tvl,
          risk: data.risk,
          adapterAddress: data.adapterAddress,
          isActive: true,
          network: network
        };

        const existing = await ProtocolOption.findOne({ id: optionId });

        if (existing) {
          // Update dynamic data (APY, TVL, Risk can change)
          await ProtocolOption.updateOne(
            { id: optionId },
            {
              $set: {
                apy: data.apy,
                tvl: data.tvl,
                risk: data.risk,
                adapterAddress: data.adapterAddress, // Update in case it changed
                isActive: true,
                updatedAt: new Date()
              }
            }
          );
          totalUpdated++;
        } else {
          // Create new option
          await ProtocolOption.create(optionData);
          totalCreated++;
          logger.info(`Created new option: ${optionId}`, {
            service: 'Queue', method: 'updateOptionsWorker'
          });
        }
      }
    }

    // Deactivate options that are no longer supported
    // (e.g., adapter was removed from configuration)
    const deactivateResult = await ProtocolOption.updateMany(
      { 
        network: network,
        id: { $nin: processedIds },
        isActive: true
      },
      { 
        $set: { isActive: false, updatedAt: new Date() } 
      }
    );

    if (deactivateResult.modifiedCount > 0) {
      logger.info(`Deactivated ${deactivateResult.modifiedCount} stale options`, {
        service: 'Queue', method: 'updateOptionsWorker'
      });
    }

    logger.success(`Job ${job.id} completed - Updated: ${totalUpdated}, Created: ${totalCreated}`, {
      service: 'Queue', method: 'updateOptionsWorker'
    });

    return {
      success: true,
      updated: totalUpdated,
      created: totalCreated,
      deactivated: deactivateResult.modifiedCount,
      timestamp: new Date().toISOString()
    };

  } catch (error: any) {
    logger.error(`Error processing update options job ${job.id}: ${error.message}`, {
      service: 'Queue'
    });
    throw error;
  }
}, { connection });

/**
 * Worker events
 */
updateOptionsWorker.on('completed', (job, result) => {
  logger.success(`Job ${job.id} completed - Result: ${JSON.stringify(result)}`, {
    service: 'Queue', method: 'updateOptionsWorker'
  });
});

updateOptionsWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed: ${err.message}`, {
    service: 'Queue', method: 'updateOptionsWorker'
  });
});

updateOptionsWorker.on('error', (error) => {
  logger.error(`Worker error: ${error.message}`, {
    service: 'Queue', method: 'updateOptionsWorker'
  });
});

/**
 * Schedule recurring job (every 5 minutes)
 */
export async function scheduleUpdateOptions() {
  // Clear any existing repeatable jobs to avoid duplicates
  const existingJobs = await updateOptionsQueue.getRepeatableJobs();
  for (const job of existingJobs) {
    await updateOptionsQueue.removeRepeatableByKey(job.key);
  }

  // Add recurring job (every 5 minutes)
  await updateOptionsQueue.add(
    'update-options-recurring',
    {},
    {
      repeat: {
        every: 5 * 60 * 1000, // 5 minutes
      },
    }
  );

  // Execute immediately on startup
  await updateOptionsQueue.add('update-options-initial', {});

  logger.success('Scheduled update options job (every 5 minutes)', {
    service: 'Queue', method: 'scheduleUpdateOptions'
  });
}

export default updateOptionsQueue;
