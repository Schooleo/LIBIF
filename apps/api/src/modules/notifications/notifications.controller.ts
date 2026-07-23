import { Controller, Get, Inject, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthErrorDto, type SessionUserDto } from '../auth/dto/session.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { NotificationResponseDto, UnreadNotificationCountDto } from './dto/notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(RolesGuard)
@Roles('ADMIN', 'LIBRARIAN', 'READER')
export class NotificationsController {
  constructor(@Inject(NotificationsService) private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List notifications for the current user.' })
  @ApiOkResponse({ type: [NotificationResponseDto] })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async listMyNotifications(@CurrentUser() user: SessionUserDto): Promise<NotificationResponseDto[]> {
    return this.notificationsService.listNotifications(user.id);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count for current user.' })
  @ApiOkResponse({ type: UnreadNotificationCountDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async getUnreadCount(@CurrentUser() user: SessionUserDto): Promise<UnreadNotificationCountDto> {
    const count = await this.notificationsService.getUnreadCount(user.id);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read.' })
  @ApiOkResponse({ type: NotificationResponseDto })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: SessionUserDto
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications for the current user as read.' })
  @ApiOkResponse({ description: 'All notifications marked as read.' })
  @ApiForbiddenResponse({ type: AuthErrorDto })
  async markAllAsRead(@CurrentUser() user: SessionUserDto): Promise<void> {
    await this.notificationsService.markAllAsRead(user.id);
  }
}
