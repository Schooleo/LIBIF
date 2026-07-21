import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProcessingController } from './processing.controller';
import { ProcessingQueue } from './processing.queue';
import { ProcessingService } from './processing.service';

@Module({
  imports: [AuthModule],
  controllers: [ProcessingController],
  providers: [ProcessingQueue, ProcessingService],
  exports: [ProcessingQueue, ProcessingService]
})
export class ProcessingModule {}

