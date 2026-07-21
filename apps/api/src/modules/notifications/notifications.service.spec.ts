import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { NotFoundException } from '@nestjs/common';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationsService]
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNotification', () => {
    it('should create and store a notification', async () => {
      const dto = {
        recipientId: 'user-1',
        type: 'DOCUMENT_AVAILABLE',
        title: 'New Document Available',
        body: 'The document "Clean Code" is now available for reading.',
        payload: { bookId: 'book-1' }
      };

      const result = await service.createNotification(dto);

      expect(result).toMatchObject({
        id: expect.stringContaining('notification-'),
        recipientId: 'user-1',
        type: 'DOCUMENT_AVAILABLE',
        title: 'New Document Available',
        body: 'The document "Clean Code" is now available for reading.',
        payload: { bookId: 'book-1' },
        isRead: false,
        createdAt: expect.any(String)
      });

      const list = await service.listNotifications('user-1');
      expect(list).toHaveLength(1);
      expect(list[0]).toEqual(result);
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const dto = {
        recipientId: 'user-1',
        type: 'DOCUMENT_AVAILABLE',
        title: 'New Document Available',
        body: 'The document is available.'
      };

      const created = await service.createNotification(dto);
      expect(created.isRead).toBe(false);

      const updated = await service.markAsRead(created.id);
      expect(updated.isRead).toBe(true);
    });

    it('should throw NotFoundException if notification does not exist', async () => {
      await expect(service.markAsRead('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications for a recipient as read', async () => {
      await service.createNotification({
        recipientId: 'user-1',
        type: 'TYPE',
        title: 'Title 1',
        body: 'Body 1'
      });
      await service.createNotification({
        recipientId: 'user-1',
        type: 'TYPE',
        title: 'Title 2',
        body: 'Body 2'
      });
      await service.createNotification({
        recipientId: 'user-2',
        type: 'TYPE',
        title: 'Title 3',
        body: 'Body 3'
      });

      await service.markAllAsRead('user-1');

      const user1Notifications = await service.listNotifications('user-1');
      const user2Notifications = await service.listNotifications('user-2');

      expect(user1Notifications.every((n) => n.isRead)).toBe(true);
      expect(user2Notifications[0].isRead).toBe(false);
    });
  });
});
