import { Inject, Injectable, Logger, OnModuleDestroy, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { BookUploadedEvent } from './events/book-uploaded.event';

export const PDF_PROCESSING_QUEUE = 'pdf-processing';

@Injectable()
export class ProcessingQueue implements OnModuleDestroy {
  private readonly logger = new Logger(ProcessingQueue.name);
  private readonly queue?: Queue<BookUploadedEvent>;

  constructor(@Inject(ConfigService) config: ConfigService) {
    const redisUrl = config.get<string>('REDIS_URL');
    if (redisUrl) {
      this.queue = new Queue<BookUploadedEvent>(PDF_PROCESSING_QUEUE, { connection: { url: redisUrl } });
    }
  }

  async enqueueBookUploaded(event: BookUploadedEvent): Promise<void> {
    const payload: BookUploadedEvent = {
      bookId: event.bookId,
      fileId: event.fileId,
      processingJobId: event.processingJobId
    };
    this.logger.log(
      `Queued processing job ${payload.processingJobId} for book ${payload.bookId} and file ${payload.fileId}.`
    );
    if (!this.queue) {
      this.logger.error('ProcessingQueue: Redis is not available. Cannot enqueue job.');
      throw new ServiceUnavailableException(
        'Processing queue is unavailable. Please ensure the Redis service is running.'
      );
    }
    await this.queue.add('book-uploaded', payload, { attempts: 3, removeOnComplete: true });
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue?.close();
  }
}
