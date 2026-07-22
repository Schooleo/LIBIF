import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { AccessService } from './access.service';

describe('AccessService', () => {
  let service: AccessService;
  let prisma: { book: { findUnique: jest.Mock } };

  const makeBook = (id: string, status: string) => ({ id, title: `Book ${id}`, status });

  beforeEach(async () => {
    prisma = {
      book: {
        findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
          const db: Record<string, { id: string; title: string; status: string }> = {
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessService,
        { provide: PrismaService, useValue: prisma },
        { provide: StorageService, useValue: mockStorage },
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

  it('should deny access for PROCESSING document to reader with informative reason', async () => {
    const decision = await service.getAccessDecision('user-1', 'READER', 'processing-1');
    expect(decision.allowed).toBe(false);
    expect(decision.documentStatus).toBe('PROCESSING');
    expect(decision.reason).toContain('being processed');
  });

  it('should deny access for PENDING_APPROVAL document to reader', async () => {
    const decision = await service.getAccessDecision('user-1', 'READER', 'pending-approval-1');
    expect(decision.allowed).toBe(false);
    expect(decision.documentStatus).toBe('PENDING_APPROVAL');
    expect(decision.reason).toContain('under review');
  });

  it('should deny access for REJECTED document to reader', async () => {
    const decision = await service.getAccessDecision('user-1', 'READER', 'rejected-1');
    expect(decision.allowed).toBe(false);
    expect(decision.documentStatus).toBe('REJECTED');
  });

  it('should deny access for CORRECTION_REQUIRED document to reader with informative reason', async () => {
    const decision = await service.getAccessDecision('user-1', 'READER', 'correction-1');
    expect(decision.allowed).toBe(false);
    expect(decision.documentStatus).toBe('CORRECTION_REQUIRED');
    expect(decision.reason).toContain('under revision');
  });

  it('should allow access for draft/processing documents to admin or librarian', async () => {
    const adminDecision = await service.getAccessDecision('user-admin', 'ADMIN', 'draft-1');
    expect(adminDecision.allowed).toBe(true);
    expect(adminDecision.documentStatus).toBe('DRAFT');

    const librarianDecision = await service.getAccessDecision('user-lib', 'LIBRARIAN', 'processing-1');
    expect(librarianDecision.allowed).toBe(true);
    expect(librarianDecision.documentStatus).toBe('PROCESSING');
  });

  it('should throw NotFoundException for invalid document ID', async () => {
    await expect(service.getAccessDecision('user-1', 'READER', 'invalid-id')).rejects.toThrow(NotFoundException);
  });

  it('should generate view and download tokens when allowed', async () => {
    const viewToken = await service.createViewToken('user-1', 'READER', 'pub-1');
    expect(viewToken.token).toBeDefined();
    expect(viewToken.url).toContain('/api/access/documents/pub-1/stream');

    const downloadToken = await service.createDownloadToken('user-1', 'READER', 'pub-1');
    expect(downloadToken.token).toBeDefined();
    expect(downloadToken.url).toContain('/api/access/documents/pub-1/file');
  });

  it('should throw ForbiddenException on token generation when denied', async () => {
    await expect(service.createViewToken('user-1', 'READER', 'draft-1')).rejects.toThrow(ForbiddenException);
    await expect(service.createDownloadToken('user-1', 'READER', 'draft-1')).rejects.toThrow(ForbiddenException);
  });
});
