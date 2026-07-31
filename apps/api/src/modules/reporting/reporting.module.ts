import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { ReaderAccessReportingController, ReportingController } from './reporting.controller';
import { ReportingService } from './reporting.service';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [ReportingController, ReaderAccessReportingController],
  providers: [ReportingService]
})
export class ReportingModule {}
