import { Module } from '@nestjs/common';
import { IsbnController } from './isbn.controller';
import { IsbnService } from './isbn.service';

@Module({ controllers: [IsbnController], providers: [IsbnService] })
export class IsbnModule {}
