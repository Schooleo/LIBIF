import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { configureOpenApi } from './openapi';

async function generate() {
  const app = await NestFactory.create(AppModule, { abortOnError: false, logger: ['error'] });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const document = configureOpenApi(app);
  const outputDirectory = join(process.cwd(), 'openapi');
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(join(outputDirectory, 'libif-api.json'), `${JSON.stringify(document, null, 2)}\n`);
  await app.close();
  process.exit(0);
}

generate().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
