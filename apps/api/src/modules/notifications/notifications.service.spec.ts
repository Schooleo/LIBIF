import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../database/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { NotificationStatus, NotificationType } from '../../generated/prisma/client';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockPrisma: any = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn()
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: PrismaService,
          useValue: mockPrisma
        }
      ]
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create and store a notification in Prisma', async () => {
      const dto = {
        recipientId: 'user-1',
        type: 'DOCUMENT_AVAILABLE',
        title: 'New Document Available',
        body: 'The document "Clean Code" is now available for reading.',
        payload: { bookId: 'book-1' }
      };

      const mockDbRecord = {
        id: 'notif-123',
        recipientId: 'user-1',
        type: NotificationType.DOCUMENT_AVAILABLE,
        title: dto.title,
        body: dto.body,
        payload: dto.payload,
        actionHref: null,
        status: NotificationStatus.UNREAD,
        readAt: null,
        createdAt: new Date('2026-07-22T00:00:00Z'),
        updatedAt: new Date('2026-07-22T00:00:00Z')
      };

      mockPrisma.notification.create.mockResolvedValue(mockDbRecord);

      const result = await service.createNotification(dto);

      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          recipientId: 'user-1',
          type: NotificationType.DOCUMENT_AVAILABLE,
          title: dto.title,
          body: dto.body
        })
      });

      expect(result).toEqual({
        id: 'notif-123',
        recipientId: 'user-1',
        type: 'DOCUMENT_AVAILABLE',
        title: dto.title,
        body: dto.body,
        payload: dto.payload,
        actionHref: null,
        isRead: false,
        readAt: null,
        createdAt: '2026-07-22T00:00:00.000Z'
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read when owned by recipient', async () => {
      const mockRecord = {
        id: 'notif-1',
        recipientId: 'user-1',
        type: NotificationType.DOCUMENT_AVAILABLE,
        title: 'Title',
        body: 'Body',
        payload: null,
        actionHref: null,
        status: NotificationStatus.UNREAD,
        readAt: null,
        createdAt: new Date('2026-07-22T00:00:00Z'),
        updatedAt: new Date('2026-07-22T00:00:00Z')
      };

      const mockUpdatedRecord = {
        ...mockRecord,
        status: NotificationStatus.READ,
        readAt: new Date('2026-07-22T00:01:00Z')
      };

      mockPrisma.notification.findUnique.mockResolvedValue(mockRecord);
      mockPrisma.notification.update.mockResolvedValue(mockUpdatedRecord);

      const updated = await service.markAsRead('notif-1', 'user-1');

      expect(updated.isRead).toBe(true);
      expect(mockPrisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-1' },
        data: {
          status: NotificationStatus.READ,
          readAt: expect.any(Date)
        }
      });
    });

    it('should throw ForbiddenException if notification belongs to another user', async () => {
      const mockRecord = {
        id: 'notif-1',
        recipientId: 'user-1',
        status: NotificationStatus.UNREAD
      };
      mockPrisma.notification.findUnique.mockResolvedValue(mockRecord);

      await expect(service.markAsRead('notif-1', 'user-2')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if notification does not exist', async () => {
      mockPrisma.notification.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications for a recipient as read', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 2 });

      await service.markAllAsRead('user-1');

      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
        where: {
          recipientId: 'user-1',
          status: NotificationStatus.UNREAD
        },
        data: {
          status: NotificationStatus.READ,
          readAt: expect.any(Date)
        }
      });
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count for user', async () => {
      mockPrisma.notification.count.mockResolvedValue(5);

      const count = await service.getUnreadCount('user-1');

      expect(count).toBe(5);
      expect(mockPrisma.notification.count).toHaveBeenCalledWith({
        where: {
          recipientId: 'user-1',
          status: NotificationStatus.UNREAD
        }
      });
    });
  });
});
