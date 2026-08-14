import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { StorageModule } from '../storage/storage.module';
import { ProcessingController } from './processing.controller';
import { ProcessingQueue } from './processing.queue';
import { ProcessingService } from './processing.service';
import { ProcessingTransitionPolicy } from './processing.transition-policy';
import { DocumentTextSearchService } from './document-text-search.service';

@Module({
  imports: [AuthModule, DatabaseModule, NotificationsModule, StorageModule, ConfigModule],
  controllers: [ProcessingController],
  providers: [ProcessingQueue, ProcessingService, ProcessingTransitionPolicy, DocumentTextSearchService],
  exports: [ProcessingQueue, ProcessingService, ProcessingTransitionPolicy, DocumentTextSearchService]
})
export class ProcessingModule {}
