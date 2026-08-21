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

  @ApiProperty({ enum: ['persistent-cookie', 'development-header'] })
  strategy!: 'persistent-cookie' | 'development-header';
}

export class AuthErrorDto {
  @ApiProperty({ example: 'AUTHENTICATION_REQUIRED' })
  code!: string;

  @ApiProperty({ example: 'Authentication is required.' })
  message!: string;

  @ApiProperty({ type: 'object', additionalProperties: { type: 'array', items: { type: 'string' } }, example: {} })
  fieldErrors!: Record<string, string[]>;

  @ApiProperty({ example: 'request-trace-id' })
  traceId!: string;

  @ApiProperty({ example: 403 })
  status!: number;
}
