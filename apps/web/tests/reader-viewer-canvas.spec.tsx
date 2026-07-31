import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProtectedDocumentViewer } from '../components/domain/reader';
import * as apiBrowser from '../lib/api-browser';

vi.mock('../lib/api-browser', () => ({
  fetchDocumentManifest: vi.fn(),
  fetchProtectedPageUrl: vi.fn(),
  fetchReaderDocumentState: vi.fn(),
  addBookmark: vi.fn().mockResolvedValue({ success: true }),
  removeBookmark: vi.fn().mockResolvedValue({ success: true }),
  updateReadingProgress: vi.fn().mockImplementation(async (_documentId: string, page: number, totalPages: number) => ({
    currentPage: page,
    totalPages,
    percentage: Math.round((page / totalPages) * 100),
    lastReadAt: new Date('2026-07-23T00:00:00.000Z').toISOString(),
  })),
}));

describe('ProtectedDocumentViewer canvas integration', () => {
  const drawImage = vi.fn();
  const clearRect = vi.fn();
  const originalImage = global.Image;
  const originalCreateObjectUrl = URL.createObjectURL;
  const originalRevokeObjectUrl = URL.revokeObjectURL;

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: vi.fn(() => ({ clearRect, drawImage })),
    });

    class MockImage {
      onload: null | (() => void) = null;
      onerror: null | (() => void) = null;
      naturalWidth = 800;
      naturalHeight = 1000;
      width = 800;
      height = 1000;

      set src(_value: string) {
        queueMicrotask(() => this.onload?.());
      }
    }

    // @ts-expect-error test shim
    global.Image = MockImage;
    URL.createObjectURL = vi.fn(() => 'blob:http://localhost/mock-blob');
    URL.revokeObjectURL = vi.fn();

    vi.mocked(apiBrowser.fetchDocumentManifest).mockResolvedValue({
      documentId: 'doc-1',
      pageCount: 5,
      minZoom: 0.5,
      maxZoom: 2,
      pages: Array.from({ length: 5 }, (_, i) => ({ pageNumber: i + 1, width: 800, height: 1000 })),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    global.Image = originalImage;
    URL.createObjectURL = originalCreateObjectUrl;
    URL.revokeObjectURL = originalRevokeObjectUrl;
  });

  it('renders canvas element and no iframe, embed, object, or download PDF button', async () => {
    vi.mocked(apiBrowser.fetchProtectedPageUrl).mockResolvedValue('blob:http://localhost/fake-image-blob');

    render(<ProtectedDocumentViewer documentId="doc-1" title="Sample Clean Architecture" />);

    await waitFor(() => {
      expect(screen.getByRole('img', { name: /Page 1 of 5/i })).toBeInTheDocument();
    });

    const canvasEl = screen.getByRole('img', { name: /Page 1 of 5/i });
    expect(canvasEl.tagName.toLowerCase()).toBe('canvas');
    expect(document.querySelector('iframe')).toBeNull();
    expect(document.querySelector('embed')).toBeNull();
    expect(document.querySelector('object')).toBeNull();
    expect(screen.queryByText(/Download PDF/i)).toBeNull();
    expect(screen.getByText(/Pages are individually server-watermarked with session & traceable identifiers/i)).toBeInTheDocument();
  });

  it('retries the same page after a failure and disables retry during 429 countdown', async () => {
    vi.mocked(apiBrowser.fetchProtectedPageUrl)
      .mockRejectedValueOnce(new Error('Failed to load page 1'))
      .mockResolvedValueOnce('blob:http://localhost/page-1');

    render(<ProtectedDocumentViewer documentId="doc-1" title="Retry doc" />);

    const retryButton = await screen.findByRole('button', { name: /Retry Loading Page 1/i });
    expect(apiBrowser.fetchProtectedPageUrl).toHaveBeenCalledTimes(1);
    expect(apiBrowser.updateReadingProgress).not.toHaveBeenCalled();

    await userEvent.click(retryButton);

    await waitFor(() => {
      expect(apiBrowser.fetchProtectedPageUrl).toHaveBeenCalledTimes(2);
      expect(apiBrowser.fetchProtectedPageUrl).toHaveBeenNthCalledWith(2, 'doc-1', 1);
    });
  });

  it('shows countdown and keeps retry disabled while the rate limit window is active', async () => {
    const rateError = Object.assign(new Error('Rate limited'), { statusCode: 429, retryAfterSeconds: 1 });
    vi.mocked(apiBrowser.fetchProtectedPageUrl).mockRejectedValue(rateError);

    render(<ProtectedDocumentViewer documentId="doc-1" title="Rate limited doc" />);

    const retryButton = await screen.findByRole('button', { name: /Retry Loading Page 1/i });
    expect(retryButton).toBeDisabled();
    expect(screen.getByText(/Please wait/i)).toHaveTextContent('1s');

    await waitFor(() => expect(retryButton).toBeEnabled(), { timeout: 2000 });
  });

  it('hydrates the initial page, clamps it to manifest totals, and persists keyboard navigation with manifest pageCount', async () => {
    vi.mocked(apiBrowser.fetchProtectedPageUrl).mockResolvedValue('blob:http://localhost/page');

    render(<ProtectedDocumentViewer documentId="doc-1" title="Keyboard doc" initialPage={99} />);

    await waitFor(() => {
      expect(screen.getByRole('img', { name: /Page 5 of 5/i })).toBeInTheDocument();
    });

    expect(apiBrowser.updateReadingProgress).not.toHaveBeenCalled();

    fireEvent.keyDown(window, { key: 'Home' });
    await waitFor(() => {
      expect(screen.getByRole('img', { name: /Page 1 of 5/i })).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(apiBrowser.updateReadingProgress).toHaveBeenCalledWith('doc-1', 1, 5);
    });
    expect(apiBrowser.updateReadingProgress).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'PageDown' });
    await waitFor(() => {
      expect(screen.getByRole('img', { name: /Page 2 of 5/i })).toBeInTheDocument();
      expect(apiBrowser.updateReadingProgress).toHaveBeenLastCalledWith('doc-1', 2, 5);
    });
  });

  it('uses the canvas viewer for staff review without creating reader progress or bookmarks', async () => {
    vi.mocked(apiBrowser.fetchProtectedPageUrl).mockResolvedValue('blob:http://localhost/review-page');

    render(<ProtectedDocumentViewer documentId="review-doc" title="Review document" mode="review" />);

    await waitFor(() => {
      expect(screen.getByRole('img', { name: /Page 1 of 5/i })).toBeInTheDocument();
    });

    expect(screen.getByText('Review Canvas Viewer')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /bookmark/i })).not.toBeInTheDocument();
    expect(screen.getByText(/Navigation is not saved as reader progress/i)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'PageDown' });
    await waitFor(() => {
      expect(screen.getByRole('img', { name: /Page 2 of 5/i })).toBeInTheDocument();
    });
    expect(apiBrowser.updateReadingProgress).not.toHaveBeenCalled();
  });
});
