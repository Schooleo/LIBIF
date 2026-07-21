import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationResponseDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  private notifications: NotificationResponseDto[] = [];
  private idCounter = 1;

  async createNotification(dto: CreateNotificationDto): Promise<NotificationResponseDto> {
    const notification: NotificationResponseDto = {
      id: `notification-${this.idCounter++}`,
      recipientId: dto.recipientId,
      type: dto.type,
      title: dto.title,
      body: dto.body,
      payload: dto.payload ?? null,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.notifications.push(notification);
    return notification;
  }

  async listNotifications(recipientId?: string): Promise<NotificationResponseDto[]> {
    if (recipientId) {
      return this.notifications.filter((n) => n.recipientId === recipientId);
    }
    return this.notifications;
  }

  async markAsRead(id: string): Promise<NotificationResponseDto> {
    const notification = this.notifications.find((n) => n.id === id);
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    notification.isRead = true;
    return notification;
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    this.notifications
      .filter((n) => n.recipientId === recipientId)
      .forEach((n) => {
        n.isRead = true;
      });
  }
}
