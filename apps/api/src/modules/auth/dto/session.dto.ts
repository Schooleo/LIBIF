import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const ROLE_KEYS = ['ADMIN', 'LIBRARIAN', 'READER'] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const PERMISSION_KEYS = [
  'catalogue:read',
  'reader:library:read',
  'admin:books:read',
  'admin:books:write',
  'admin:taxonomy:manage',
  'admin:users:manage'
] as const;
export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export class SessionUserDto {
  @ApiProperty({ example: 'dev-librarian' })
  id!: string;

  @ApiProperty({ example: 'librarian@libif.local' })
  email!: string;

  @ApiProperty({ enum: ROLE_KEYS })
  role!: RoleKey;

  @ApiProperty({ enum: PERMISSION_KEYS, isArray: true })
  permissions!: PermissionKey[];
}

export class SessionDto {
  @ApiProperty({ example: true })
  authenticated!: boolean;

  @ApiPropertyOptional({ type: SessionUserDto })
  user?: SessionUserDto;

  @ApiProperty({ enum: PERMISSION_KEYS, isArray: true })
  permissions!: PermissionKey[];

  @ApiProperty({ enum: ['development-header', 'production-unconfigured'] })
  strategy!: 'development-header' | 'production-unconfigured';
}

export class AuthErrorDto {
  @ApiProperty({ example: 403 })
  statusCode!: number;

  @ApiProperty({ example: 'Forbidden' })
  error!: string;

  @ApiProperty({ example: 'Authentication is required.' })
  message!: string;
}
