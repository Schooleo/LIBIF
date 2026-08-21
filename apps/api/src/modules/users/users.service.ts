import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  Prisma,
  UserAccountStatus,
  UserAdministrationAction,
  UserRole,
  type UserAdministrationEvent,
  type UserSession
} from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { ChangeUserRoleDto, ChangeUserStatusDto } from './dto/user-administration-command.dto';
import { UserListQueryDto } from './dto/user-list-query.dto';
import {
  UserAdministrationEventDto,
  UserDetailResponseDto,
  UserListItemDto,
  UserListResponseDto,
  UserSessionSummaryDto
} from './dto/user-response.dto';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const ADMIN_EVENTS_LIMIT = 20;
const SERIALIZABLE_RETRY_LIMIT = 3;

const userListSelect = {
  id: true,
  email: true,
  role: true,
  status: true,
  lastSignInAt: true,
  deactivatedAt: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.UserSelect;

type UserListRecord = Prisma.UserGetPayload<{ select: typeof userListSelect }>;
type UserAdminEventRecord = Pick<UserAdministrationEvent, 'id' | 'action' | 'previousRole' | 'nextRole' | 'reason' | 'createdAt'> & {
  actorUser: { email: string } | null;
};
type UserSessionAggregateRecord = Pick<UserSession, 'createdAt' | 'lastSeenAt' | 'expiresAt' | 'revokedAt'>;

@Injectable()
export class UsersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async listUsers(query: UserListQueryDto): Promise<UserListResponseDto> {
    const page = query.page ?? DEFAULT_PAGE;
    const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
    const where = buildUserWhere(query);
    const skip = (page - 1) * pageSize;
    const now = new Date();

    const [totalCount, items] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip,
        take: pageSize,
        select: userListSelect
      })
    ]);

    const activeSessionCounts = await this.loadActiveSessionCounts(
      items.map((item) => item.id),
      now
    );

    return {
      items: items.map((item) => toUserListItem(item, activeSessionCounts.get(item.id) ?? 0)),
      totalCount,
      page,
      pageSize
    };
  }

  async getUserDetail(userId: string): Promise<UserDetailResponseDto> {
    const now = new Date();
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: userListSelect });
    if (!user) throw new NotFoundException(`User ${userId} not found.`);

    const [sessions, administrationEvents] = await Promise.all([
      this.prisma.userSession.findMany({
        where: { userId },
        select: { createdAt: true, lastSeenAt: true, expiresAt: true, revokedAt: true }
      }),
      this.prisma.userAdministrationEvent.findMany({
        where: { targetUserId: userId },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: ADMIN_EVENTS_LIMIT,
        select: {
          id: true,
          action: true,
          previousRole: true,
          nextRole: true,
          reason: true,
          createdAt: true,
          actorUser: { select: { email: true } }
        }
      })
    ]);
    const sessionSummary = summarizeSessions(sessions, now);

    return {
      ...toUserListItem(user, sessionSummary.activeCount),
      sessionSummary,
      administrationEvents: administrationEvents.map(toAdministrationEventDto)
    };
  }

  async changeUserRole(
    userId: string,
    actorUserId: string,
    input: ChangeUserRoleDto
  ): Promise<UserDetailResponseDto> {
    this.assertNotSelf(userId, actorUserId);

    await this.runSerializableMutation(async (tx) => {
      await lockActiveAdministrators(tx);
      const target = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, status: true }
      });
      if (!target) throw new NotFoundException(`User ${userId} not found.`);
      if (target.role === input.role) throw new ConflictException('User already has the requested role.');

      if (
        target.role === UserRole.ADMIN &&
        input.role !== UserRole.ADMIN &&
        target.status === UserAccountStatus.ACTIVE
      ) {
        await assertAnotherActiveAdministrator(tx, userId);
      }

      const now = new Date();
      await tx.user.update({ where: { id: userId }, data: { role: input.role } });
      await revokeActiveSessions(tx, userId, now);
      await tx.userAdministrationEvent.create({
        data: {
          targetUserId: userId,
          actorUserId,
          action: UserAdministrationAction.ROLE_CHANGED,
          previousRole: target.role,
          nextRole: input.role,
          reason: input.reason
        }
      });
    });

    return this.getUserDetail(userId);
  }

  async deactivateUser(
    userId: string,
    actorUserId: string,
    input: ChangeUserStatusDto
  ): Promise<UserDetailResponseDto> {
    this.assertNotSelf(userId, actorUserId);

    await this.runSerializableMutation(async (tx) => {
      await lockActiveAdministrators(tx);
      const target = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, status: true }
      });
      if (!target) throw new NotFoundException(`User ${userId} not found.`);
      if (target.status === UserAccountStatus.DEACTIVATED) {
        throw new ConflictException('User is already deactivated.');
      }
      if (target.role === UserRole.ADMIN) await assertAnotherActiveAdministrator(tx, userId);

      const now = new Date();
      await tx.user.update({
        where: { id: userId },
        data: { status: UserAccountStatus.DEACTIVATED, deactivatedAt: now }
      });
      await revokeActiveSessions(tx, userId, now);
      await tx.userAdministrationEvent.create({
        data: {
          targetUserId: userId,
          actorUserId,
          action: UserAdministrationAction.DEACTIVATED,
          reason: input.reason
        }
      });
    });

    return this.getUserDetail(userId);
  }

  async reactivateUser(
    userId: string,
    actorUserId: string,
    input: ChangeUserStatusDto
  ): Promise<UserDetailResponseDto> {
    this.assertNotSelf(userId, actorUserId);

    await this.runSerializableMutation(async (tx) => {
      const target = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, status: true }
      });
      if (!target) throw new NotFoundException(`User ${userId} not found.`);
      if (target.status === UserAccountStatus.ACTIVE) {
        throw new ConflictException('User is already active.');
      }

      await tx.user.update({
        where: { id: userId },
        data: { status: UserAccountStatus.ACTIVE, deactivatedAt: null }
      });
      await tx.userAdministrationEvent.create({
        data: {
          targetUserId: userId,
          actorUserId,
          action: UserAdministrationAction.REACTIVATED,
          reason: input.reason
        }
      });
    });

    return this.getUserDetail(userId);
  }

  private async loadActiveSessionCounts(userIds: string[], now: Date): Promise<Map<string, number>> {
    if (userIds.length === 0) return new Map();

    const groups = await this.prisma.userSession.groupBy({
      by: ['userId'],
      where: {
        userId: { in: userIds },
        revokedAt: null,
        expiresAt: { gt: now }
      },
      _count: { _all: true }
    });

    return new Map(groups.map((group) => [group.userId, group._count._all]));
  }

  private assertNotSelf(userId: string, actorUserId: string): void {
    if (userId === actorUserId) {
      throw new ConflictException('Administrators cannot change their own role or account status.');
    }
  }

  private async runSerializableMutation(operation: (tx: Prisma.TransactionClient) => Promise<void>): Promise<void> {
    for (let attempt = 1; attempt <= SERIALIZABLE_RETRY_LIMIT; attempt += 1) {
      try {
        await this.prisma.$transaction(operation, {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable
        });
        return;
      } catch (error) {
        if (!isTransactionWriteConflict(error) || attempt === SERIALIZABLE_RETRY_LIMIT) throw error;
      }
    }
  }
}

