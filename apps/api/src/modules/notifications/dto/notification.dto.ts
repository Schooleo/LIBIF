import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class NotificationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  recipientId!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  body!: string;

  @ApiPropertyOptional({ type: Object, nullable: true })
  payload?: Record<string, unknown> | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  actionHref?: string | null;

  @ApiProperty()
  isRead!: boolean;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  readAt?: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}

export class UnreadNotificationCountDto {
  @ApiProperty({ minimum: 0 })
  count!: number;
}

export enum NotificationFilterEnum {
  ALL = 'all',
  UNREAD = 'unread',
  READ = 'read'
}

export class NotificationListQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  pageSize: number = 20;

  @ApiPropertyOptional({ enum: NotificationFilterEnum, default: NotificationFilterEnum.ALL })
  @IsOptional()
  @IsEnum(NotificationFilterEnum)
  filter: NotificationFilterEnum = NotificationFilterEnum.ALL;
}

export class PagedNotificationListResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  items!: NotificationResponseDto[];

  @ApiProperty()
  totalCount!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  @ApiProperty()
  totalPages!: number;
}
