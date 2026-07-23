import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { RiskAlertService } from './risk-alert.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, RiskAlertService],
  exports: [NotificationsService, RiskAlertService]
})
export class NotificationsModule {}
