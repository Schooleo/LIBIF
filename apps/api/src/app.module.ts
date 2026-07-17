import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './modules/books/books.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { DatabaseModule } from './modules/database/database.module';
import { HealthModule } from './modules/health/health.module';
import { IsbnModule } from './modules/isbn/isbn.module';
import { ProcessingModule } from './modules/processing/processing.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '../../.env', '../../.env.local']
    }),
    DatabaseModule,
    StorageModule,
    ProcessingModule,
    BooksModule,
    CatalogModule,
    IsbnModule,
    HealthModule
  ]
})
export class AppModule {}
