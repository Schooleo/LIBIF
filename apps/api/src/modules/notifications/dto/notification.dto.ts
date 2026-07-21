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

  @ApiProperty()
  isRead!: boolean;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}
