import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ProcessingModule } from '../processing/processing.module';
import { StorageModule } from '../storage/storage.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({ imports: [AuthModule, StorageModule, ProcessingModule], controllers: [BooksController], providers: [BooksService], exports: [BooksService] })
export class BooksModule {}
