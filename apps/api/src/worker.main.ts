import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('WorkerBootstrap');
  logger.log('Starting LIBIF background processing worker...');

  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init();

  logger.log('LIBIF background processing worker is running.');

  process.on('SIGTERM', async () => {
    logger.log('Worker received SIGTERM. Shutting down...');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.log('Worker received SIGINT. Shutting down...');
    await app.close();
    process.exit(0);
  });
}

void bootstrap();
