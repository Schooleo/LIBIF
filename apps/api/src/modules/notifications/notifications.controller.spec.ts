import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationFilterEnum } from './dto/notification.dto';
import { RolesGuard } from '../auth/roles.guard';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  const mockService = {
    listNotificationsPage: jest.fn(),
    getUnreadCount: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn()
  };

  const user = { id: 'user-1', email: 'user@example.test', role: 'READER' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: mockService
        }
      ]
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<NotificationsController>(NotificationsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listMyNotifications', () => {
    it('should delegate to service.listNotificationsPage with user id and query params', async () => {
      const mockResult = { items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 1 };
      mockService.listNotificationsPage.mockResolvedValue(mockResult);

      const query = { page: 2, pageSize: 10, filter: NotificationFilterEnum.UNREAD };
      const res = await controller.listMyNotifications(query, user as any);

      expect(res).toBe(mockResult);
      expect(mockService.listNotificationsPage).toHaveBeenCalledWith('user-1', query);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count DTO', async () => {
      mockService.getUnreadCount.mockResolvedValue(3);

      const res = await controller.getUnreadCount(user as any);

      expect(res).toEqual({ count: 3 });
      expect(mockService.getUnreadCount).toHaveBeenCalledWith('user-1');
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read for recipient', async () => {
      const mockNotif = { id: 'n-1', isRead: true };
      mockService.markAsRead.mockResolvedValue(mockNotif);

      const res = await controller.markAsRead('n-1', user as any);

      expect(res).toBe(mockNotif);
      expect(mockService.markAsRead).toHaveBeenCalledWith('n-1', 'user-1');
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read for recipient', async () => {
      mockService.markAllAsRead.mockResolvedValue(undefined);

      await controller.markAllAsRead(user as any);

      expect(mockService.markAllAsRead).toHaveBeenCalledWith('user-1');
    });
  });
});
