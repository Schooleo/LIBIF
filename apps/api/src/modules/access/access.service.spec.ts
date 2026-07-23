import {
  ForbiddenException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ReaderAccessEventType,
  ReaderAccessReasonCode,
  ReaderAccessRiskLevel,
} from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import {
  PROTECTED_PAGE_RENDERER,
  type ProtectedPageRenderer,
} from '../rendering/protected-page-renderer.port';
import { StorageService } from '../storage/storage.service';
import { AccessService } from './access.service';
import { ReaderAccessAuditService } from './reader-access-audit.service';
import {
  DetectorDependencyUnavailableError,
  ReaderRateLimitService,
} from './reader-rate-limit.service';

describe('AccessService', () => {
  let service: AccessService;
  let prisma: { book: { findUnique: jest.Mock } };
  let auditService: { recordEvent: jest.Mock };
  let rateLimitService: { checkPageAccessRate: jest.Mock };
  let pageRenderer: jest.Mocked<ProtectedPageRenderer>;

  const makeBook = (id: string, status: string) => ({
    id,
    title: `Book ${id}`,
    status,
    files: [
      {
        id: `file-${id}`,
        status: 'ACTIVE',
        bucket: 'docs',
        objectKey: `keys/${id}.pdf`,
        mimeType: 'application/pdf',
        originalFilename: `${id}.pdf`,
      },
    ],
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
    pageRenderer = {
      renderBasePage: jest.fn().mockResolvedValue({
        content: Buffer.from('base'),
        contentType: 'image/webp',
        pageNumber: 1,
        pageCount: 10,
        width: 800,
        height: 1131,
        profile: 'READER_STANDARD',
      }),
      composeWatermark: jest.fn().mockResolvedValue({
        content: Buffer.from('watermarked'),
        contentType: 'image/webp',
        pageNumber: 1,
        pageCount: 10,
        width: 800,
        height: 1131,
        traceFingerprint: 'trace-1',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessService,
        { provide: PrismaService, useValue: prisma },
        { provide: StorageService, useValue: mockStorage },
        { provide: ReaderAccessAuditService, useValue: auditService },
        { provide: ReaderRateLimitService, useValue: rateLimitService },
        { provide: PROTECTED_PAGE_RENDERER, useValue: pageRenderer },
      ],
    }).compile();

    service = module.get<AccessService>(AccessService);
  });

  it('allows access for published document to reader and includes documentStatus', async () => {
    const decision = await service.getAccessDecision('user-1', 'READER', 'pub-1');
    expect(decision.allowed).toBe(true);
    expect(decision.documentId).toBe('pub-1');
    expect(decision.documentStatus).toBe('PUBLISHED');
    expect(decision.reason).toContain('published');
  });

  it('denies access for DRAFT document to reader with informative reason', async () => {
    const decision = await service.getAccessDecision('user-1', 'READER', 'draft-1');
    expect(decision.allowed).toBe(false);
    expect(decision.documentStatus).toBe('DRAFT');
    expect(decision.reason).toContain('not yet available');
  });

  it('denies source-view tokens for readers and audits the denial', async () => {
    await expect(service.createViewToken('user-1', 'READER', 'pub-1')).rejects.toThrow(
      ForbiddenException,
    );
    expect(auditService.recordEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: ReaderAccessEventType.PAGE_DENIED,
        reasonCode: ReaderAccessReasonCode.ACCESS_DENIED,
      }),
    );
  });

  it('allows source-view tokens for staff roles only', async () => {
    const viewToken = await service.createViewToken('admin-1', 'ADMIN', 'pub-1');
    expect(viewToken.token).toMatch(/^v1\.view\./);
    expect(viewToken.url).toContain('/api/access/documents/pub-1/stream');
  });

  it('throws ForbiddenException for download tokens requested by READER', async () => {
    await expect(service.createDownloadToken('user-1', 'READER', 'pub-1')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('allows download tokens for staff roles', async () => {
    const adminToken = await service.createDownloadToken('admin-1', 'ADMIN', 'pub-1');
    expect(adminToken.token).toMatch(/^v1\.download\./);

    const libToken = await service.createDownloadToken('lib-1', 'LIBRARIAN', 'pub-1');
    expect(libToken.token).toMatch(/^v1\.download\./);
  });

  it('returns document manifest for published document and records viewer-opened audit', async () => {
    const manifest = await service.getDocumentManifest('user-1', 'READER', 'pub-1');
    expect(manifest.documentId).toBe('pub-1');
    expect(manifest.pageCount).toBe(10);
    expect(manifest.pages.length).toBe(10);
    expect(manifest.minZoom).toBe(0.5);
    expect(manifest.maxZoom).toBe(2.0);
    expect(auditService.recordEvent).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: ReaderAccessEventType.VIEWER_OPENED }),
    );
  });

  it('records a bounded denial event when manifest access is denied', async () => {
    await expect(service.getDocumentManifest('user-1', 'READER', 'draft-1')).rejects.toThrow(
      ForbiddenException,
    );

    expect(auditService.recordEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: ReaderAccessEventType.PAGE_DENIED,
        reasonCode: ReaderAccessReasonCode.DOCUMENT_UNAVAILABLE,
      }),
    );
  });

  it('renders watermarked protected page and writes audit event', async () => {
    const page = await service.getProtectedPage('user-1', 'READER', 'sess-1', 'pub-1', 1);
    expect(page.content).toEqual(Buffer.from('watermarked'));
    expect(page.contentType).toBe('image/webp');
    expect(page.cacheControl).toBe('private, no-store');
    expect(page.traceFingerprint).toBeDefined();
    expect(auditService.recordEvent).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: ReaderAccessEventType.PAGE_SERVED }),
    );
  });

  it('throws 429 HttpException with stable retryAfterSeconds when page rate limit is exceeded', async () => {
    rateLimitService.checkPageAccessRate.mockResolvedValueOnce({
      allowed: false,
      retryAfterSeconds: 45,
      eventType: ReaderAccessEventType.RATE_LIMITED,
      reasonCode: ReaderAccessReasonCode.RATE_LIMIT_EXCEEDED,
      riskLevel: ReaderAccessRiskLevel.LOW,
    });

    await expect(
      service.getProtectedPage('user-1', 'READER', 'sess-1', 'pub-1', 1),
    ).rejects.toMatchObject({
      response: expect.objectContaining({
        code: 'READER_PAGE_RATE_LIMITED',
        retryAfterSeconds: 45,
      }),
      status: 429,
    });
  });

  it('fails closed when the detector dependency is unavailable and records a high-risk denial', async () => {
    rateLimitService.checkPageAccessRate.mockRejectedValueOnce(
      new DetectorDependencyUnavailableError(),
    );

    await expect(
      service.getProtectedPage('user-1', 'READER', 'sess-1', 'pub-1', 1),
    ).rejects.toThrow(ServiceUnavailableException);

    expect(auditService.recordEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: ReaderAccessEventType.PAGE_DENIED,
        reasonCode: ReaderAccessReasonCode.DEPENDENCY_UNAVAILABLE,
        riskLevel: ReaderAccessRiskLevel.HIGH,
      }),
    );
    expect(pageRenderer.composeWatermark).not.toHaveBeenCalled();
  });

  it('fails closed when audit persistence fails after watermarking', async () => {
    auditService.recordEvent.mockRejectedValueOnce(new Error('audit offline'));

    await expect(
      service.getProtectedPage('user-1', 'READER', 'sess-1', 'pub-1', 1),
    ).rejects.toThrow('audit offline');
  });

  it('denies raw document file access for readers and enforces token purpose for staff', async () => {
    await expect(
      service.getDocumentFile('user-1', 'READER', 'pub-1', 'v1.view.fake', 'view'),
    ).rejects.toThrow(ForbiddenException);

    await expect(
      service.getDocumentFile('admin-1', 'ADMIN', 'pub-1', 'v1.download.fake', 'view'),
    ).rejects.toThrow(ForbiddenException);

    const token = await service.createViewToken('admin-1', 'ADMIN', 'pub-1');
    await expect(
      service.getDocumentFile('admin-1', 'ADMIN', 'pub-1', token.token, 'view'),
    ).resolves.toEqual(expect.objectContaining({ id: 'file-pub-1' }));
  });
});
