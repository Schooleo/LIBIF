import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { BookFileStatus, ProcessingArtifactKind } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import type {
  DocumentPageSearchResponseDto,
  DocumentPageSearchResultDto
} from './dto/document-page-search.dto';

const MAX_RESULTS = 5;
const SNIPPET_CONTEXT_CHARACTERS = 70;

type PageTextArtifact = {
  version: 1;
  pages: Array<{ pageNumber: number; text: string }>;
};

@Injectable()
export class DocumentTextSearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService
  ) {}

  async searchDocument(
    documentId: string,
    query: string,
    options: { includeSnippets: boolean }
  ): Promise<DocumentPageSearchResponseDto> {
    const activeFile = await this.prisma.bookFile.findFirst({
      where: { bookId: documentId, status: BookFileStatus.ACTIVE },
      orderBy: { version: 'desc' },
      select: { id: true }
    });

    const normalizedQuery = query.trim();
    if (!activeFile) return unavailableResponse(normalizedQuery);

    const artifact = await this.prisma.processingArtifact.findFirst({
      where: {
        bookFileId: activeFile.id,
        kind: ProcessingArtifactKind.OCR_LAYOUT
      },
      orderBy: { createdAt: 'desc' },
      select: { bucket: true, objectKey: true }
    });

    if (!artifact) return unavailableResponse(normalizedQuery);

    let pageTextArtifact: PageTextArtifact;
    try {
      const buffer = await this.storage.getObjectBuffer(artifact.bucket, artifact.objectKey);
      pageTextArtifact = parsePageTextArtifact(buffer);
    } catch {
      throw new ServiceUnavailableException('Document page search is temporarily unavailable.');
    }

    return searchPages(pageTextArtifact.pages, normalizedQuery, options.includeSnippets);
  }
}

function searchPages(
  pages: PageTextArtifact['pages'],
  query: string,
  includeSnippets: boolean
): DocumentPageSearchResponseDto {
  const normalizedNeedle = normalizeSearchText(query);
  const allMatches: DocumentPageSearchResultDto[] = [];
  let totalMatches = 0;

  for (const page of pages) {
    const displayText = page.text.replace(/\s+/g, ' ').trim();
    const normalizedText = normalizeSearchText(displayText);
    const matchIndexes = findMatchIndexes(normalizedText, normalizedNeedle);
    if (matchIndexes.length === 0) continue;

    totalMatches += matchIndexes.length;
    allMatches.push({
      pageNumber: page.pageNumber,
      matchCount: matchIndexes.length,
      ...(includeSnippets
        ? { snippet: makeSnippet(displayText, matchIndexes[0] ?? 0, query.length) }
        : {})
    });
  }

  return {
    available: true,
    query,
    results: allMatches.slice(0, MAX_RESULTS),
    totalMatches,
    totalPagesWithMatches: allMatches.length,
    truncated: allMatches.length > MAX_RESULTS
  };
}

function parsePageTextArtifact(buffer: Buffer): PageTextArtifact {
  const parsed: unknown = JSON.parse(buffer.toString('utf8'));
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid page-text artifact');
  const candidate = parsed as Partial<PageTextArtifact>;
  if (candidate.version !== 1 || !Array.isArray(candidate.pages)) {
    throw new Error('Unsupported page-text artifact');
  }

  const pages = candidate.pages.map((page) => {
    if (
      !page ||
      typeof page !== 'object' ||
      !Number.isInteger(page.pageNumber) ||
      page.pageNumber < 1 ||
      typeof page.text !== 'string'
    ) {
      throw new Error('Invalid page-text entry');
    }
    return { pageNumber: page.pageNumber, text: page.text };
  });

  return { version: 1, pages };
}

function findMatchIndexes(text: string, needle: string): number[] {
  if (!needle) return [];
  const indexes: number[] = [];
  let offset = 0;
  while (offset <= text.length - needle.length) {
    const index = text.indexOf(needle, offset);
    if (index === -1) break;
    indexes.push(index);
    offset = index + needle.length;
  }
  return indexes;
}

function makeSnippet(text: string, matchIndex: number, queryLength: number): string {
  const start = Math.max(0, matchIndex - SNIPPET_CONTEXT_CHARACTERS);
  const end = Math.min(text.length, matchIndex + queryLength + SNIPPET_CONTEXT_CHARACTERS);
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
}

function normalizeSearchText(value: string): string {
  return value.normalize('NFC').toLocaleLowerCase('vi');
}

function unavailableResponse(query: string): DocumentPageSearchResponseDto {
  return {
    available: false,
    query,
    results: [],
    totalMatches: 0,
    totalPagesWithMatches: 0,
    truncated: false
  };
}
