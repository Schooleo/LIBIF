import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type UserAdministrationEvent, type UserSession } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
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
