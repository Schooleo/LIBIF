import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccessModule } from './modules/access/access.module';
import { ApprovalModule } from './modules/approval/approval.module';
import { AuthModule } from './modules/auth/auth.module';
import { BooksModule } from './modules/books/books.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { DatabaseModule } from './modules/database/database.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { HealthModule } from './modules/health/health.module';
import { IsbnModule } from './modules/isbn/isbn.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ProcessingModule } from './modules/processing/processing.module';
import { ReaderModule } from './modules/reader/reader.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { StorageModule } from './modules/storage/storage.module';
import { TaxonomyModule } from './modules/taxonomy/taxonomy.module';
import { UploadModule } from './modules/upload/upload.module';

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
    ApprovalModule,
    NotificationsModule,
    ReportingModule,
    BooksModule,
    CatalogModule,
    DocumentsModule,
    UploadModule,
    IsbnModule,
    HealthModule,
    ReaderModule,
    AccessModule,
    TaxonomyModule
  ]
})
export class AppModule {}
