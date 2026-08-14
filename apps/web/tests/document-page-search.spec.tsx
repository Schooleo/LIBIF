import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DocumentPageSearch } from '../components/domain/reader/DocumentPageSearch';

describe('DocumentPageSearch', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('shows at most five approval results and jumps with Before and Next', async () => {
    const user = userEvent.setup();
    const onPageSelect = vi.fn();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        available: true,
        query: 'architecture',
        results: [
          { pageNumber: 2, matchCount: 1, snippet: 'First architecture result' },
          { pageNumber: 5, matchCount: 2, snippet: 'Second architecture result' },
          { pageNumber: 8, matchCount: 1, snippet: 'Third architecture result' },
          { pageNumber: 13, matchCount: 1, snippet: 'Fourth architecture result' },
          { pageNumber: 21, matchCount: 1, snippet: 'Fifth architecture result' }
        ],
        totalMatches: 6,
        totalPagesWithMatches: 5,
        truncated: false
      })
    });

    render(
      <DocumentPageSearch
        documentId="book-1"
        showResultDetails
        onPageSelect={onPageSelect}
      />
    );

    await user.type(screen.getByRole('searchbox', { name: /search document text/i }), 'architecture');
    await user.click(screen.getByRole('button', { name: /^search$/i }));

    await waitFor(() => expect(screen.getAllByRole('button', { name: /page \d+/i })).toHaveLength(5));
    expect(onPageSelect).toHaveBeenLastCalledWith(2);

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPageSelect).toHaveBeenLastCalledWith(5);

    await user.click(screen.getByRole('button', { name: 'Before' }));
    expect(onPageSelect).toHaveBeenLastCalledWith(2);
    expect(screen.getByText('First architecture result')).toBeInTheDocument();
  });

  it('keeps snippets hidden in Reader mode while retaining result navigation', async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        available: true,
        query: 'keyword',
        results: [{ pageNumber: 3, matchCount: 1 }],
        totalMatches: 1,
        totalPagesWithMatches: 1,
        truncated: false
      })
    });

    render(<DocumentPageSearch documentId="book-1" onPageSelect={vi.fn()} />);
    await user.type(screen.getByRole('searchbox', { name: /search document text/i }), 'keyword');
    await user.click(screen.getByRole('button', { name: /^search$/i }));

    await waitFor(() => expect(screen.getByText(/result 1 of 1.*page 3/i)).toBeInTheDocument());
    expect(screen.queryByRole('list', { name: /document search results/i })).not.toBeInTheDocument();
  });
});
