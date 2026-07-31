import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpErrorFilter } from '../src/common/http-error.filter';
import { UserAccountStatus } from '../src/generated/prisma/client';
import { PasswordHasher } from '../src/modules/auth/password-hasher.service';
import { PasswordResetDeliveryService } from '../src/modules/auth/password-reset-delivery.service';
import { ProcessingQueue } from '../src/modules/processing/processing.queue';
import { PrismaService } from '../src/modules/database/prisma.service';

class FakeProcessingQueue {
  async enqueueBookUploaded(_event: unknown): Promise<void> {}
}

describe('Authentication and access (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let hasher: PasswordHasher;
  let deliveries: PasswordResetDeliveryService;
  const originalScryptN = process.env.LIBIF_SCRYPT_N;
  const originalDevAuth = process.env.LIBIF_ENABLE_DEV_AUTH;
  const smtpEnvironment = Object.fromEntries(
    ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USERNAME', 'SMTP_PASSWORD', 'SMTP_FROM', 'SMTP_SECURE'].map((name) => [name, process.env[name]])
  );

  beforeAll(async () => {
    process.env.LIBIF_SCRYPT_N = '1024';
    process.env.LIBIF_ENABLE_DEV_AUTH = 'false';
    for (const name of Object.keys(smtpEnvironment)) process.env[name] = '';
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(ProcessingQueue)
      .useClass(FakeProcessingQueue)
      .compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpErrorFilter());
    await app.init();
    prisma = app.get(PrismaService);
    hasher = app.get(PasswordHasher);
    deliveries = app.get(PasswordResetDeliveryService);
  });

  beforeEach(async () => {
    deliveries.clearDeliveries();
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "ReaderAccessEvent", "UserAdministrationEvent" CASCADE;').catch(() => {});
    await prisma.passwordResetToken.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.processingJob.deleteMany();
    await prisma.bookFile.deleteMany();
    await prisma.bookTag.deleteMany();
    await prisma.bookAuthor.deleteMany();
    await prisma.book.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.author.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
    process.env.LIBIF_SCRYPT_N = originalScryptN;
    process.env.LIBIF_ENABLE_DEV_AUTH = originalDevAuth;
    for (const [name, value] of Object.entries(smtpEnvironment)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });

  it('registers a reader, sets an http-only session cookie, and resolves the session', async () => {
    const registerResponse = await request(app.getHttpServer()).post('/api/auth/register').send({ email: 'Reader@Example.edu', password: 'correct horse battery staple' }).expect(201);
    const registerCookie = setCookieHeader(registerResponse.headers['set-cookie']);
    expect(registerCookie).toContain('libif_session=');
    expect(registerCookie).toContain('HttpOnly');
    expect(registerCookie).toContain('SameSite=Lax');
    expect(registerResponse.body).toMatchObject({ authenticated: true, user: { email: 'reader@example.edu', role: 'READER' }, strategy: 'persistent-cookie' });
    expect(registerResponse.body.permissions).toContain('reader:library:read');

    const storedUser = await prisma.user.findUniqueOrThrow({ where: { email: 'reader@example.edu' } });
    expect(storedUser.passwordHash).toMatch(/^scrypt\$/);
    expect(storedUser.passwordHash).not.toContain('correct horse battery staple');

    const sessionCookie = sessionCookieHeader(registerResponse.headers['set-cookie']);
    const sessionResponse = await request(app.getHttpServer()).get('/api/auth/session').set('Cookie', sessionCookie).expect(200);
    expect(sessionResponse.body).toMatchObject({ authenticated: true, user: { email: 'reader@example.edu', role: 'READER' }, strategy: 'persistent-cookie' });
  });

  it('rejects duplicate registration and invalid credentials safely', async () => {
    await request(app.getHttpServer()).post('/api/auth/register').send({ email: 'reader@example.edu', password: 'correct horse battery staple' }).expect(201);
    await request(app.getHttpServer()).post('/api/auth/register').send({ email: 'reader@example.edu', password: 'correct horse battery staple' }).expect(409).expect((response) => expect(response.body).toMatchObject({ code: 'RESOURCE_CONFLICT', status: 409, fieldErrors: {} }));
    await request(app.getHttpServer()).post('/api/auth/sign-in').send({ email: 'reader@example.edu', password: 'wrong password' }).expect(401).expect((response) => expect(response.body).toMatchObject({ code: 'AUTHENTICATION_FAILED', status: 401, fieldErrors: {} }));
  });

  it('signs in and signs out with session revocation', async () => {
    await prisma.user.create({ data: { email: 'staff@example.edu', passwordHash: await hasher.hash('correct horse battery staple'), role: 'LIBRARIAN' } });
    const signInResponse = await request(app.getHttpServer()).post('/api/auth/sign-in').send({ email: 'staff@example.edu', password: 'correct horse battery staple' }).expect(200);
    const sessionCookie = sessionCookieHeader(signInResponse.headers['set-cookie']);
    await request(app.getHttpServer()).get('/api/admin/books').set('Cookie', sessionCookie).expect(200);
    const signOut = await request(app.getHttpServer()).post('/api/auth/sign-out').set('Cookie', sessionCookie).expect(200);
    expect(setCookieHeader(signOut.headers['set-cookie'])).toContain('libif_session=;');
    await request(app.getHttpServer()).get('/api/auth/session').set('Cookie', sessionCookie).expect(200).expect((response) => expect(response.body.authenticated).toBe(false));
    await request(app.getHttpServer()).get('/api/admin/books').set('Cookie', sessionCookie).expect(403).expect((response) => expect(response.body).toMatchObject({ code: 'AUTHENTICATION_REQUIRED', status: 403, fieldErrors: {} }));
  });

  it('rejects sign-in and existing cookies after account deactivation', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'deactivation@example.edu',
        passwordHash: await hasher.hash('correct horse battery staple'),
        role: 'READER'
      }
    });
    const signInResponse = await request(app.getHttpServer())
      .post('/api/auth/sign-in')
      .send({ email: user.email, password: 'correct horse battery staple' })
      .expect(200);
    const sessionCookie = sessionCookieHeader(signInResponse.headers['set-cookie']);

    await prisma.user.update({
      where: { id: user.id },
      data: { status: UserAccountStatus.DEACTIVATED, deactivatedAt: new Date() }
    });

    await request(app.getHttpServer())
      .get('/api/auth/session')
      .set('Cookie', sessionCookie)
      .expect(200)
      .expect(({ body }) => expect(body.authenticated).toBe(false));
    await request(app.getHttpServer())
      .post('/api/auth/sign-in')
      .send({ email: user.email, password: 'correct horse battery staple' })
      .expect(401);

    const sessions = await prisma.userSession.findMany({ where: { userId: user.id } });
    expect(sessions).toHaveLength(1);
    expect(sessions[0].revokedAt).toBeInstanceOf(Date);
  });

  it('uses uniform reset request responses and consumes reset tokens exactly once', async () => {
    await prisma.user.create({ data: { email: 'reader@example.edu', passwordHash: await hasher.hash('correct horse battery staple'), role: 'READER' } });
    const signInResponse = await request(app.getHttpServer()).post('/api/auth/sign-in').send({ email: 'reader@example.edu', password: 'correct horse battery staple' }).expect(200);
    const sessionCookie = sessionCookieHeader(signInResponse.headers['set-cookie']);

    const existing = await request(app.getHttpServer()).post('/api/auth/password-reset-requests').send({ email: 'reader@example.edu' }).expect(200);
    const missing = await request(app.getHttpServer()).post('/api/auth/password-reset-requests').send({ email: 'missing@example.edu' }).expect(200);
    expect(existing.body).toEqual(missing.body);

    const token = deliveries.getLatestDelivery('reader@example.edu')?.token;
    expect(token).toBeTruthy();
    await request(app.getHttpServer()).post('/api/auth/password-resets').send({ token, password: 'new correct horse battery staple' }).expect(200);
    await request(app.getHttpServer()).post('/api/auth/password-resets').send({ token, password: 'another correct horse battery staple' }).expect(400);
    await request(app.getHttpServer()).get('/api/auth/session').set('Cookie', sessionCookie).expect(200).expect((response) => expect(response.body.authenticated).toBe(false));
    await request(app.getHttpServer()).post('/api/auth/sign-in').send({ email: 'reader@example.edu', password: 'new correct horse battery staple' }).expect(200);
  });
});

function setCookieHeader(header: string | string[] | undefined): string {
  if (Array.isArray(header)) return header.join('; ');
  return header ?? '';
}

function sessionCookieHeader(header: string | string[] | undefined): string {
  const value = Array.isArray(header) ? header[0] : header;
  return value?.split(';')[0] ?? '';
}
