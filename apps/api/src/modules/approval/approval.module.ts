import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ApprovalController } from './approval.controller';
import { ApprovalService } from './approval.service';
import { ApprovalTransitionPolicy } from './approval.transition-policy';

@Module({
  imports: [AuthModule, DatabaseModule, NotificationsModule],
  controllers: [ApprovalController],
  providers: [ApprovalService, ApprovalTransitionPolicy],
  exports: [ApprovalService, ApprovalTransitionPolicy]
})
export class ApprovalModule {}
