import { Test, TestingModule } from '@nestjs/testing';
import { ProcessingService } from './processing.service';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ProcessingQueue } from './processing.queue';
import { BadRequestException } from '@nestjs/common';
import { ProcessingJobStatus } from '../../generated/prisma/client';

describe('ProcessingService', () => {
  let service: ProcessingService;

  const mockPrisma: any = {
    processingJob: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn()
    },
    book: {
      update: jest.fn()
    },
    bookAuditEvent: {
      create: jest.fn()
    },
    approvalReview: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn()
    },
    user: {
      findMany: jest.fn()
    },
    $transaction: jest.fn((cb: any) => cb(mockPrisma))
  };

  const mockNotifications = {
    createNotification: jest.fn()
  };

  const mockProcessingQueue = {
    enqueueBookUploaded: jest.fn().mockResolvedValue(undefined)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessingService,
        {
          provide: PrismaService,
          useValue: mockPrisma
        },
        {
          provide: NotificationsService,
          useValue: mockNotifications
        },
        {
          provide: ProcessingQueue,
          useValue: mockProcessingQueue
        }
      ]
    }).compile();

    service = module.get<ProcessingService>(ProcessingService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listJobs', () => {
    it('should return a list of processing jobs', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          bookId: 'book-1',
          bookFileId: 'file-1',
          book: { title: 'Test Book', status: 'PENDING_PROCESSING' },
          type: 'PDF_OCR_PIPELINE',
          status: ProcessingJobStatus.QUEUED,
          stage: 'queued',
          progressPercent: 0,
          attemptNumber: 1,
          attempts: 0,
          retryOfJobId: null,
          terminalReason: null,
          errorMessage: null,
          createdAt: new Date('2026-07-21T00:00:00Z'),
          updatedAt: new Date('2026-07-21T00:00:00Z')
        }
      ];
      mockPrisma.processingJob.findMany.mockResolvedValue(mockJobs);

      const result = await service.listJobs();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'job-1',
        bookId: 'book-1',
        bookFileId: 'file-1',
        bookTitle: 'Test Book',
        bookStatus: 'PENDING_PROCESSING',
        type: 'PDF_OCR_PIPELINE',
        status: 'QUEUED',
        stage: 'queued',
        progressPercent: 0,
        attemptNumber: 1,
        attempts: 0,
        retryOfJobId: null,
        terminalReason: null,
        errorMessage: null,
        createdAt: '2026-07-21T00:00:00.000Z',
        updatedAt: '2026-07-21T00:00:00.000Z'
      });
    });

    it('returns only the latest processing job for each document', async () => {
      const baseJob = {
        book: { title: 'Test Book' },
        type: 'PDF_OCR_PIPELINE',
        stage: 'completed',
        progressPercent: 100,
        attempts: 1,
        errorMessage: null,
        updatedAt: new Date('2026-07-22T00:00:00Z')
      };
      mockPrisma.processingJob.findMany.mockResolvedValue([
        { ...baseJob, id: 'job-new', bookId: 'book-1', status: ProcessingJobStatus.QUEUED, createdAt: new Date('2026-07-22T00:00:00Z') },
        { ...baseJob, id: 'job-other', bookId: 'book-2', status: ProcessingJobStatus.SUCCEEDED, createdAt: new Date('2026-07-21T00:00:00Z') },
        { ...baseJob, id: 'job-old', bookId: 'book-1', status: ProcessingJobStatus.SUCCEEDED, createdAt: new Date('2026-07-20T00:00:00Z') }
      ]);

      const result = await service.listJobs();

      expect(result.map((job) => job.id)).toEqual(['job-new', 'job-other']);
    });
  });

  describe('retryJob', () => {
    it('should create a new retry job with lineage when job is FAILED', async () => {
      const mockFailedJob = {
        id: 'job-failed-1',
        bookId: 'book-1',
        bookFileId: 'file-1',
        bookFile: { objectKey: 'books/book-1/file.pdf' },
        type: 'PDF_OCR_PIPELINE',
        status: ProcessingJobStatus.FAILED,
        attemptNumber: 1,
        attempts: 1
      };

      const mockCreatedJob = {
        id: 'job-retry-2',
        bookId: 'book-1',
        bookFileId: 'file-1',
        book: { title: 'Test Book' },
        type: 'PDF_OCR_PIPELINE',
        status: ProcessingJobStatus.QUEUED,
        stage: 'queued',
        progressPercent: 0,
        attemptNumber: 2,
        attempts: 2,
        retryOfJobId: 'job-failed-1',
        terminalReason: null,
        errorMessage: null,
        createdAt: new Date('2026-07-22T01:00:00Z'),
        updatedAt: new Date('2026-07-22T01:00:00Z')
      };

      mockPrisma.processingJob.findUnique.mockResolvedValue(mockFailedJob);
      mockPrisma.processingJob.create.mockResolvedValue(mockCreatedJob);

      const result = await service.retryJob('job-failed-1');

      expect(mockPrisma.processingJob.update).toHaveBeenCalledWith({
        where: { id: 'job-failed-1' },
        data: { supersededAt: expect.any(Date) }
      });

      expect(mockPrisma.processingJob.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          bookId: 'book-1',
          bookFileId: 'file-1',
          status: ProcessingJobStatus.QUEUED,
          attemptNumber: 2,
          retryOfJobId: 'job-failed-1'
        }),
        include: { book: { select: { title: true } } }
      });

      expect(mockProcessingQueue.enqueueBookUploaded).toHaveBeenCalledWith({
        bookId: 'book-1',
        fileId: 'file-1',
        objectKey: 'books/book-1/file.pdf',
        processingJobId: 'job-retry-2'
      });

      expect(result.id).toBe('job-retry-2');
      expect(result.retryOfJobId).toBe('job-failed-1');
    });

    it('should throw BadRequestException if job is not FAILED', async () => {
      const mockJob = { id: 'job-1', status: ProcessingJobStatus.QUEUED };
      mockPrisma.processingJob.findUnique.mockResolvedValue(mockJob);

      await expect(service.retryJob('job-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getJobHistory', () => {
    it('should return current job and full history for document', async () => {
      const currentJob = {
        id: 'job-2',
        bookId: 'book-1',
        bookFileId: 'file-1',
        book: { title: 'Test Book' },
        type: 'PDF_OCR_PIPELINE',
        status: ProcessingJobStatus.QUEUED,
        stage: 'queued',
        progressPercent: 0,
        attemptNumber: 2,
        attempts: 2,
        retryOfJobId: 'job-1',
        createdAt: new Date('2026-07-22T01:00:00Z'),
        updatedAt: new Date('2026-07-22T01:00:00Z')
      };

      const oldJob = {
        id: 'job-1',
        bookId: 'book-1',
        bookFileId: 'file-1',
        book: { title: 'Test Book' },
        type: 'PDF_OCR_PIPELINE',
        status: ProcessingJobStatus.FAILED,
        stage: 'failed',
        progressPercent: 40,
        attemptNumber: 1,
        attempts: 1,
        retryOfJobId: null,
        createdAt: new Date('2026-07-22T00:00:00Z'),
        updatedAt: new Date('2026-07-22T00:05:00Z')
      };

      mockPrisma.processingJob.findUnique.mockResolvedValue(currentJob);
      mockPrisma.processingJob.findMany.mockResolvedValue([currentJob, oldJob]);

      const result = await service.getJobHistory('job-2');

      expect(result.current.id).toBe('job-2');
      expect(result.history).toHaveLength(2);
      expect(result.history[1].id).toBe('job-1');
    });
  });
});
