import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserAccountStatus, UserAdministrationAction, UserRole } from '../../../generated/prisma/client';

export const USERS_RESPONSE_FORBIDDEN_KEYS = [
  'passwordHash',
  'tokenHash',
  'ipHash',
  'userAgent',
  'requesterIpHash',
  'passwordResetToken',
  'passwordResetTokens',
  'resetTokenHash',
  'readerAccessEvents',
  'traceFingerprint'
] as const;

export class UserListItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty({ enum: UserAccountStatus })
  status!: UserAccountStatus;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'date-time' })
  lastSignInAt!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'date-time' })
  deactivatedAt!: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt!: string;

  @ApiProperty({ minimum: 0 })
  activeSessionCount!: number;
}

export class UserListResponseDto {
  @ApiProperty({ type: [UserListItemDto] })
  items!: UserListItemDto[];

  @ApiProperty({ minimum: 0 })
  totalCount!: number;

  @ApiProperty({ minimum: 1 })
  page!: number;

  @ApiProperty({ minimum: 1, maximum: 100 })
  pageSize!: number;
}

export class UserSessionSummaryDto {
  @ApiProperty({ minimum: 0 })
  activeCount!: number;

  @ApiProperty({ minimum: 0 })
  revokedCount!: number;

  @ApiProperty({ minimum: 0 })
  expiredCount!: number;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'date-time' })
  mostRecentCreatedAt!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'date-time' })
  mostRecentLastSeenAt!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'date-time' })
  mostRecentExpiresAt!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'date-time' })
  mostRecentRevokedAt!: string | null;
}

export class UserAdministrationEventDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: UserAdministrationAction })
  action!: UserAdministrationAction;

  @ApiPropertyOptional({ enum: UserRole, nullable: true })
  previousRole!: UserRole | null;

  @ApiPropertyOptional({ enum: UserRole, nullable: true })
  nextRole!: UserRole | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  reason!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  actorEmail!: string | null;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}

export class UserDetailResponseDto extends UserListItemDto {
  @ApiProperty({ type: () => UserSessionSummaryDto })
  sessionSummary!: UserSessionSummaryDto;

  @ApiProperty({ type: [UserAdministrationEventDto] })
  administrationEvents!: UserAdministrationEventDto[];
}