async function lockActiveAdministrators(tx: Prisma.TransactionClient): Promise<void> {
  await tx.$queryRaw(
    Prisma.sql`SELECT "id" FROM "User" WHERE "role" = 'ADMIN' AND "status" = 'ACTIVE' ORDER BY "id" FOR UPDATE`
  );
}

async function assertAnotherActiveAdministrator(
  tx: Prisma.TransactionClient,
  excludedUserId: string
): Promise<void> {
  const remaining = await tx.user.count({
    where: {
      id: { not: excludedUserId },
      role: UserRole.ADMIN,
      status: UserAccountStatus.ACTIVE
    }
  });
  if (remaining === 0) throw new ConflictException('The last active administrator cannot be changed.');
}

async function revokeActiveSessions(
  tx: Prisma.TransactionClient,
  userId: string,
  revokedAt: Date
): Promise<void> {
  await tx.userSession.updateMany({
    where: { userId, revokedAt: null, expiresAt: { gt: revokedAt } },
    data: { revokedAt }
  });
}

function isTransactionWriteConflict(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const candidate = error as { code?: unknown; meta?: { code?: unknown }; message?: unknown };
  return (
    candidate.code === 'P2034' ||
    candidate.meta?.code === '40001' ||
    (typeof candidate.message === 'string' &&
      candidate.message.includes('could not serialize access due to concurrent update'))
  );
}

export function buildUserWhere(query: UserListQueryDto): Prisma.UserWhereInput {
  return {
    ...(query.q ? { email: { contains: query.q, mode: 'insensitive' } } : {}),
    ...(query.role ? { role: query.role } : {}),
    ...(query.status ? { status: query.status } : {})
  };
}

export function toUserListItem(user: UserListRecord, activeSessionCount: number): UserListItemDto {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    lastSignInAt: toIsoString(user.lastSignInAt),
    deactivatedAt: toIsoString(user.deactivatedAt),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    activeSessionCount
  };
}

export function summarizeSessions(sessions: UserSessionAggregateRecord[], now: Date): UserSessionSummaryDto {
  let revokedCount = 0;
  let expiredCount = 0;
  let activeCount = 0;

  for (const session of sessions) {
    if (session.revokedAt) revokedCount += 1;
    else if (session.expiresAt <= now) expiredCount += 1;
    else activeCount += 1;
  }

  return {
    activeCount,
    revokedCount,
    expiredCount,
    mostRecentCreatedAt: latestDate(sessions.map((session) => session.createdAt)),
    mostRecentLastSeenAt: latestDate(sessions.map((session) => session.lastSeenAt)),
    mostRecentExpiresAt: latestDate(sessions.map((session) => session.expiresAt)),
    mostRecentRevokedAt: latestDate(sessions.map((session) => session.revokedAt))
  };
}

export function toAdministrationEventDto(event: UserAdminEventRecord): UserAdministrationEventDto {
  return {
    id: event.id,
    action: event.action,
    previousRole: event.previousRole,
    nextRole: event.nextRole,
    reason: event.reason,
    actorEmail: event.actorUser?.email ?? null,
    createdAt: event.createdAt.toISOString()
  };
}

function latestDate(values: Array<Date | null | undefined>): string | null {
  let latest: Date | null = null;
  for (const value of values) {
    if (!value) continue;
    if (!latest || value > latest) latest = value;
  }
  return latest?.toISOString() ?? null;
}

function toIsoString(value: Date | null): string | null {
  return value?.toISOString() ?? null;
}
