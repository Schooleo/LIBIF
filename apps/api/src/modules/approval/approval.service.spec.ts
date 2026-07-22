import { Test, TestingModule } from '@nestjs/testing';
import { ApprovalService } from './approval.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { ApprovalReviewStatus } from '../../generated/prisma/client';

describe('ApprovalService', () => {
  let service: ApprovalService;

  const mockPrisma: any = {
    approvalReview: {
      findMany: jest.fn(),
      findUnique: jest.fn()
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApprovalService,
        {
          provide: PrismaService,
          useValue: mockPrisma
        }
      ]
    }).compile();

    service = module.get<ApprovalService>(ApprovalService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('listPendingReviews', () => {
    it('should return pending approval reviews', async () => {
      const mockReviews = [
        {
          id: 'review-1',
          bookId: 'book-1',
          book: { title: 'Clean Architecture' },
          reviewerId: null,
          status: ApprovalReviewStatus.PENDING,
          reason: null,
          requestedChanges: null,
          decidedAt: null,
          createdAt: new Date('2026-07-22T00:00:00Z'),
          updatedAt: new Date('2026-07-22T00:00:00Z')
        }
      ];

      mockPrisma.approvalReview.findMany.mockResolvedValue(mockReviews);

      const result = await service.listPendingReviews();

      expect(result).toHaveLength(1);
      expect(mockPrisma.approvalReview.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: {
          status: ApprovalReviewStatus.PENDING,
          book: { status: 'PENDING_APPROVAL' }
        }
      }));
      expect(result[0]).toEqual({
        id: 'review-1',
        bookId: 'book-1',
        bookTitle: 'Clean Architecture',
        reviewerId: null,
        status: 'PENDING',
        reason: null,
        requestedChanges: null,
        decidedAt: null,
        createdAt: '2026-07-22T00:00:00.000Z',
        updatedAt: '2026-07-22T00:00:00.000Z'
      });
    });

    it('returns only the latest pending review for each document', async () => {
      const baseReview = {
        bookId: 'book-1',
        book: { title: 'Clean Architecture' },
        reviewerId: null,
        status: ApprovalReviewStatus.PENDING,
        reason: null,
        requestedChanges: null,
        decidedAt: null,
        updatedAt: new Date('2026-07-22T00:00:00Z')
      };
      mockPrisma.approvalReview.findMany.mockResolvedValue([
        { ...baseReview, id: 'review-new', createdAt: new Date('2026-07-22T00:00:00Z') },
        { ...baseReview, id: 'review-old', createdAt: new Date('2026-07-21T00:00:00Z') }
      ]);

      const result = await service.listPendingReviews();

      expect(result.map((review) => review.id)).toEqual(['review-new']);
    });
  });

  describe('getReviewById', () => {
    it('should throw NotFoundException if review does not exist', async () => {
      mockPrisma.approvalReview.findUnique.mockResolvedValue(null);

      await expect(service.getReviewById('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
