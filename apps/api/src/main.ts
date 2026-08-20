import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './common/http-error.filter';
import {
  API_SECURITY_HEADERS,
  configuredWebOrigins,
  createCorsOriginValidator
} from './common/http-security';
import { configureOpenApi } from './openapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const config = app.get(ConfigService);
  const expressApp = app.getHttpAdapter().getInstance();
  // Enable this only when the API is private behind a known reverse-proxy hop.
  if (config.get('LIBIF_TRUST_PROXY') === 'true') expressApp.set('trust proxy', 1);
  expressApp.disable('x-powered-by');
  app.enableCors({
    origin: createCorsOriginValidator(configuredWebOrigins(config)),
    credentials: true
  });
  app.use((_request: Request, response: Response, next: NextFunction) => {
    for (const [name, value] of Object.entries(API_SECURITY_HEADERS)) {
      response.setHeader(name, value);
    }
    next();
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpErrorFilter());
  configureOpenApi(app);
  const port = Number(config.get('API_PORT') ?? 3001);
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
