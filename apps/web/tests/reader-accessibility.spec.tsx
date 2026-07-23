import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BookmarkButton, ProtectedDocumentViewer } from '../components/domain/reader';
import * as apiBrowser from '../lib/api-browser';

vi.mock('../lib/api-browser', () => ({
  fetchDocumentManifest: vi.fn(),
  fetchProtectedPageUrl: vi.fn(),
  fetchViewToken: vi.fn(),
  fetchDownloadToken: vi.fn(),
  fetchReaderDocumentState: vi.fn(),
  addBookmark: vi.fn().mockResolvedValue({ success: true }),
  removeBookmark: vi.fn().mockResolvedValue({ success: true }),
  updateReadingProgress: vi.fn().mockResolvedValue({ currentPage: 1, totalPages: 5, percentage: 20 }),
}));

describe('Reader Accessibility & Truthful Language (A7-005)', () => {
  const originalImage = global.Image;
  const originalCreateObjectUrl = URL.createObjectURL;
  const originalRevokeObjectUrl = URL.revokeObjectURL;

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: vi.fn(() => ({ clearRect: vi.fn(), drawImage: vi.fn() })),
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
      documentId: 'doc-a7-005',
      pageCount: 5,
      minZoom: 0.5,
      maxZoom: 2,
      pages: Array.from({ length: 5 }, (_, i) => ({ pageNumber: i + 1, width: 800, height: 1000 })),
    });
    vi.mocked(apiBrowser.fetchProtectedPageUrl).mockResolvedValue('blob:http://localhost/mock-blob');
  });

  afterEach(() => {
    global.Image = originalImage;
    URL.createObjectURL = originalCreateObjectUrl;
    URL.revokeObjectURL = originalRevokeObjectUrl;
  });

  it('has no automated axe accessibility violations in ProtectedDocumentViewer', async () => {
    const { container } = render(
      <ProtectedDocumentViewer documentId="doc-a7-005" title="Accessibility Test Document" />,
    );

    await waitFor(() => {
      expect(screen.getByRole('img', { name: /Page 1 of 5/i })).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no automated axe violations in BookmarkButton standalone', async () => {
    const { container } = render(<BookmarkButton documentId="doc-a7-005" initialBookmarked={false} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('displays truthful copy deterrence language without false DRM claims', async () => {
    render(<ProtectedDocumentViewer documentId="doc-a7-005" title="Truthful Copy Document" />);

    await waitFor(() => {
      expect(screen.getByRole('img', { name: /Page 1 of 5/i })).toBeInTheDocument();
    });

    const text = document.body.textContent ?? '';

    // Verify truthful copy deterrence phrasing exists
    expect(screen.getByText(/controlled page delivery and copy deterrence/i)).toBeInTheDocument();

    // Verify false security claims are NOT made anywhere in rendered DOM
    expect(text.toLowerCase()).not.toContain('absolute drm');
    expect(text.toLowerCase()).not.toContain('screenshot prevention');
    expect(text.toLowerCase()).not.toContain('unbreakable protection');
  });

  it('displays inline error when bookmark toggle fails', async () => {
    vi.mocked(apiBrowser.addBookmark).mockRejectedValueOnce(new Error('Network error'));

    render(<BookmarkButton documentId="doc-a7-005" initialBookmarked={false} />);

    const button = screen.getByRole('button', { name: /Bookmark this document/i });
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Failed to update bookmark/i)).toBeInTheDocument();
    });
  });

  it('includes focusable canvas with keyboard focus indicator class and right-click handler', async () => {
    render(<ProtectedDocumentViewer documentId="doc-a7-005" title="Interactive Canvas Document" />);

    await waitFor(() => {
      expect(screen.getByRole('img', { name: /Page 1 of 5/i })).toBeInTheDocument();
    });

    const canvas = screen.getByRole('img', { name: /Page 1 of 5/i });
    expect(canvas).toHaveAttribute('tabIndex', '0');
    expect(canvas).toHaveClass('reader-canvas');

    // Right click should be prevented
    const contextMenuEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    const prevented = !canvas.dispatchEvent(contextMenuEvent);
    expect(prevented).toBe(true);
  });
});
