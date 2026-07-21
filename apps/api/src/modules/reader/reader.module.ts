import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { ReaderController } from './reader.controller';
import { ReaderService } from './reader.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ReaderController],
  providers: [ReaderService],
  exports: [ReaderService],
})
export class ReaderModule {}
