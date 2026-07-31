import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UploadLifecyclePanel } from '../components/domain/upload/UploadLifecyclePanel';

const mocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  replaceDocumentFile: vi.fn(),
  submitDocumentProcessing: vi.fn()
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mocks.refresh })
}));

vi.mock('../lib/api-browser', () => ({
  replaceDocumentFile: mocks.replaceDocumentFile,
  submitDocumentProcessing: mocks.submitDocumentProcessing
}));

describe('UploadLifecyclePanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.replaceDocumentFile.mockResolvedValue({ id: 'document-1' });
    mocks.submitDocumentProcessing.mockResolvedValue({ id: 'document-1' });
  });

  it('replaces the active PDF through the API client and refreshes document state', async () => {
    const user = userEvent.setup();
    render(<UploadLifecyclePanel documentId="document-1" />);

    const file = new File(['%PDF-1.4'], 'replacement.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText(/select new pdf file/i), file);
    await user.click(screen.getByRole('button', { name: /confirm replace file/i }));

    await waitFor(() => expect(mocks.replaceDocumentFile).toHaveBeenCalledWith('document-1', file));
    expect(mocks.refresh).toHaveBeenCalledOnce();
    expect(screen.getByText('File successfully replaced with "replacement.pdf".')).toBeInTheDocument();
  });

  it('requeues processing through the API client and refreshes document state', async () => {
    const user = userEvent.setup();
    render(
      <UploadLifecyclePanel
        documentId="document-1"
        activeFile={{
          id: 'file-1',
          originalFilename: 'document.pdf',
          sizeBytes: '8',
          version: 1,
          status: 'ACTIVE',
          createdAt: '2026-07-22T00:00:00.000Z'
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: /re-queue processing/i }));

    await waitFor(() => expect(mocks.submitDocumentProcessing).toHaveBeenCalledWith('document-1'));
    expect(mocks.refresh).toHaveBeenCalledOnce();
    expect(screen.getByText('Processing job queued successfully.')).toBeInTheDocument();
  });
});
