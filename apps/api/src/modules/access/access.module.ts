import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';

@Module({
  imports: [DatabaseModule, AuthModule, StorageModule],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
