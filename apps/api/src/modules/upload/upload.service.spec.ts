import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ProcessingQueue } from '../processing/processing.queue';
import { NotFoundException } from '@nestjs/common';

describe('UploadService', () => {
  let service: UploadService;
  let prisma: any;
  let storage: any;
  let queue: any;

  beforeEach(async () => {
    prisma = {
      book: {
        findUnique: jest.fn().mockResolvedValue(null)
      },
      user: {
        upsert: jest.fn().mockResolvedValue({ id: 'usr_1', email: 'staff@libif.local' })
      },
      $transaction: jest.fn((cb) => cb(prisma))
    };
    storage = {
      putPrivatePdf: jest.fn(),
      deleteObject: jest.fn()
    };
    queue = {
      enqueueBookUploaded: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        { provide: PrismaService, useValue: prisma },
        { provide: StorageService, useValue: storage },
        { provide: ProcessingQueue, useValue: queue }
      ]
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if upload state record is missing', async () => {
    await expect(service.getUploadState('invalid_id')).rejects.toThrow(NotFoundException);
  });
});
