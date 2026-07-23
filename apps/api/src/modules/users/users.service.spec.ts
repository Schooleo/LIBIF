import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserAccountStatus, UserAdministrationAction, UserRole } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UserListQueryDto } from './dto/user-list-query.dto';
import { UsersService, buildUserWhere, summarizeSessions } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    $transaction: jest.Mock;
    user: { count: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock };
    userSession: { groupBy: jest.Mock; findMany: jest.Mock };
    userAdministrationEvent: { findMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      $transaction: jest.fn().mockResolvedValue([
        2,
        [
          {
            id: 'user-2',
            email: 'reader.two@example.edu',
            role: UserRole.READER,
            status: UserAccountStatus.ACTIVE,
            lastSignInAt: new Date('2026-07-22T10:00:00.000Z'),
            deactivatedAt: null,
            createdAt: new Date('2026-07-22T09:00:00.000Z'),
            updatedAt: new Date('2026-07-22T11:00:00.000Z')
          },
          {
            id: 'user-1',
            email: 'reader.one@example.edu',
            role: UserRole.READER,
            status: UserAccountStatus.DEACTIVATED,
            lastSignInAt: null,
            deactivatedAt: new Date('2026-07-20T12:00:00.000Z'),
            createdAt: new Date('2026-07-20T09:00:00.000Z'),
            updatedAt: new Date('2026-07-20T12:00:00.000Z')
          }
        ]
      ]),
      user: {
        count: jest.fn().mockResolvedValue(2),
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'user-2',
            email: 'reader.two@example.edu',
            role: UserRole.READER,
            status: UserAccountStatus.ACTIVE,
            lastSignInAt: new Date('2026-07-22T10:00:00.000Z'),
            deactivatedAt: null,
            createdAt: new Date('2026-07-22T09:00:00.000Z'),
            updatedAt: new Date('2026-07-22T11:00:00.000Z')
          },
          {
            id: 'user-1',
            email: 'reader.one@example.edu',
            role: UserRole.READER,
            status: UserAccountStatus.DEACTIVATED,
            lastSignInAt: null,
            deactivatedAt: new Date('2026-07-20T12:00:00.000Z'),
            createdAt: new Date('2026-07-20T09:00:00.000Z'),
            updatedAt: new Date('2026-07-20T12:00:00.000Z')
          }
        ]),
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-2',
          email: 'reader.two@example.edu',
          role: UserRole.READER,
          status: UserAccountStatus.ACTIVE,
          lastSignInAt: new Date('2026-07-22T10:00:00.000Z'),
          deactivatedAt: null,
          createdAt: new Date('2026-07-22T09:00:00.000Z'),
          updatedAt: new Date('2026-07-22T11:00:00.000Z')
        })
      },
      userSession: {
        groupBy: jest.fn().mockResolvedValue([{ userId: 'user-2', _count: { _all: 2 } }]),
        findMany: jest.fn().mockResolvedValue([
          {
            createdAt: new Date('2026-07-22T09:05:00.000Z'),
            lastSeenAt: new Date('2026-07-22T10:00:00.000Z'),
            expiresAt: new Date('2099-07-29T00:00:00.000Z'),
            revokedAt: null
          },
          {
            createdAt: new Date('2026-07-21T09:05:00.000Z'),
            lastSeenAt: new Date('2026-07-21T10:00:00.000Z'),
            expiresAt: new Date('2026-07-21T12:00:00.000Z'),
            revokedAt: null
          },
          {
            createdAt: new Date('2026-07-20T09:05:00.000Z'),
            lastSeenAt: null,
            expiresAt: new Date('2099-07-23T12:00:00.000Z'),
            revokedAt: new Date('2026-07-22T08:00:00.000Z')
          }
        ])
      },
      userAdministrationEvent: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'evt-2',
            action: UserAdministrationAction.REACTIVATED,
            previousRole: null,
            nextRole: null,
            reason: 'Restored',
            createdAt: new Date('2026-07-22T12:00:00.000Z'),
            actorUser: { email: 'admin@example.edu' }
          },
          {
            id: 'evt-1',
            action: UserAdministrationAction.DEACTIVATED,
            previousRole: null,
            nextRole: null,
            reason: 'Graduated',
            createdAt: new Date('2026-07-20T12:00:00.000Z'),
            actorUser: null
          }
        ])
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }]
    }).compile();

    service = module.get(UsersService);
  });

  it('builds deterministic list results and active-session aggregates without N+1 queries', async () => {
    const result = await service.listUsers({ q: 'reader', page: 2, pageSize: 20 } satisfies UserListQueryDto);

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.userSession.groupBy).toHaveBeenCalledWith(
      expect.objectContaining({
        by: ['userId'],
        where: expect.objectContaining({
          userId: { in: ['user-2', 'user-1'] },
          revokedAt: null,
          expiresAt: expect.any(Object)
        })
      })
    );
    expect(result).toMatchObject({
      totalCount: 2,
      page: 2,
      pageSize: 20,
      items: [
        { id: 'user-2', activeSessionCount: 2, email: 'reader.two@example.edu' },
        { id: 'user-1', activeSessionCount: 0, status: UserAccountStatus.DEACTIVATED }
      ]
    });
  });

  it('uses the documented first-page defaults and deterministic ordering', async () => {
    const result = await service.listUsers({});

    expect(prisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: 0,
        take: 20
      })
    );
    expect(result).toMatchObject({ page: 1, pageSize: 20 });
  });

  it('returns safe detail session and administration summaries', async () => {
    const result = await service.getUserDetail('user-2');

    expect(result).toMatchObject({
      id: 'user-2',
      email: 'reader.two@example.edu',
      activeSessionCount: 1,
      sessionSummary: {
        activeCount: 1,
        revokedCount: 1,
        expiredCount: 1,
        mostRecentCreatedAt: '2026-07-22T09:05:00.000Z',
        mostRecentLastSeenAt: '2026-07-22T10:00:00.000Z',
        mostRecentRevokedAt: '2026-07-22T08:00:00.000Z'
      },
      administrationEvents: [
        {
          id: 'evt-2',
          actorEmail: 'admin@example.edu',
          action: UserAdministrationAction.REACTIVATED,
          previousRole: null,
          nextRole: null
        },
        {
          id: 'evt-1',
          actorEmail: null,
          action: UserAdministrationAction.DEACTIVATED,
          previousRole: null,
          nextRole: null
        }
      ]
    });
    expect(prisma.userSession.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-2' } })
    );
    expect(prisma.userAdministrationEvent.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: 20
      })
    );
  });

  it('throws not found when a user detail record is missing', async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);
    await expect(service.getUserDetail('missing')).rejects.toThrow(NotFoundException);
  });
});

