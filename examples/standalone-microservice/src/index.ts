import { StandaloneMicroservice } from './microservice';
import { loadConfig } from './config';
import { AppLoggerFactory } from '@node-yalc/logger';

const logger = AppLoggerFactory('Main');

async function main() {
  const config = loadConfig();
  const service = new StandaloneMicroservice(config);

  await service.start();

  const shutdown = async () => {
    logger.log('Initiating graceful shutdown...');
    await service.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

if (require.main === module) {
  main().catch((err) => {
    logger.error('Startup failed:', err);
    process.exit(1);
  });
}
