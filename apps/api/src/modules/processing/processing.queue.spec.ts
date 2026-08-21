import { Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { BookUploadedEvent } from './events/book-uploaded.event';
import { ProcessingQueue } from './processing.queue';

const mockAdd = jest.fn().mockResolvedValue(undefined);
const mockClose = jest.fn().mockResolvedValue(undefined);

jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({ add: mockAdd, close: mockClose }))
}));

describe('ProcessingQueue privacy boundary', () => {
  let log: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    log = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('publishes identifiers only even when a legacy caller supplies a storage object key', async () => {
    const queue = new ProcessingQueue({
      get: jest.fn().mockReturnValue('redis://localhost:6379')
    } as unknown as ConfigService);

    const legacyEvent: BookUploadedEvent & { objectKey: string } = {
      bookId: 'book-1',
      fileId: 'file-1',
      processingJobId: 'job-1',
      objectKey: 'raw-books/private-document.pdf'
    };
    await queue.enqueueBookUploaded(legacyEvent);

    expect(Queue).toHaveBeenCalled();
    expect(mockAdd).toHaveBeenCalledWith(
      'book-uploaded',
      {
        bookId: 'book-1',
        fileId: 'file-1',
        processingJobId: 'job-1'
      },
      { attempts: 3, removeOnComplete: true }
    );
    expect(log.mock.calls.flat().join(' ')).not.toContain('raw-books/private-document.pdf');
  });

  it('fails without publishing when Redis is not configured', async () => {
    const queue = new ProcessingQueue({
      get: jest.fn().mockReturnValue(undefined)
    } as unknown as ConfigService);

    await expect(
      queue.enqueueBookUploaded({
        bookId: 'book-1',
        fileId: 'file-1',
        processingJobId: 'job-1'
      })
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
    expect(mockAdd).not.toHaveBeenCalled();
  });
});
