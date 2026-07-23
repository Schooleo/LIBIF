import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { PROTECTED_PAGE_RENDERER } from '../rendering/protected-page-renderer.port';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';
import { ReaderAccessAuditService } from './reader-access-audit.service';
import { ReaderRateLimitService } from './reader-rate-limit.service';
import { StubProtectedPageRenderer } from './stub-page-renderer';

@Module({
  imports: [DatabaseModule, AuthModule, StorageModule],
  controllers: [AccessController],
  providers: [
    AccessService,
    ReaderAccessAuditService,
    ReaderRateLimitService,
    {
      provide: PROTECTED_PAGE_RENDERER,
      useClass: StubProtectedPageRenderer,
    },
  ],
  exports: [AccessService, ReaderAccessAuditService, ReaderRateLimitService],
})
export class AccessModule {}
