import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpErrorFilter } from '../src/common/http-error.filter';
import { UserAccountStatus, UserAdministrationAction, UserRole } from '../src/generated/prisma/client';
import { PrismaService } from '../src/modules/database/prisma.service';
import { ProcessingQueue } from '../src/modules/processing/processing.queue';
import { USERS_RESPONSE_FORBIDDEN_KEYS } from '../src/modules/users/dto/user-response.dto';

class FakeProcessingQueue {
  async enqueueBookUploaded(_event: unknown): Promise<void> {}
}

describe('Admin users (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const adminHeaders = { 'x-libif-dev-role': 'ADMIN', 'x-libif-dev-user-email': 'admin@libif.local' };
  const librarianHeaders = { 'x-libif-dev-role': 'LIBRARIAN', 'x-libif-dev-user-email': 'librarian@libif.local' };
  const readerHeaders = { 'x-libif-dev-role': 'READER', 'x-libif-dev-user-email': 'reader@libif.local' };
  const originalDevAuth = process.env.LIBIF_ENABLE_DEV_AUTH;

  beforeAll(async () => {
    process.env.LIBIF_ENABLE_DEV_AUTH = 'true';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).overrideProvider(ProcessingQueue).useClass(FakeProcessingQueue).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpErrorFilter());
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    jest.restoreAllMocks();
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE;');
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
    process.env.LIBIF_ENABLE_DEV_AUTH = originalDevAuth;
  });

  it('returns a paginated filtered user list without leaking secrets', async () => {
    const [admin, librarian, inactiveReader] = await Promise.all([
      prisma.user.create({ data: { email: 'admin@example.edu', passwordHash: 'secret-1', role: UserRole.ADMIN, createdAt: new Date('2026-07-23T10:00:00.000Z') } }),
      prisma.user.create({ data: { email: 'librarian@example.edu', passwordHash: 'secret-2', role: UserRole.LIBRARIAN, createdAt: new Date('2026-07-23T09:00:00.000Z') } }),
      prisma.user.create({
        data: {
          email: 'reader@example.edu',
          passwordHash: 'secret-3',
          role: UserRole.READER,
          status: UserAccountStatus.DEACTIVATED,
          deactivatedAt: new Date('2026-07-23T08:30:00.000Z'),
          createdAt: new Date('2026-07-23T08:00:00.000Z')
        }
      })
    ]);
    await prisma.userSession.createMany({
      data: [
        {
          userId: admin.id,
          tokenHash: 'token-admin-active',
          expiresAt: new Date('2099-07-23T23:59:59.000Z')
        },
        {
          userId: admin.id,
          tokenHash: 'token-admin-revoked',
          expiresAt: new Date('2099-07-23T23:59:59.000Z'),
          revokedAt: new Date('2026-07-23T10:30:00.000Z')
        },
        {
          userId: librarian.id,
          tokenHash: 'token-librarian-expired',
          expiresAt: new Date('2026-07-22T23:59:59.000Z')
        },
        {
          userId: inactiveReader.id,
          tokenHash: 'token-reader-active',
          expiresAt: new Date('2099-07-23T23:59:59.000Z')
        }
      ]
    });

    const response = await request(app.getHttpServer())
      .get('/api/admin/users')
      .query({ page: 1, pageSize: 2, q: 'example.edu' })
      .set(adminHeaders)
      .expect(200);

    expect(response.body).toMatchObject({
      totalCount: 3,
      page: 1,
      pageSize: 2,
      items: [
        { id: admin.id, email: 'admin@example.edu', role: 'ADMIN', status: 'ACTIVE', activeSessionCount: 1 },
        { id: librarian.id, email: 'librarian@example.edu', role: 'LIBRARIAN', status: 'ACTIVE', activeSessionCount: 0 }
      ]
    });
    expect(response.body.items).toHaveLength(2);
    assertNoForbiddenKeys(response.body);

    const filtered = await request(app.getHttpServer())
      .get('/api/admin/users')
      .query({ role: 'READER', status: 'DEACTIVATED' })
      .set(adminHeaders)
      .expect(200);

    expect(filtered.body).toMatchObject({
      totalCount: 1,
      items: [{ id: inactiveReader.id, email: 'reader@example.edu', status: 'DEACTIVATED', activeSessionCount: 1 }]
    });
  });

  it('returns one user detail with safe session aggregates and mocked immutable audit history', async () => {
    const target = await prisma.user.create({
      data: {
        email: 'reader@example.edu',
        passwordHash: 'secret-1',
        role: UserRole.READER,
        lastSignInAt: new Date('2026-07-23T10:15:00.000Z')
      }
    });
    await prisma.userSession.createMany({
      data: [
        {
          userId: target.id,
          tokenHash: 'detail-active',
          expiresAt: new Date('2099-07-23T23:59:59.000Z'),
          lastSeenAt: new Date('2026-07-23T10:30:00.000Z'),
          userAgent: 'secret-agent',
          ipHash: 'secret-ip'
        },
        {
          userId: target.id,
          tokenHash: 'detail-expired',
          expiresAt: new Date('2026-07-22T23:59:59.000Z')
        },
        {
          userId: target.id,
          tokenHash: 'detail-revoked',
          expiresAt: new Date('2099-07-23T23:59:59.000Z'),
          revokedAt: new Date('2026-07-23T09:00:00.000Z')
        }
      ]
    });
    jest.spyOn(prisma.userAdministrationEvent, 'findMany').mockResolvedValue([
      {
        id: 'users-admin-event-2',
        action: UserAdministrationAction.REACTIVATED,
        previousRole: null,
        nextRole: null,
        reason: 'Appeal accepted',
        createdAt: new Date('2026-07-23T10:00:00.000Z'),
        actorUser: { email: 'actor.admin@example.edu' }
      },
      {
        id: 'users-admin-event-1',
        action: UserAdministrationAction.DEACTIVATED,
        previousRole: null,
        nextRole: null,
        reason: 'Suspicious activity',
        createdAt: new Date('2026-07-22T10:00:00.000Z'),
        actorUser: { email: 'actor.admin@example.edu' }
      }
    ] as never);

    const response = await request(app.getHttpServer()).get(`/api/admin/users/${target.id}`).set(adminHeaders).expect(200);
    expect(response.body).toMatchObject({
      id: target.id,
      email: 'reader@example.edu',
      role: 'READER',
      status: 'ACTIVE',
      activeSessionCount: 1,
      sessionSummary: {
        activeCount: 1,
        revokedCount: 1,
        expiredCount: 1,
        mostRecentLastSeenAt: '2026-07-23T10:30:00.000Z'
      },
      administrationEvents: [
        {
          id: 'users-admin-event-2',
          action: UserAdministrationAction.REACTIVATED,
          actorEmail: 'actor.admin@example.edu',
          reason: 'Appeal accepted'
        },
        {
          id: 'users-admin-event-1',
          action: UserAdministrationAction.DEACTIVATED,
          actorEmail: 'actor.admin@example.edu',
          reason: 'Suspicious activity'
        }
      ]
    });
    assertNoForbiddenKeys(response.body);
  });

  it('rejects invalid pagination', async () => {
    const invalid = await request(app.getHttpServer()).get('/api/admin/users').query({ pageSize: 101 }).set(adminHeaders).expect(400);
    expect(invalid.body.code).toBe('VALIDATION_FAILED');
  });

  it('forbids non-admin and anonymous callers on both read routes', async () => {
    for (const path of ['/api/admin/users', '/api/admin/users/any-user']) {
      for (const headers of [librarianHeaders, readerHeaders]) {
        const response = await request(app.getHttpServer()).get(path).set(headers).expect(403);
        expect(response.body.code).toBe('PERMISSION_DENIED');
      }

      const anonymous = await request(app.getHttpServer()).get(path).expect(403);
      expect(anonymous.body.code).toBe('AUTHENTICATION_REQUIRED');
    }
  });

  it('returns not found for missing user ids', async () => {
    const response = await request(app.getHttpServer()).get('/api/admin/users/missing-user').set(adminHeaders).expect(404);
    expect(response.body).toMatchObject({ code: 'NOT_FOUND', message: 'User missing-user not found.', status: 404 });
  });

  it('changes roles and account status transactionally with session revocation and immutable events', async () => {
    const actor = await prisma.user.create({
      data: { email: 'admin@libif.local', passwordHash: 'actor-secret', role: UserRole.ADMIN }
    });
    const target = await prisma.user.create({
      data: { email: 'member@example.edu', passwordHash: 'target-secret', role: UserRole.LIBRARIAN }
    });
    await prisma.userSession.create({
      data: {
        userId: target.id,
        tokenHash: 'wave5-target-session',
        expiresAt: new Date('2099-07-23T23:59:59.000Z')
      }
    });

    await request(app.getHttpServer())
      .patch(`/api/admin/users/${target.id}/role`)
      .set(adminHeaders)
      .send({ role: 'READER', reason: 'Duties changed' })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: target.id,
          role: 'READER',
          status: 'ACTIVE',
          activeSessionCount: 0,
          administrationEvents: [
            {
              action: 'ROLE_CHANGED',
              previousRole: 'LIBRARIAN',
              nextRole: 'READER',
              reason: 'Duties changed',
              actorEmail: actor.email
            }
          ]
        });
      });

    const revokedSession = await prisma.userSession.findUniqueOrThrow({
      where: { tokenHash: 'wave5-target-session' }
    });
    expect(revokedSession.revokedAt).toBeInstanceOf(Date);

    await request(app.getHttpServer())
      .post(`/api/admin/users/${target.id}/deactivate`)
      .set(adminHeaders)
      .send({ reason: 'Account review' })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          status: 'DEACTIVATED',
          administrationEvents: [
            { action: 'DEACTIVATED', reason: 'Account review', actorEmail: actor.email },
            { action: 'ROLE_CHANGED', reason: 'Duties changed', actorEmail: actor.email }
          ]
        });
        expect(body.deactivatedAt).toEqual(expect.any(String));
      });

    await request(app.getHttpServer())
      .post(`/api/admin/users/${target.id}/reactivate`)
      .set(adminHeaders)
      .send({ reason: 'Review completed' })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          status: 'ACTIVE',
          deactivatedAt: null,
          administrationEvents: [
            { action: 'REACTIVATED', reason: 'Review completed', actorEmail: actor.email },
            { action: 'DEACTIVATED', reason: 'Account review', actorEmail: actor.email },
            { action: 'ROLE_CHANGED', reason: 'Duties changed', actorEmail: actor.email }
          ]
        });
      });

    const events = await prisma.userAdministrationEvent.findMany({
      where: { targetUserId: target.id },
      orderBy: { createdAt: 'asc' }
    });
    expect(events.map((event) => event.action)).toEqual([
      UserAdministrationAction.ROLE_CHANGED,
      UserAdministrationAction.DEACTIVATED,
      UserAdministrationAction.REACTIVATED
    ]);
  });

  it('protects self-management and requires a nonblank reason', async () => {
    const admin = await prisma.user.create({
      data: { email: 'admin@libif.local', passwordHash: 'actor-secret', role: UserRole.ADMIN }
    });

    await request(app.getHttpServer())
      .patch(`/api/admin/users/${admin.id}/role`)
      .set(adminHeaders)
      .send({ role: 'LIBRARIAN', reason: 'Self demotion' })
      .expect(409);

    await request(app.getHttpServer())
      .post(`/api/admin/users/${admin.id}/deactivate`)
      .set(adminHeaders)
      .send({ reason: 'Self deactivation' })
      .expect(409);

    const target = await prisma.user.create({
      data: { email: 'reader@example.edu', passwordHash: 'target-secret', role: UserRole.READER }
    });
    await request(app.getHttpServer())
      .post(`/api/admin/users/${target.id}/deactivate`)
      .set(adminHeaders)
      .send({ reason: '   ' })
      .expect(400);
  });

  it('serializes concurrent demotions so one active administrator always remains', async () => {
    const actor = await prisma.user.create({
      data: { email: 'operator@example.edu', passwordHash: 'operator-secret', role: UserRole.LIBRARIAN }
    });
    const [first, second] = await Promise.all([
      prisma.user.create({
        data: { email: 'admin.one@example.edu', passwordHash: 'secret-one', role: UserRole.ADMIN }
      }),
      prisma.user.create({
        data: { email: 'admin.two@example.edu', passwordHash: 'secret-two', role: UserRole.ADMIN }
      })
    ]);
    const actorHeaders = {
      'x-libif-dev-role': 'ADMIN',
      'x-libif-dev-user-id': actor.id,
      'x-libif-dev-user-email': actor.email
    };

    const responses = await Promise.all([
      request(app.getHttpServer())
        .patch(`/api/admin/users/${first.id}/role`)
        .set(actorHeaders)
        .send({ role: 'LIBRARIAN', reason: 'Concurrent role review' }),
      request(app.getHttpServer())
        .patch(`/api/admin/users/${second.id}/role`)
        .set(actorHeaders)
        .send({ role: 'LIBRARIAN', reason: 'Concurrent role review' })
    ]);

    expect(responses.map((response) => response.status).sort()).toEqual([200, 409]);
    const activeAdminCount = await prisma.user.count({
      where: { role: UserRole.ADMIN, status: UserAccountStatus.ACTIVE }
    });
    expect(activeAdminCount).toBe(1);
  });

  it('keeps all user mutation routes admin-only', async () => {
    const target = await prisma.user.create({
      data: { email: 'reader@example.edu', passwordHash: 'target-secret', role: UserRole.READER }
    });
    const mutations = [
      { method: 'patch', path: `/api/admin/users/${target.id}/role`, body: { role: 'LIBRARIAN', reason: 'No access' } },
      { method: 'post', path: `/api/admin/users/${target.id}/deactivate`, body: { reason: 'No access' } },
      { method: 'post', path: `/api/admin/users/${target.id}/reactivate`, body: { reason: 'No access' } }
    ] as const;

    for (const mutation of mutations) {
      await request(app.getHttpServer())[mutation.method](mutation.path)
        .set(librarianHeaders)
        .send(mutation.body)
        .expect(403);
      await request(app.getHttpServer())[mutation.method](mutation.path)
        .set(readerHeaders)
        .send(mutation.body)
        .expect(403);
    }
  });
});

function assertNoForbiddenKeys(value: unknown): void {
  visit(value, (key) => expect(USERS_RESPONSE_FORBIDDEN_KEYS).not.toContain(key));
}

function visit(value: unknown, onKey: (key: string) => void): void {
  if (Array.isArray(value)) {
    value.forEach((item) => visit(item, onKey));
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, nested] of Object.entries(value)) {
    onKey(key);
    visit(nested, onKey);
  }
}
