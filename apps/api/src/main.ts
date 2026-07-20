import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureOpenApi } from './openapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  configureOpenApi(app);
  const config = app.get(ConfigService);
  const port = Number(config.get('API_PORT') ?? 3001);
  await app.listen(port);
}

void bootstrap();
