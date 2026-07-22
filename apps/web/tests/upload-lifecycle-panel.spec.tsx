import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UploadLifecyclePanel } from '../components/domain/upload/UploadLifecyclePanel';

const mocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  replaceDocumentFile: vi.fn()
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mocks.refresh })
}));

vi.mock('../lib/api-browser', () => ({
  replaceDocumentFile: mocks.replaceDocumentFile
}));

describe('UploadLifecyclePanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.replaceDocumentFile.mockResolvedValue({ id: 'document-1' });
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
});
