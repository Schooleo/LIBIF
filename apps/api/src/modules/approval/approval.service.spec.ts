import { Test, TestingModule } from '@nestjs/testing';
import { ApprovalService } from './approval.service';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ApprovalReviewStatus, BookStatus, NotificationType } from '../../generated/prisma/client';

describe('ApprovalService', () => {
  let service: ApprovalService;

  const mockPrisma: any = {
    approvalReview: {
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
    $transaction: jest.fn((cb: any) => cb(mockPrisma))
  };

  const mockNotifications = {
    createNotification: jest.fn().mockResolvedValue({})
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApprovalService,
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
          bookFileId: 'file-1',
          processingJobId: 'job-1',
          round: 1,
          book: { title: 'Clean Architecture' },
          reviewerId: null,
          status: ApprovalReviewStatus.PENDING,
          reason: null,
          requestedChanges: null,
          decidedAt: null,
          supersededAt: null,
          createdAt: new Date('2026-07-22T00:00:00Z'),
          updatedAt: new Date('2026-07-22T00:00:00Z')
        }
      ];

      mockPrisma.approvalReview.findMany.mockResolvedValue(mockReviews);

      const result = await service.listPendingReviews();

      expect(result).toHaveLength(1);
      expect(mockPrisma.approvalReview.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: {
          status: ApprovalReviewStatus.PENDING
        }
      }));
      expect(result[0]).toEqual({
        id: 'review-1',
        bookId: 'book-1',
        bookFileId: 'file-1',
        processingJobId: 'job-1',
        round: 1,
        bookTitle: 'Clean Architecture',
        reviewerId: null,
        status: 'PENDING',
        reason: null,
        requestedChanges: null,
        decidedAt: null,
        supersededAt: null,
        createdAt: '2026-07-22T00:00:00.000Z',
        updatedAt: '2026-07-22T00:00:00.000Z'
      });
    });

    it('returns only the latest pending review for each document', async () => {
      const baseReview = {
        bookId: 'book-1',
        bookFileId: 'file-1',
        processingJobId: 'job-1',
        round: 1,
        book: { title: 'Clean Architecture' },
        reviewerId: null,
        status: ApprovalReviewStatus.PENDING,
        reason: null,
        requestedChanges: null,
        decidedAt: null,
        supersededAt: null,
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

  describe('approveAndPublish', () => {
    it('should approve, set Book status to PUBLISHED, and create notification', async () => {
      const mockPendingReview = {
        id: 'review-1',
        bookId: 'book-1',
        bookFileId: 'file-1',
        processingJobId: 'job-1',
        round: 1,
        status: ApprovalReviewStatus.PENDING,
        book: { id: 'book-1', title: 'Clean Architecture', createdById: 'user-creator' }
      };

      const mockUpdatedReview = {
        ...mockPendingReview,
        status: ApprovalReviewStatus.APPROVED,
        reviewerId: 'admin-1',
        decidedAt: new Date('2026-07-22T02:00:00Z'),
        updatedAt: new Date('2026-07-22T02:00:00Z'),
        createdAt: new Date('2026-07-22T01:00:00Z')
      };

      mockPrisma.approvalReview.findUnique.mockResolvedValue(mockPendingReview);
      mockPrisma.approvalReview.update.mockResolvedValue(mockUpdatedReview);

      const result = await service.approveAndPublish('review-1', 'admin-1', { comment: 'Looks great!' });

      expect(result.status).toBe('APPROVED');
      expect(mockPrisma.book.update).toHaveBeenCalledWith({
        where: { id: 'book-1' },
        data: { status: BookStatus.PUBLISHED }
      });
      expect(mockNotifications.createNotification).toHaveBeenCalledWith({
        recipientId: 'user-creator',
        type: NotificationType.DOCUMENT_AVAILABLE,
        title: 'Document Published',
        body: expect.stringContaining('Clean Architecture'),
        payload: { bookId: 'book-1', reviewId: 'review-1' },
        actionHref: '/catalogue/book-1'
      });
    });

    it('should throw ConflictException if review is not PENDING (idempotency test)', async () => {
      const mockApprovedReview = {
        id: 'review-1',
        status: ApprovalReviewStatus.APPROVED,
        book: { id: 'book-1', title: 'Clean Architecture', createdById: 'user-creator' }
      };
      mockPrisma.approvalReview.findUnique.mockResolvedValue(mockApprovedReview);

      await expect(service.approveAndPublish('review-1', 'admin-1')).rejects.toThrow(ConflictException);
    });
  });

  describe('rejectReview', () => {
    it('should reject review, set Book status to REJECTED, and create notification', async () => {
      const mockPendingReview = {
        id: 'review-1',
        bookId: 'book-1',
        bookFileId: 'file-1',
        processingJobId: 'job-1',
        round: 1,
        status: ApprovalReviewStatus.PENDING,
        book: { id: 'book-1', title: 'Clean Architecture', createdById: 'user-creator' }
      };

      const mockUpdatedReview = {
        ...mockPendingReview,
        status: ApprovalReviewStatus.REJECTED,
        reviewerId: 'admin-1',
        reason: 'Low OCR confidence',
        decidedAt: new Date('2026-07-22T02:00:00Z'),
        updatedAt: new Date('2026-07-22T02:00:00Z'),
        createdAt: new Date('2026-07-22T01:00:00Z')
      };

      mockPrisma.approvalReview.findUnique.mockResolvedValue(mockPendingReview);
      mockPrisma.approvalReview.update.mockResolvedValue(mockUpdatedReview);

      const result = await service.rejectReview('review-1', 'admin-1', { reason: 'Low OCR confidence' });

      expect(result.status).toBe('REJECTED');
      expect(mockPrisma.book.update).toHaveBeenCalledWith({
        where: { id: 'book-1' },
        data: { status: BookStatus.REJECTED }
      });
      expect(mockNotifications.createNotification).toHaveBeenCalled();
    });
  });

  describe('requestCorrection', () => {
    it('should request correction, set Book status to CORRECTION_REQUIRED, and create notification', async () => {
      const mockPendingReview = {
        id: 'review-1',
        bookId: 'book-1',
        bookFileId: 'file-1',
        processingJobId: 'job-1',
        round: 1,
        status: ApprovalReviewStatus.PENDING,
        book: { id: 'book-1', title: 'Clean Architecture', createdById: 'user-creator' }
      };

      const mockUpdatedReview = {
        ...mockPendingReview,
        status: ApprovalReviewStatus.CORRECTION_REQUESTED,
        reviewerId: 'admin-1',
        reason: 'Wrong category',
        requestedChanges: 'Change category to Software Architecture',
        decidedAt: new Date('2026-07-22T02:00:00Z'),
        updatedAt: new Date('2026-07-22T02:00:00Z'),
        createdAt: new Date('2026-07-22T01:00:00Z')
      };

      mockPrisma.approvalReview.findUnique.mockResolvedValue(mockPendingReview);
      mockPrisma.approvalReview.update.mockResolvedValue(mockUpdatedReview);

      const result = await service.requestCorrection('review-1', 'admin-1', {
        reason: 'Wrong category',
        requestedChanges: 'Change category to Software Architecture'
      });

      expect(result.status).toBe('CORRECTION_REQUESTED');
      expect(mockPrisma.book.update).toHaveBeenCalledWith({
        where: { id: 'book-1' },
        data: { status: BookStatus.CORRECTION_REQUIRED }
      });
      expect(mockNotifications.createNotification).toHaveBeenCalledWith({
        recipientId: 'user-creator',
        type: NotificationType.CORRECTION_REQUESTED,
        title: 'Correction Requested',
        body: expect.stringContaining('Wrong category'),
        payload: { bookId: 'book-1', reviewId: 'review-1' },
        actionHref: '/admin/documents/book-1/edit'
      });
    });
  });
});
