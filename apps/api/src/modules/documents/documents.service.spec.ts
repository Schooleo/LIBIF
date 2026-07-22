import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ProcessingQueue } from '../processing/processing.queue';
import { NotFoundException } from '@nestjs/common';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let prisma: any;
  let storage: any;
  let queue: any;

  beforeEach(async () => {
    prisma = {
      book: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue({ id: 'doc_1' })
      },
      user: {
        upsert: jest.fn().mockResolvedValue({ id: 'usr_1', email: 'staff@libif.local' })
      },
      $transaction: jest.fn((cb) => cb(prisma))
    };
    storage = {
      putPrivatePdf: jest.fn().mockResolvedValue({ bucket: 'libif-docs', objectKey: 'pdf1', sizeBytes: BigInt(100), checksumSha256: 'hash' }),
      deleteObject: jest.fn().mockResolvedValue(undefined)
    };
    queue = {
      enqueueBookUploaded: jest.fn().mockResolvedValue(undefined)
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: PrismaService, useValue: prisma },
        { provide: StorageService, useValue: storage },
        { provide: ProcessingQueue, useValue: queue }
      ]
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list documents with pagination', async () => {
    const res = await service.listDocuments({ page: 1, limit: 10 });
    expect(res.page).toBe(1);
    expect(res.items).toEqual([]);
    expect(prisma.book.findMany).toHaveBeenCalled();
  });

  it('should throw NotFoundException if document detail is missing', async () => {
    await expect(service.getDocumentDetail('invalid_id')).rejects.toThrow(NotFoundException);
  });
});
