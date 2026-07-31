import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CatalogueDetailPage from '../app/(reader)/catalogue/[id]/page';
import * as apiServer from '../lib/api-server';

vi.mock('../lib/api-server', () => ({
  fetchAccessDecision: vi.fn(),
  fetchPublicBookDetail: vi.fn(),
  fetchReaderDocumentState: vi.fn(),
}));

vi.mock('../components/domain/reader', () => ({
  BookmarkButton: ({ documentId, initialBookmarked }: { documentId: string; initialBookmarked: boolean }) => (
    <span data-testid="bookmark-state">
      {documentId}:{initialBookmarked ? 'saved' : 'not-saved'}
    </span>
  ),
}));

describe('Catalogue detail Reader integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiServer.fetchAccessDecision).mockResolvedValue({
      allowed: true,
      reason: 'Document is published and available for reading.',
      documentStatus: 'PUBLISHED',
    });
    vi.mocked(apiServer.fetchPublicBookDetail).mockResolvedValue({
      id: 'doc-1',
      title: 'Protected Sample',
      subtitle: null,
      description: null,
      isbn: '9780000000001',
      publisher: null,
      publishedYear: null,
      language: 'vi',
      status: 'PUBLISHED',
      category: null,
      authors: [],
      tags: [],
      createdAt: '2026-07-24T00:00:00.000Z',
    });
    vi.mocked(apiServer.fetchReaderDocumentState).mockResolvedValue({
      documentId: 'doc-1',
      bookmarked: true,
      progress: null,
    });
  });

  it('loads direct published detail and hydrates the existing bookmark before opening the canvas viewer', async () => {
    render(await CatalogueDetailPage({ params: Promise.resolve({ id: 'doc-1' }) }));

    expect(apiServer.fetchPublicBookDetail).toHaveBeenCalledWith('doc-1');
    expect(apiServer.fetchReaderDocumentState).toHaveBeenCalledWith('doc-1');
    expect(screen.getByRole('heading', { level: 1, name: 'Protected Sample' })).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-state')).toHaveTextContent('doc-1:saved');
    expect(screen.getByRole('link', { name: /Open Reader Viewer/i })).toHaveAttribute(
      'href',
      '/documents/doc-1/view',
    );
  });
});
