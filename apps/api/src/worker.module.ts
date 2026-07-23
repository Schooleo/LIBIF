import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OCR_ENGINE } from './modules/processing/ocr/ocr-engine.port';
import { PdftotextOcrEngineAdapter } from './modules/processing/ocr/pdftotext-ocr-engine.adapter';
import { ProcessingProcessor } from './modules/processing/processing.processor';
import { ProcessingQueue } from './modules/processing/processing.queue';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local', '../../.env', '../../.env.local']
    }),
    DatabaseModule,
    NotificationsModule,
    StorageModule
  ],
  providers: [
    ProcessingQueue,
    ProcessingProcessor,
    PdftotextOcrEngineAdapter,
    {
      provide: OCR_ENGINE,
      useClass: PdftotextOcrEngineAdapter
    }
  ],
  exports: [ProcessingQueue, ProcessingProcessor, OCR_ENGINE]
})
export class WorkerModule {}
