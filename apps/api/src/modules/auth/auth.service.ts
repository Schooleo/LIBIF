import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { PERMISSION_KEYS, ROLE_KEYS, type PermissionKey, type RoleKey, type SessionDto, type SessionUserDto } from './dto/session.dto';

const ROLE_PERMISSIONS: Record<RoleKey, PermissionKey[]> = {
  ADMIN: [...PERMISSION_KEYS],
  LIBRARIAN: ['catalogue:read', 'admin:books:read', 'admin:books:write', 'admin:taxonomy:manage'],
  READER: ['catalogue:read', 'reader:library:read']
};

@Injectable()
export class AuthService {
  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  getSession(request: Request): SessionDto {
    const user = this.resolveUser(request);
    const strategy = this.isProduction() ? 'production-unconfigured' : 'development-header';
    return user ? { authenticated: true, user, permissions: user.permissions, strategy } : { authenticated: false, permissions: [], strategy };
  }

  resolveUser(request: Request): SessionUserDto | undefined {
    if (this.isProduction()) return undefined;
    const roleHeader = this.readHeader(request, 'x-libif-dev-role');
    if (!roleHeader) return undefined;
    const role = roleHeader.toUpperCase() as RoleKey;
    if (!ROLE_KEYS.includes(role)) return undefined;
    const defaultEmail = `${role.toLowerCase()}@libif.local`;
    return {
      id: this.readHeader(request, 'x-libif-dev-user-id') ?? `dev-${role.toLowerCase()}`,
      email: this.readHeader(request, 'x-libif-dev-user-email') ?? defaultEmail,
      role,
      permissions: ROLE_PERMISSIONS[role]
    };
  }

  private isProduction(): boolean {
    return this.config.get('NODE_ENV') === 'production';
  }

  private readHeader(request: Request, name: string): string | undefined {
    const value = request.headers[name];
    if (Array.isArray(value)) return value[0];
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
  }
}
