import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { BooksModule } from './modules/books/books.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { DatabaseModule } from './modules/database/database.module';
import { HealthModule } from './modules/health/health.module';
import { IsbnModule } from './modules/isbn/isbn.module';
import { ProcessingModule } from './modules/processing/processing.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '../../.env', '../../.env.local']
    }),
    DatabaseModule,
    AuthModule,
    StorageModule,
    ProcessingModule,
    ReportingModule,
    BooksModule,
    CatalogModule,
    IsbnModule,
    HealthModule
  ]
})
export class AppModule {}
