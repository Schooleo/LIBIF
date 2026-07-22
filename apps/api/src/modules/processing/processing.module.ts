import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProcessingController } from './processing.controller';
import { ProcessingQueue } from './processing.queue';
import { ProcessingService } from './processing.service';

@Module({
  imports: [AuthModule, DatabaseModule, NotificationsModule],
  controllers: [ProcessingController],
  providers: [ProcessingQueue, ProcessingService],
  exports: [ProcessingQueue, ProcessingService]
})
export class ProcessingModule {}
