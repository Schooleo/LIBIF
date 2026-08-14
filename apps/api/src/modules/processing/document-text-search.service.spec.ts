import { Test, type TestingModule } from '@nestjs/testing';
import { ProcessingArtifactKind } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { DocumentTextSearchService } from './document-text-search.service';

describe('DocumentTextSearchService', () => {
  let service: DocumentTextSearchService;

  const prisma = {
    bookFile: { findFirst: jest.fn() },
    processingArtifact: { findFirst: jest.fn() }
  };
  const storage = { getObjectBuffer: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentTextSearchService,
        { provide: PrismaService, useValue: prisma },
        { provide: StorageService, useValue: storage }
      ]
    }).compile();

    service = module.get(DocumentTextSearchService);
    jest.clearAllMocks();
    prisma.bookFile.findFirst.mockResolvedValue({ id: 'file-1' });
    prisma.processingArtifact.findFirst.mockResolvedValue({
      kind: ProcessingArtifactKind.OCR_LAYOUT,
      bucket: 'private-documents',
      objectKey: 'artifacts/book-1/file-1/job-1/page-text.json'
    });
  });

  it('returns at most five matching pages with aggregate match metadata', async () => {
    storage.getObjectBuffer.mockResolvedValue(Buffer.from(JSON.stringify({
      version: 1,
      pages: Array.from({ length: 6 }, (_, index) => ({
        pageNumber: index + 1,
        text: `Context before keyword on page ${index + 1}. Keyword appears again: keyword.`
      }))
    })));

    const result = await service.searchDocument('book-1', 'keyword', { includeSnippets: true });

    expect(result.available).toBe(true);
    expect(result.results).toHaveLength(5);
    expect(result.results.map((item) => item.pageNumber)).toEqual([1, 2, 3, 4, 5]);
    expect(result.results[0]).toEqual(expect.objectContaining({ matchCount: 3 }));
    expect(result.results[0]?.snippet).toContain('keyword');
    expect(result.totalPagesWithMatches).toBe(6);
    expect(result.totalMatches).toBe(18);
    expect(result.truncated).toBe(true);
  });

  it('omits result snippets for the reader-facing response', async () => {
    storage.getObjectBuffer.mockResolvedValue(Buffer.from(JSON.stringify({
      version: 1,
      pages: [{ pageNumber: 4, text: 'A protected keyword appears here.' }]
    })));

    const result = await service.searchDocument('book-1', 'keyword', { includeSnippets: false });

    expect(result.results).toEqual([{ pageNumber: 4, matchCount: 1 }]);
  });

  it('returns an unavailable response when no page-text artifact exists', async () => {
    prisma.processingArtifact.findFirst.mockResolvedValue(null);

    await expect(service.searchDocument('book-1', 'keyword', { includeSnippets: true })).resolves.toEqual({
      available: false,
      query: 'keyword',
      results: [],
      totalMatches: 0,
      totalPagesWithMatches: 0,
      truncated: false
    });
    expect(storage.getObjectBuffer).not.toHaveBeenCalled();
  });
});
