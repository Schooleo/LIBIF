import { Test, TestingModule } from '@nestjs/testing';
import { ProcessingService } from './processing.service';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UnprocessableEntityException, BadRequestException } from '@nestjs/common';
import { ProcessingJobStatus } from '../../generated/prisma/client';

describe('ProcessingService', () => {
  let service: ProcessingService;

  const mockPrisma: any = {
    processingJob: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn()
    },
    book: {
      update: jest.fn()
    },
    bookAuditEvent: {
      create: jest.fn()
    },
    approvalReview: {
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
          book: { title: 'Test Book' },
          type: 'PDF_OCR_PIPELINE',
          status: ProcessingJobStatus.QUEUED,
          stage: 'queued',
          progressPercent: 0,
          attempts: 0,
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
        bookTitle: 'Test Book',
        type: 'PDF_OCR_PIPELINE',
        status: 'QUEUED',
        stage: 'queued',
        progressPercent: 0,
        attempts: 0,
        errorMessage: null,
        createdAt: '2026-07-21T00:00:00.000Z',
        updatedAt: '2026-07-21T00:00:00.000Z'
      });
    });
  });

  describe('advanceJob', () => {
    it('should advance QUEUED job to RUNNING', async () => {
      const mockJob = {
        id: 'job-1',
        bookId: 'book-1',
        book: { title: 'Test Book' },
        status: ProcessingJobStatus.QUEUED
      };
      const mockUpdatedJob = {
        ...mockJob,
        status: ProcessingJobStatus.RUNNING,
        stage: 'performing_ocr',
        progressPercent: 50,
        attempts: 1,
        createdAt: new Date('2026-07-21T00:00:00Z'),
        updatedAt: new Date('2026-07-21T00:00:00Z')
      };

      mockPrisma.processingJob.findUnique.mockResolvedValueOnce(mockJob).mockResolvedValueOnce(mockUpdatedJob);

      const result = await service.advanceJob('job-1');

      expect(result.status).toBe('RUNNING');
      expect(mockPrisma.processingJob.update).toHaveBeenCalled();
      expect(mockPrisma.book.update).toHaveBeenCalledWith({
        where: { id: 'book-1' },
        data: { status: 'PROCESSING' }
      });
    });

    it('should advance RUNNING job to SUCCEEDED and create ApprovalReview', async () => {
      const mockJob = {
        id: 'job-1',
        bookId: 'book-1',
        book: { title: 'Test Book' },
        status: ProcessingJobStatus.RUNNING
      };
      const mockUpdatedJob = {
        ...mockJob,
        status: ProcessingJobStatus.SUCCEEDED,
        stage: 'completed',
        progressPercent: 100,
        attempts: 1,
        createdAt: new Date('2026-07-21T00:00:00Z'),
        updatedAt: new Date('2026-07-21T00:00:00Z')
      };

      mockPrisma.processingJob.findUnique.mockResolvedValueOnce(mockJob).mockResolvedValueOnce(mockUpdatedJob);
      mockPrisma.user.findMany.mockResolvedValue([{ id: 'admin-1' }]);

      const result = await service.advanceJob('job-1');

      expect(result.status).toBe('SUCCEEDED');
      expect(mockPrisma.book.update).toHaveBeenCalledWith({
        where: { id: 'book-1' },
        data: { status: 'PENDING_APPROVAL' }
      });
      expect(mockPrisma.approvalReview.create).toHaveBeenCalledWith({
        data: { bookId: 'book-1', status: 'PENDING' }
      });
      expect(mockNotifications.createNotification).toHaveBeenCalled();
    });

    it('should throw UnprocessableEntityException when advancing a SUCCEEDED job', async () => {
      const mockJob = {
        id: 'job-1',
        bookId: 'book-1',
        status: ProcessingJobStatus.SUCCEEDED
      };
      mockPrisma.processingJob.findUnique.mockResolvedValue(mockJob);

      await expect(service.advanceJob('job-1')).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('retryJob', () => {
    it('should throw BadRequestException if job is not FAILED', async () => {
      const mockJob = { id: 'job-1', status: ProcessingJobStatus.QUEUED };
      mockPrisma.processingJob.findUnique.mockResolvedValue(mockJob);

      await expect(service.retryJob('job-1')).rejects.toThrow(BadRequestException);
    });
  });
});
