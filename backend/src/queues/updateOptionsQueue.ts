import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { fetchAllTokensData } from '../services/dexService';
import ProtocolOption from '../models/ProtocolOption';
import logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Crear cola para actualizar opciones de staking
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
 * Worker para procesar job de actualización de opciones
 */
export const updateOptionsWorker = new Worker('update-staking-options', async (job: Job) => {
  logger.info(`Processing update options job: ${job.id}`, { 
    service: 'Queue', method: 'updateOptionsWorker'
  });

  try {
    const network = process.env.ACTIVE_NETWORK || 'sepolia';
    
    // Obtener datos de todos los DEX
    const allData = await fetchAllTokensData();
    
    let totalUpdated = 0;
    let totalCreated = 0;

    // Obtener direcciones de adapters del deployment
    // Intentar cargar deployment de la red activa, fallback a localhost si no existe
    let deploymentPath = path.join(__dirname, '../../../contracts/deployments', `${network}.json`);
    
    if (!fs.existsSync(deploymentPath)) {
      logger.warn(`Deployment file for ${network} not found, trying localhost fallback`, { service: 'Queue', method: 'updateOptionsWorker' });
      deploymentPath = path.join(__dirname, '../../../contracts/deployments', 'localhost.json');
    }
    
    let adapters: any = {};
    if (fs.existsSync(deploymentPath)) {
      const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'));
      adapters = deployment.contracts.Adapters;
      logger.info(`Loaded adapters from ${deploymentPath}`, { service: 'Queue', method: 'updateOptionsWorker' });
    } else {
      logger.error('No deployment file found (checked network and localhost)', { service: 'Queue', method: 'updateOptionsWorker' });
    }

    // Mapeo de protocolos a adapters
    const adapterMapping: Record<string, string> = {
      'Uniswap V3': adapters.Uniswap || '0x0000000000000000000000000000000000000000',
      'Aave V3': adapters.Aave || '0x0000000000000000000000000000000000000000',
      'Lido': adapters.Lido || '0x0000000000000000000000000000000000000000',
      'Marinade': '0x0000000000000000000000000000000000000000', // Mock address for SOL
      'Jito': '0x0000000000000000000000000000000000000000'     // Mock address for SOL
    };

    // Actualizar o crear opciones para cada token
    for (const [token, dexData] of Object.entries(allData)) {
      for (const data of dexData) {
        const optionId = `${data.protocol.toLowerCase().replace(/\s+/g, '-')}-${token.toLowerCase()}-${network}`;
        
        const optionData = {
          id: optionId,
          protocol: data.protocol,
          token: token,
          apy: data.apy,
          tvl: data.tvl,
          risk: data.risk,
          adapterAddress: adapterMapping[data.protocol] || '0x0000000000000000000000000000000000000000',
          isActive: true,
          network: network
        };

        const existing = await ProtocolOption.findOne({ id: optionId });
        
        if (existing) {
          // Actualizar solo APY y TVL (datos dinámicos)
          await ProtocolOption.updateOne(
            { id: optionId },
            { 
              $set: { 
                apy: data.apy, 
                tvl: data.tvl,
                updatedAt: new Date()
              } 
            }
          );
          totalUpdated++;
        } else {
          // Crear nueva opción
          await ProtocolOption.create(optionData);
          totalCreated++;
        }
      }
    }

    logger.success(`Updated ${totalUpdated} and created ${totalCreated} staking options - Job: ${job.id}`, {
      service: 'Queue', method: 'updateOptionsWorker'
    });

    return { 
      success: true, 
      updated: totalUpdated, 
      created: totalCreated,
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
 * Eventos del worker
 */
updateOptionsWorker.on('completed', (job, result) => {
  logger.success(`Job ${job.id} completed - Updated: ${result.updated}, Created: ${result.created}`, {
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
 * Programar job recurrente (cada 5 minutos)
 */
export async function scheduleUpdateOptions() {
  // En BullMQ, los jobs repetibles se manejan mejor eliminando los anteriores con el mismo ID
  // o usando una configuración de repetición limpia.
  
  // Agregar job recurrente
  await updateOptionsQueue.add(
    'update-options-recurring',
    {},
    {
      repeat: {
        every: 5 * 60 * 1000, // 5 minutos
      },
    }
  );

  // Ejecutar inmediatamente al iniciar (job único)
  await updateOptionsQueue.add('update-options-initial', {});

  logger.success('Scheduled update options job (every 5 minutes)', {
    service: 'Queue', method: 'scheduleUpdateOptions'
  });
}

export default updateOptionsQueue;
