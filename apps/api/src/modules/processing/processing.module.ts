import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProcessingController } from './processing.controller';
import { ProcessingQueue } from './processing.queue';
import { ProcessingService } from './processing.service';
import { ProcessingTransitionPolicy } from './processing.transition-policy';

@Module({
  imports: [AuthModule, DatabaseModule, NotificationsModule, ConfigModule],
  controllers: [ProcessingController],
  providers: [ProcessingQueue, ProcessingService, ProcessingTransitionPolicy],
  exports: [ProcessingQueue, ProcessingService, ProcessingTransitionPolicy]
})
export class ProcessingModule {}
