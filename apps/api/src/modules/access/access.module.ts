import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RiskAlertService } from '../notifications/risk-alert.service';
import { RenderingModule } from '../rendering/rendering.module';
import { StorageModule } from '../storage/storage.module';
import { READER_RISK_EVENT_SINK } from './contracts/reader-access.contract';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';
import { ReaderAccessAuditService } from './reader-access-audit.service';
import { ReaderRateLimitService } from './reader-rate-limit.service';

@Module({
  imports: [DatabaseModule, AuthModule, StorageModule, RenderingModule, NotificationsModule],
  controllers: [AccessController],
  providers: [
    AccessService,
    ReaderAccessAuditService,
    ReaderRateLimitService,
    {
      provide: READER_RISK_EVENT_SINK,
      useExisting: RiskAlertService,
    },
  ],
  exports: [AccessService, ReaderAccessAuditService, ReaderRateLimitService],
})
export class AccessModule {}
