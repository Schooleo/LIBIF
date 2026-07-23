import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { Prisma, User, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { AuthCookieService } from './auth-cookie.service';
import { AuthTokenService } from './auth-token.service';
import { AuthMessageDto, PasswordResetDto, PasswordResetRequestDto, RegisterRequestDto, SignInRequestDto } from './dto/auth-requests.dto';
import { PERMISSION_KEYS, ROLE_KEYS, type PermissionKey, type RoleKey, type SessionDto, type SessionUserDto } from './dto/session.dto';
import { PasswordHasher } from './password-hasher.service';
import { PasswordResetDeliveryService } from './password-reset-delivery.service';

const ROLE_PERMISSIONS: Record<RoleKey, PermissionKey[]> = {
  ADMIN: [...PERMISSION_KEYS],
  LIBRARIAN: ['catalogue:read', 'admin:books:read', 'admin:books:write', 'admin:taxonomy:manage'],
  READER: ['catalogue:read', 'reader:library:read']
};

const PASSWORD_RESET_MESSAGE = 'If an account exists for that email, a reset link has been sent.';
const PASSWORD_RESET_COMPLETE_MESSAGE = 'Password reset complete. Please sign in with the new password.';
const SIGN_OUT_MESSAGE = 'Signed out.';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(PasswordHasher) private readonly passwordHasher: PasswordHasher,
    @Inject(AuthTokenService) private readonly tokens: AuthTokenService,
    @Inject(AuthCookieService) private readonly cookies: AuthCookieService,
    @Inject(PasswordResetDeliveryService) private readonly resetDelivery: PasswordResetDeliveryService
  ) {}

  async register(dto: RegisterRequestDto, request: Request, response: Response): Promise<SessionDto> {
    const email = normalizeEmail(dto.email);
    const passwordHash = await this.passwordHasher.hash(dto.password);
    try {
      const user = await this.prisma.user.create({ data: { email, passwordHash, role: UserRole.READER } });
      return this.createSession(user, request, response);
    } catch (error) {
      if (isUniqueConstraint(error)) throw new ConflictException('Email is already registered.');
      throw error;
    }
  }

  async signIn(dto: SignInRequestDto, request: Request, response: Response): Promise<SessionDto> {
    const user = await this.prisma.user.findUnique({ where: { email: normalizeEmail(dto.email) } });
    if (!user || !(await this.passwordHasher.verify(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    await this.prisma.user.update({ where: { id: user.id }, data: { lastSignInAt: new Date() } });
    return this.createSession(user, request, response);
  }

  async signOut(request: Request, response: Response): Promise<AuthMessageDto> {
    const token = this.cookies.readSessionToken(request);
    if (token) {
      await this.prisma.userSession.updateMany({ where: { tokenHash: this.tokens.hashToken(token), revokedAt: null }, data: { revokedAt: new Date() } });
    }
    this.cookies.clearSessionCookie(response);
    return { message: SIGN_OUT_MESSAGE };
  }

  async requestPasswordReset(dto: PasswordResetRequestDto, request: Request): Promise<AuthMessageDto> {
    const email = normalizeEmail(dto.email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = this.tokens.createOpaqueToken(48);
      await this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: this.tokens.hashToken(token),
          expiresAt: this.fromNow(this.resetTokenTtlMs()),
          requesterIpHash: this.tokens.hashIp(request.ip)
        }
      });
      await this.resetDelivery.sendPasswordReset(email, token);
    }
    return { message: PASSWORD_RESET_MESSAGE };
  }

  async resetPassword(dto: PasswordResetDto): Promise<AuthMessageDto> {
    const tokenHash = this.tokens.hashToken(dto.token);
    const resetToken = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash }, include: { user: true } });
    if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
      throw new BadRequestException('Reset token is invalid or expired.');
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    await this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const consumed = await tx.passwordResetToken.updateMany({ where: { id: resetToken.id, usedAt: null, expiresAt: { gt: now } }, data: { usedAt: now } });
      if (consumed.count !== 1) throw new BadRequestException('Reset token is invalid or expired.');
      await tx.user.update({ where: { id: resetToken.userId }, data: { passwordHash } });
      await tx.userSession.updateMany({ where: { userId: resetToken.userId, revokedAt: null }, data: { revokedAt: now } });
    });
    return { message: PASSWORD_RESET_COMPLETE_MESSAGE };
  }

  async getSession(request: Request, response?: Response): Promise<SessionDto> {
    const cookieUser = await this.resolveCookieUser(request, response);
    if (cookieUser) return { authenticated: true, user: cookieUser, permissions: cookieUser.permissions, strategy: 'persistent-cookie' };

    const devUser = await this.resolveDevelopmentUser(request);
    if (devUser) return { authenticated: true, user: devUser, permissions: devUser.permissions, strategy: 'development-header' };

    return { authenticated: false, permissions: [], strategy: 'persistent-cookie' };
  }

  async resolveUser(request: Request): Promise<SessionUserDto | undefined> {
    return (await this.resolveCookieUser(request)) ?? (await this.resolveDevelopmentUser(request));
  }

  private async createSession(user: User, request: Request, response: Response): Promise<SessionDto> {
    const token = this.tokens.createOpaqueToken();
    const expiresAt = this.fromNow(this.sessionTtlMs());
    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        tokenHash: this.tokens.hashToken(token),
        expiresAt,
        lastSeenAt: new Date(),
        userAgent: this.readHeader(request, 'user-agent'),
        ipHash: this.tokens.hashIp(request.ip)
      }
    });
    this.cookies.setSessionCookie(response, token, expiresAt);
    const sessionUser = this.toSessionUser(user);
    return { authenticated: true, user: sessionUser, permissions: sessionUser.permissions, strategy: 'persistent-cookie' };
  }

  private async resolveCookieUser(request: Request, response?: Response): Promise<SessionUserDto | undefined> {
    const token = this.cookies.readSessionToken(request);
    if (!token) return undefined;
    const session = await this.prisma.userSession.findUnique({ where: { tokenHash: this.tokens.hashToken(token) }, include: { user: true } });
    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      if (response) this.cookies.clearSessionCookie(response);
      return undefined;
    }
    await this.prisma.userSession.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } });
    return this.toSessionUser(session.user);
  }

  private async resolveDevelopmentUser(request: Request): Promise<SessionUserDto | undefined> {
    if (this.isProduction()) return undefined;
    if (this.config.get('LIBIF_ENABLE_DEV_AUTH') !== 'true') return undefined;
    const roleHeader = this.readHeader(request, 'x-libif-dev-role');
    if (!roleHeader) return undefined;
    const role = roleHeader.toUpperCase() as RoleKey;
    if (!ROLE_KEYS.includes(role)) return undefined;
    const defaultEmail = `${role.toLowerCase()}@libif.local`;
    const email = normalizeEmail(this.readHeader(request, 'x-libif-dev-user-email') ?? defaultEmail);
    const explicitUserId = this.readHeader(request, 'x-libif-dev-user-id');
    const persistedUser = explicitUserId
      ? null
      : await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
    return {
      id: explicitUserId ?? persistedUser?.id ?? `dev-${role.toLowerCase()}`,
      email,
      role,
      permissions: ROLE_PERMISSIONS[role]
    };
  }

  private toSessionUser(user: User): SessionUserDto {
    const role = user.role as RoleKey;
    return { id: user.id, email: user.email, role, permissions: ROLE_PERMISSIONS[role] };
  }

  private sessionTtlMs(): number {
    return numberFromConfig(this.config, 'LIBIF_SESSION_TTL_SECONDS', 7 * 24 * 60 * 60) * 1000;
  }

  private resetTokenTtlMs(): number {
    return numberFromConfig(this.config, 'LIBIF_PASSWORD_RESET_TTL_SECONDS', 60 * 60) * 1000;
  }

  private fromNow(ms: number): Date {
    return new Date(Date.now() + ms);
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

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function numberFromConfig(config: ConfigService, name: string, fallback: number): number {
  const parsed = Number(config.get(name));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isUniqueConstraint(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}
