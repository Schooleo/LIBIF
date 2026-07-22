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
      bookFile: {
        updateMany: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        findUniqueOrThrow: jest.fn()
      },
      processingJob: {
        create: jest.fn(),
        findFirst: jest.fn().mockResolvedValue(null),
        updateMany: jest.fn()
      },
      approvalReview: {
        updateMany: jest.fn()
      },
      bookAuditEvent: {
        create: jest.fn()
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

  it('should map approval history and processing history in getDocumentDetail', async () => {
    const mockDoc = {
      id: 'doc_1',
      title: 'Sample Doc',
      status: 'REJECTED',
      createdAt: new Date('2026-07-01'),
      updatedAt: new Date('2026-07-02'),
      files: [{ id: 'f1', originalFilename: 'doc.pdf', sizeBytes: BigInt(100), version: 1, status: 'ACTIVE', createdAt: new Date() }],
      jobs: [{ id: 'j1', status: 'SUCCEEDED', progressPercent: 100, updatedAt: new Date() }],
      approvalReviews: [
        {
          id: 'ar_1',
          status: 'CORRECTION_REQUESTED',
          reason: 'Publisher missing',
          requestedChanges: 'Please specify publisher',
          reviewer: { email: 'admin@libif.local' },
          decidedAt: new Date('2026-07-02'),
          createdAt: new Date('2026-07-02')
        }
      ],
      auditEvents: []
    };
    prisma.book.findUnique.mockResolvedValue(mockDoc);

    const res = await service.getDocumentDetail('doc_1');
    expect(res.id).toBe('doc_1');
    expect(res.approvalHistory).toHaveLength(1);
    expect(res.approvalHistory[0].requestedChanges).toBe('Please specify publisher');
    expect(res.latestApprovalReview?.reviewerEmail).toBe('admin@libif.local');
    expect(res.processingHistory).toHaveLength(1);
  });

  it('should resubmit document for processing when in rejected state', async () => {
    const mockDoc = {
      id: 'doc_1',
      title: 'Sample Doc',
      status: 'REJECTED',
      createdAt: new Date('2026-07-01'),
      updatedAt: new Date('2026-07-02'),
      files: [{ id: 'f1', originalFilename: 'doc.pdf', sizeBytes: BigInt(100), version: 1, status: 'ACTIVE', createdAt: new Date() }],
      jobs: [],
      auditEvents: []
    };

    prisma.book.findUnique.mockResolvedValue(mockDoc);
    prisma.bookFile.findUniqueOrThrow.mockResolvedValue({
      id: 'f1',
      objectKey: 'key1'
    });
    prisma.processingJob.create.mockResolvedValue({
      id: 'job_2'
    });
    prisma.bookAuditEvent.create.mockResolvedValue({
       id: 'evt_1'
     });

    await service.submitProcessing('doc_1', 'staff@libif.local');
    expect(prisma.book.update).toHaveBeenCalledWith({
      where: { id: 'doc_1' },
      data: { status: 'PENDING_PROCESSING' }
    });
    expect(queue.enqueueBookUploaded).toHaveBeenCalledWith({
      bookId: 'doc_1',
      fileId: 'f1',
      objectKey: 'key1',
      processingJobId: 'job_2'
    });

  it('removes stale pending approvals when replacing the active file', async () => {
    const now = new Date('2026-07-22T00:00:00Z');
    const oldFile = {
      id: 'file-1',
      originalFilename: 'old.pdf',
      mimeType: 'application/pdf',
      sizeBytes: BigInt(100),
      version: 1,
      status: 'ACTIVE',
      createdAt: now
    };
    const newFile = { ...oldFile, id: 'file-2', originalFilename: 'new.pdf', version: 2 };
    const document = {
      id: 'doc-1',
      title: 'Document',
      status: 'PENDING_APPROVAL',
      files: [oldFile],
      jobs: [],
      auditEvents: [],
      category: null,
      tags: [],
      authors: [],
      createdAt: now,
      updatedAt: now
    };
    prisma.book.findUnique.mockResolvedValue(document);
    prisma.bookFile.findMany.mockResolvedValue([oldFile]);
    prisma.bookFile.create.mockResolvedValue(newFile);
    prisma.processingJob.create.mockResolvedValue({ id: 'job-2' });

    const file = {
      originalname: 'new.pdf',
      mimetype: 'application/pdf',
      size: 8,
      buffer: Buffer.from('%PDF-1.4')
    } as Express.Multer.File;

    await service.replaceFile('doc-1', file, 'staff@libif.local');

    expect(prisma.approvalReview.updateMany).toHaveBeenCalledWith({
      where: { bookId: 'doc-1', status: 'PENDING' },
      data: expect.objectContaining({ status: 'SUPERSEDED' })
    });
    expect(prisma.processingJob.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { bookId: 'doc-1', status: { in: ['QUEUED', 'RUNNING'] } },
      data: expect.objectContaining({ status: 'SUPERSEDED', stage: 'superseded' })
    }));
    expect(queue.enqueueBookUploaded).toHaveBeenCalledWith(expect.objectContaining({
      bookId: 'doc-1',
      fileId: 'file-2',
      processingJobId: 'job-2'
    }));
  });

  it('supersedes older work before manually requeuing processing', async () => {
    const now = new Date('2026-07-22T00:00:00Z');
    const activeFile = {
      id: 'file-1',
      originalFilename: 'document.pdf',
      mimeType: 'application/pdf',
      sizeBytes: BigInt(100),
      version: 1,
      status: 'ACTIVE',
      createdAt: now
    };
    prisma.book.findUnique.mockResolvedValue({
      id: 'doc-1',
      title: 'Document',
      status: 'FAILED',
      files: [activeFile],
      jobs: [],
      auditEvents: [],
      category: null,
      tags: [],
      authors: [],
      createdAt: now,
      updatedAt: now
    });
    prisma.bookFile.findUniqueOrThrow.mockResolvedValue({ ...activeFile, objectKey: 'pdf1' });
    prisma.processingJob.create.mockResolvedValue({ id: 'job-2' });

    await service.submitProcessing('doc-1', 'staff@libif.local');

    expect(prisma.processingJob.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { bookId: 'doc-1', status: { in: ['QUEUED', 'RUNNING'] } },
      data: expect.objectContaining({ status: 'SUPERSEDED', stage: 'superseded' })
    }));
    expect(prisma.approvalReview.updateMany).toHaveBeenCalledWith({
      where: { bookId: 'doc-1', status: 'PENDING' },
      data: expect.objectContaining({ status: 'SUPERSEDED' })
    });
    expect(queue.enqueueBookUploaded).toHaveBeenCalledWith(expect.objectContaining({
      bookId: 'doc-1',
      fileId: 'file-1',
      processingJobId: 'job-2'
    }));
  });
});