describe('buildUserWhere', () => {
  it('maps trimmed search and enum filters to a Prisma where clause', () => {
    expect(
      buildUserWhere({
        q: 'reader@example.edu',
        role: UserRole.READER,
        status: UserAccountStatus.ACTIVE
      })
    ).toEqual({
      email: { contains: 'reader@example.edu', mode: 'insensitive' },
      role: UserRole.READER,
      status: UserAccountStatus.ACTIVE
    });
  });
});

describe('summarizeSessions', () => {
  it('derives active, expired, revoked, and latest timestamps from safe session fields only', () => {
    expect(
      summarizeSessions(
        [
          {
            createdAt: new Date('2026-07-22T09:00:00.000Z'),
            lastSeenAt: new Date('2026-07-22T10:00:00.000Z'),
            expiresAt: new Date('2099-07-22T11:00:00.000Z'),
            revokedAt: null
          },
          {
            createdAt: new Date('2026-07-20T09:00:00.000Z'),
            lastSeenAt: null,
            expiresAt: new Date('2026-07-20T11:00:00.000Z'),
            revokedAt: new Date('2026-07-20T12:00:00.000Z')
          }
        ],
        new Date('2026-07-23T00:00:00.000Z')
      )
    ).toEqual({
      activeCount: 1,
      revokedCount: 1,
      expiredCount: 0,
      mostRecentCreatedAt: '2026-07-22T09:00:00.000Z',
      mostRecentLastSeenAt: '2026-07-22T10:00:00.000Z',
      mostRecentExpiresAt: '2099-07-22T11:00:00.000Z',
      mostRecentRevokedAt: '2026-07-20T12:00:00.000Z'
    });
  });
});
