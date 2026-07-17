import { Module } from '@nestjs/common';
import { ProcessingModule } from '../processing/processing.module';
import { StorageModule } from '../storage/storage.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({ imports: [StorageModule, ProcessingModule], controllers: [BooksController], providers: [BooksService], exports: [BooksService] })
export class BooksModule {}
