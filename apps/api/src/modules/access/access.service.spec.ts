import { ForbiddenException, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { AccessService } from './access.service';
import { ReaderAccessAuditService } from './reader-access-audit.service';
import { ReaderRateLimitService } from './reader-rate-limit.service';
import { PROTECTED_PAGE_RENDERER } from '../rendering/protected-page-renderer.port';
import { StubProtectedPageRenderer } from './stub-page-renderer';

describe('AccessService', () => {
  let service: AccessService;
  let prisma: { book: { findUnique: jest.Mock } };
  let auditService: { recordEvent: jest.Mock };
  let rateLimitService: { checkPageAccessRate: jest.Mock };

  const makeBook = (id: string, status: string) => ({
    id,
    title: `Book ${id}`,
    status,
    files: [{ id: `file-${id}`, status: 'ACTIVE', bucket: 'docs', objectKey: `keys/${id}.pdf` }],
  });

  beforeEach(async () => {
    prisma = {
      book: {
        findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
          const db: Record<string, any> = {
            'pub-1': makeBook('pub-1', 'PUBLISHED'),
            'draft-1': makeBook('draft-1', 'DRAFT'),
            'processing-1': makeBook('processing-1', 'PROCESSING'),
            'pending-approval-1': makeBook('pending-approval-1', 'PENDING_APPROVAL'),
            'correction-1': makeBook('correction-1', 'CORRECTION_REQUIRED'),
            'rejected-1': makeBook('rejected-1', 'REJECTED'),
            'pending-processing-1': makeBook('pending-processing-1', 'PENDING_PROCESSING'),
          };
          return Promise.resolve(db[id] ?? null);
        }),
      },
    };

    const mockStorage = { getObjectBuffer: jest.fn() };
    auditService = { recordEvent: jest.fn().mockResolvedValue({ id: 'evt-1' }) };
    rateLimitService = { checkPageAccessRate: jest.fn().mockResolvedValue({ allowed: true }) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessService,
        { provide: PrismaService, useValue: prisma },
        { provide: StorageService, useValue: mockStorage },
        { provide: ReaderAccessAuditService, useValue: auditService },
        { provide: ReaderRateLimitService, useValue: rateLimitService },
        { provide: PROTECTED_PAGE_RENDERER, useClass: StubProtectedPageRenderer },
      ],
    }).compile();

    service = module.get<AccessService>(AccessService);
  });

  it('should allow access for published document to reader and include documentStatus', async () => {
    const decision = await service.getAccessDecision('user-1', 'READER', 'pub-1');
    expect(decision.allowed).toBe(true);
    expect(decision.documentId).toBe('pub-1');
    expect(decision.documentStatus).toBe('PUBLISHED');
    expect(decision.reason).toContain('published');
  });

  it('should deny access for DRAFT document to reader with informative reason', async () => {
    const decision = await service.getAccessDecision('user-1', 'READER', 'draft-1');
    expect(decision.allowed).toBe(false);
    expect(decision.documentStatus).toBe('DRAFT');
    expect(decision.reason).toContain('not yet available');
  });

  it('should generate view tokens when allowed', async () => {
    const viewToken = await service.createViewToken('user-1', 'READER', 'pub-1');
    expect(viewToken.token).toBeDefined();
    expect(viewToken.url).toContain('/api/access/documents/pub-1/stream');
  });

  it('should throw ForbiddenException for download tokens requested by READER', async () => {
    await expect(service.createDownloadToken('user-1', 'READER', 'pub-1')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should allow download tokens for staff roles', async () => {
    const adminToken = await service.createDownloadToken('admin-1', 'ADMIN', 'pub-1');
    expect(adminToken.token).toBeDefined();

    const libToken = await service.createDownloadToken('lib-1', 'LIBRARIAN', 'pub-1');
    expect(libToken.token).toBeDefined();
  });

  it('should return document manifest for published document', async () => {
    const manifest = await service.getDocumentManifest('user-1', 'READER', 'pub-1');
    expect(manifest.documentId).toBe('pub-1');
    expect(manifest.pageCount).toBe(10);
    expect(manifest.pages.length).toBe(10);
    expect(manifest.minZoom).toBe(0.5);
    expect(manifest.maxZoom).toBe(2.0);
  });

  it('should render watermarked protected page and write audit event', async () => {
    const page = await service.getProtectedPage('user-1', 'READER', 'sess-1', 'pub-1', 1);
    expect(page.content).toBeDefined();
    expect(page.contentType).toBe('image/png');
    expect(page.cacheControl).toBe('private, no-store');
    expect(page.traceFingerprint).toBeDefined();
    expect(auditService.recordEvent).toHaveBeenCalled();
  });

  it('should throw 429 HttpException when page rate limit is exceeded', async () => {
    rateLimitService.checkPageAccessRate.mockResolvedValueOnce({
      allowed: false,
      retryAfterSeconds: 45,
      eventType: 'RATE_LIMITED',
      reasonCode: 'RATE_LIMIT_EXCEEDED',
      riskLevel: 'LOW',
    });

    await expect(
      service.getProtectedPage('user-1', 'READER', 'sess-1', 'pub-1', 1),
    ).rejects.toThrow(HttpException);
  });
});
