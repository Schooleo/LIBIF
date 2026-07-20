import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { BookUploadedEvent } from './events/book-uploaded.event';

export const PDF_PROCESSING_QUEUE = 'pdf-processing';

@Injectable()
export class ProcessingQueue {
  private readonly logger = new Logger(ProcessingQueue.name);
  private readonly queue?: Queue<BookUploadedEvent>;

  constructor(@Inject(ConfigService) config: ConfigService) {
    const redisUrl = config.get<string>('REDIS_URL');
    if (redisUrl) {
      this.queue = new Queue<BookUploadedEvent>(PDF_PROCESSING_QUEUE, { connection: { url: redisUrl } });
    }
  }

  async enqueueBookUploaded(event: BookUploadedEvent): Promise<void> {
    this.logger.log(`BookUploadedEvent ${JSON.stringify(event)}`);
    if (!this.queue) {
      return;
    }
    await this.queue.add('book-uploaded', event, { attempts: 3, removeOnComplete: true });
  }
}
