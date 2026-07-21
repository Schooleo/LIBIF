import { Test, TestingModule } from '@nestjs/testing';
import { ProcessingService } from './processing.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { ProcessingJobStatus } from '../../generated/prisma/client';

describe('ProcessingService', () => {
  let service: ProcessingService;
  let prisma: PrismaService;

  const mockPrisma = {
    processingJob: {
      findMany: jest.fn(),
      findUnique: jest.fn()
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessingService,
        {
          provide: PrismaService,
          useValue: mockPrisma
        }
      ]
    }).compile();

    service = module.get<ProcessingService>(ProcessingService);
    prisma = module.get<PrismaService>(PrismaService);
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
          type: 'PDF_OCR_PIPELINE',
          status: ProcessingJobStatus.QUEUED,
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
        type: 'PDF_OCR_PIPELINE',
        status: 'QUEUED',
        attempts: 0,
        errorMessage: null,
        createdAt: '2026-07-21T00:00:00.000Z',
        updatedAt: '2026-07-21T00:00:00.000Z'
      });
      expect(prisma.processingJob.findMany).toHaveBeenCalled();
    });
  });

  describe('getJobById', () => {
    it('should return a job if found', async () => {
      const mockJob = {
        id: 'job-1',
        bookId: 'book-1',
        type: 'PDF_OCR_PIPELINE',
        status: ProcessingJobStatus.RUNNING,
        attempts: 1,
        errorMessage: 'Something went wrong',
        createdAt: new Date('2026-07-21T00:00:00Z'),
        updatedAt: new Date('2026-07-21T00:00:00Z')
      };
      mockPrisma.processingJob.findUnique.mockResolvedValue(mockJob);

      const result = await service.getJobById('job-1');

      expect(result).toEqual({
        id: 'job-1',
        bookId: 'book-1',
        type: 'PDF_OCR_PIPELINE',
        status: 'RUNNING',
        attempts: 1,
        errorMessage: 'Something went wrong',
        createdAt: '2026-07-21T00:00:00.000Z',
        updatedAt: '2026-07-21T00:00:00.000Z'
      });
      expect(prisma.processingJob.findUnique).toHaveBeenCalledWith({
        where: { id: 'job-1' }
      });
    });

    it('should throw NotFoundException if job not found', async () => {
      mockPrisma.processingJob.findUnique.mockResolvedValue(null);

      await expect(service.getJobById('job-2')).rejects.toThrow(NotFoundException);
    });
  });
});
