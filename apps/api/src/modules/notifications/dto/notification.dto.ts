import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  payload?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  actionHref?: string | null;

  @ApiProperty()
  isRead!: boolean;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  readAt?: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}
