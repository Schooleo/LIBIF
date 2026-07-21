import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../database/prisma.service';
import { AccessService } from './access.service';

describe('AccessService', () => {
  let service: AccessService;
  let prisma: { book: { findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      book: {
        findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
          if (id === 'pub-1') {
            return Promise.resolve({ id: 'pub-1', title: 'Published Book', status: 'PUBLISHED' });
          }
          if (id === 'draft-1') {
            return Promise.resolve({ id: 'draft-1', title: 'Draft Book', status: 'DRAFT' });
          }
          return Promise.resolve(null);
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AccessService>(AccessService);
  });

  it('should allow access for published document to reader', async () => {
    const decision = await service.getAccessDecision('user-1', 'READER', 'pub-1');
    expect(decision.allowed).toBe(true);
    expect(decision.documentId).toBe('pub-1');
  });

  it('should deny access for draft document to reader', async () => {
    const decision = await service.getAccessDecision('user-1', 'READER', 'draft-1');
    expect(decision.allowed).toBe(false);
  });

  it('should allow access for draft document to admin or librarian', async () => {
    const adminDecision = await service.getAccessDecision('user-admin', 'ADMIN', 'draft-1');
    expect(adminDecision.allowed).toBe(true);

    const librarianDecision = await service.getAccessDecision('user-lib', 'LIBRARIAN', 'draft-1');
    expect(librarianDecision.allowed).toBe(true);
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
