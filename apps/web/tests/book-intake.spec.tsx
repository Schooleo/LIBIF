import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BookIntakeForm } from '../components/book-intake/BookIntakeForm';

vi.mock('../lib/api', () => ({
  lookupIsbn: vi.fn(async () => ({ found: true, metadata: { title: 'Clean Code', authors: ['Robert C. Martin'], publisher: 'Prentice Hall', publishedYear: 2008 } })),
  uploadBookIntake: vi.fn(async (_file, _metadata, onProgress) => {
    onProgress(45);
    onProgress(100);
    return { book: { id: 'book-1', title: 'Clean Code', status: 'PENDING_PROCESSING' }, file: { id: 'file-1', originalFilename: 'book.pdf', sizeBytes: '12' }, processingJob: { id: 'job-1', status: 'QUEUED' } };
  })
}));

describe('BookIntakeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requires file, title, and author before submit', () => {
    render(<BookIntakeForm categories={[]} />);
    expect(screen.getByRole('button', { name: /create digital book intake/i })).toBeDisabled();
  });

  it('uploads a valid intake and renders queued status', async () => {
    const user = userEvent.setup();
    render(<BookIntakeForm categories={[{ id: 'cat-1', name: 'Giáo trình', slug: 'giao-trinh' }]} />);

    const file = new File(['%PDF-1.4'], 'book.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText(/pdf file/i), file);
    await user.type(screen.getByLabelText(/title/i), 'Clean Code');
    await user.type(screen.getByLabelText(/authors/i), 'Robert C. Martin');
    await user.click(screen.getByRole('button', { name: /create digital book intake/i }));

    await waitFor(() => expect(screen.getByText(/book intake queued/i)).toBeInTheDocument());
    expect(screen.getByText(/Status: PENDING_PROCESSING/)).toBeInTheDocument();
    expect(screen.getByText(/job-1/)).toBeInTheDocument();
  });
});
