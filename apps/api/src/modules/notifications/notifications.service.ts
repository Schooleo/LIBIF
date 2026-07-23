import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationStatus, NotificationType } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  NotificationFilterEnum,
  NotificationListQueryDto,
  NotificationResponseDto,
  PagedNotificationListResponseDto
} from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async createNotification(dto: CreateNotificationDto): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.create({
      data: {
        recipientId: dto.recipientId,
        type: dto.type as NotificationType,
        title: dto.title,
        body: dto.body,
        payload: dto.payload ?? undefined,
        actionHref: dto.actionHref ?? undefined,
        status: NotificationStatus.UNREAD
      }
    });
    return this.mapToDto(notification);
  }

  async listNotifications(recipientId?: string): Promise<NotificationResponseDto[]> {
    const notifications = await this.prisma.notification.findMany({
      where: recipientId ? { recipientId } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    return notifications.map((n) => this.mapToDto(n));
  }

  async listNotificationsPage(
    recipientId: string,
    query: NotificationListQueryDto
  ): Promise<PagedNotificationListResponseDto> {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize || 20));
    const skip = (page - 1) * pageSize;

    const where: any = { recipientId };
    if (query.filter === NotificationFilterEnum.UNREAD) {
      where.status = NotificationStatus.UNREAD;
    } else if (query.filter === NotificationFilterEnum.READ) {
      where.status = NotificationStatus.READ;
    }

    const [notifications, totalCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      this.prisma.notification.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return {
      items: notifications.map((n) => this.mapToDto(n)),
      totalCount,
      page,
      pageSize,
      totalPages
    };
  }

  async markAsRead(id: string, recipientId?: string): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.findUnique({
      where: { id }
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    if (recipientId && notification.recipientId !== recipientId) {
      throw new ForbiddenException(`Notification ${id} does not belong to the requesting user`);
    }

    const updated = await this.prisma.notification.update({
      where: { id },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date()
      }
    });
    return this.mapToDto(updated);
  }

  async markAllAsRead(recipientId?: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: {
        ...(recipientId ? { recipientId } : {}),
        status: NotificationStatus.UNREAD
      },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date()
      }
    });
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        recipientId,
        status: NotificationStatus.UNREAD
      }
    });
  }

  private mapToDto(n: any): NotificationResponseDto {
    return {
      id: n.id,
      recipientId: n.recipientId,
      type: n.type,
      title: n.title,
      body: n.body,
      payload: (n.payload as Record<string, any>) ?? null,
      actionHref: n.actionHref ?? null,
      isRead: n.status === NotificationStatus.READ,
      readAt: n.readAt ? n.readAt.toISOString() : null,
      createdAt: n.createdAt.toISOString()
    };
  }
}
