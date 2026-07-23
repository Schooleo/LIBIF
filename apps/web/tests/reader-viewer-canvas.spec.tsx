import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProtectedDocumentViewer } from '../components/domain/reader';
import * as apiBrowser from '../lib/api-browser';

vi.mock('../lib/api-browser', () => ({
  fetchDocumentManifest: vi.fn(),
  fetchProtectedPageUrl: vi.fn(),
  fetchViewToken: vi.fn(),
  fetchDownloadToken: vi.fn(),
  addBookmark: vi.fn().mockResolvedValue({ success: true }),
  removeBookmark: vi.fn().mockResolvedValue({ success: true }),
  updateReadingProgress: vi.fn().mockResolvedValue({ success: true }),
}));

describe('ProtectedDocumentViewer canvas integration', () => {
  it('renders canvas element and no iframe, embed, object, or download PDF button', async () => {
    vi.mocked(apiBrowser.fetchDocumentManifest).mockResolvedValueOnce({
      documentId: 'doc-1',
      pageCount: 5,
      minZoom: 0.5,
      maxZoom: 2.0,
      pages: Array.from({ length: 5 }, (_, i) => ({ pageNumber: i + 1, width: 800, height: 1000 })),
    });

    vi.mocked(apiBrowser.fetchProtectedPageUrl).mockResolvedValue('blob:http://localhost/fake-image-blob');

    render(<ProtectedDocumentViewer documentId="doc-1" title="Sample Clean Architecture" />);

    // Wait for manifest and canvas render
    await waitFor(() => {
      expect(screen.getByRole('img', { name: /Page 1 of 5/i })).toBeInTheDocument();
    });

    // Assert canvas is in the DOM
    const canvasEl = screen.getByRole('img', { name: /Page 1 of 5/i });
    expect(canvasEl.tagName.toLowerCase()).toBe('canvas');

    // Assert NO iframe, embed, object, or raw download button
    expect(document.querySelector('iframe')).toBeNull();
    expect(document.querySelector('embed')).toBeNull();
    expect(document.querySelector('object')).toBeNull();
    expect(screen.queryByText(/Download PDF/i)).toBeNull();

    // Assert truthful protection notice is displayed
    expect(
      screen.getByText(/Pages are individually server-watermarked with session & traceable identifiers/i),
    ).toBeInTheDocument();
  });
});
