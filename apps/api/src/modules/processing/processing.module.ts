import { Module } from '@nestjs/common';
import { ProcessingQueue } from './processing.queue';

@Module({ providers: [ProcessingQueue], exports: [ProcessingQueue] })
export class ProcessingModule {}
