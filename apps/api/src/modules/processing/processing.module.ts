import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { StorageModule } from '../storage/storage.module';
import { PdftotextOcrEngineAdapter } from './ocr/pdftotext-ocr-engine.adapter';
import { OCR_ENGINE } from './ocr/ocr-engine.port';
import { ProcessingController } from './processing.controller';
import { ProcessingProcessor } from './processing.processor';
import { ProcessingQueue } from './processing.queue';
import { ProcessingService } from './processing.service';
import { ProcessingTransitionPolicy } from './processing.transition-policy';

@Module({
  imports: [AuthModule, DatabaseModule, NotificationsModule, StorageModule, ConfigModule],
  controllers: [ProcessingController],
  providers: [
    ProcessingQueue,
    ProcessingService,
    ProcessingTransitionPolicy,
    ProcessingProcessor,
    PdftotextOcrEngineAdapter,
    {
      provide: OCR_ENGINE,
      useClass: PdftotextOcrEngineAdapter
    }
  ],
  exports: [ProcessingQueue, ProcessingService, ProcessingTransitionPolicy, ProcessingProcessor, OCR_ENGINE]
})
export class ProcessingModule {}
