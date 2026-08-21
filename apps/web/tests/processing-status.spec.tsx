import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DocumentStatusBadge } from '../components/domain/processing/DocumentStatusBadge';
import { ProcessingQueue } from '../components/domain/processing/ProcessingQueue';
import { ProcessingQueueTabs } from '../components/domain/processing/ProcessingQueueTabs';
import { ProcessingStatusBadge } from '../components/domain/processing/ProcessingStatusBadge';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() })
}));

const jobs = [
  {
    id: 'job-running',
    bookId: 'book-running',
    bookTitle: 'Currently processing',
    bookStatus: 'PROCESSING',
    type: 'PDF_OCR_PIPELINE',
    status: 'RUNNING',
    stage: 'performing_ocr',
    progressPercent: 50,
    attempts: 1,
    createdAt: '2026-08-07T02:00:00.000Z',
    updatedAt: '2026-08-07T02:00:00.000Z'
  },
  {
    id: 'job-failed',
    bookId: 'book-failed',
    bookTitle: 'Needs attention',
    bookStatus: 'PENDING_PROCESSING',
    type: 'PDF_OCR_PIPELINE',
    status: 'FAILED',
    stage: 'failed',
    progressPercent: 25,
    attempts: 1,
    createdAt: '2026-08-07T01:00:00.000Z',
    updatedAt: '2026-08-07T01:00:00.000Z'
  },
  {
    id: 'job-published',
    bookId: 'book-published',
    bookTitle: 'Already approved',
    bookStatus: 'PUBLISHED',
    type: 'PDF_OCR_PIPELINE',
    status: 'SUCCEEDED',
    stage: 'completed',
    progressPercent: 100,
    attempts: 1,
    createdAt: '2026-08-07T00:00:00.000Z',
    updatedAt: '2026-08-07T00:00:00.000Z'
  }
];

describe('processing and document statuses', () => {
  it('keeps processing completion separate from document approval status', () => {
    render(
      <>
        <ProcessingStatusBadge status="SUCCEEDED" />
        <DocumentStatusBadge status="PENDING_APPROVAL" />
      </>
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Pending approval')).toBeInTheDocument();
    expect(screen.queryByText('Awaiting Approval')).not.toBeInTheDocument();
  });

  it('shows processing and document status in separate queue columns', () => {
    render(<ProcessingQueue jobs={[jobs[2]]} />);

    expect(screen.getByRole('columnheader', { name: 'Processing Status' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Document Status' })).toBeInTheDocument();
    expect(screen.getAllByText('Completed')).not.toHaveLength(0);
    expect(screen.getByText('Published')).toBeInTheDocument();
  });
});

describe('ProcessingQueueTabs', () => {
  it('keeps active and failed work in Queue and terminal jobs in History', async () => {
    const user = userEvent.setup();
    render(<ProcessingQueueTabs jobs={jobs} />);

    expect(screen.getByRole('tab', { name: 'Queue (2)' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Currently processing')).toBeInTheDocument();
    expect(screen.getByText('Needs attention')).toBeInTheDocument();
    expect(screen.queryByText('Already approved')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'History (1)' }));

    expect(screen.getByRole('tab', { name: 'History (1)' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Already approved')).toBeInTheDocument();
    expect(screen.queryByText('Currently processing')).not.toBeInTheDocument();
    expect(screen.queryByText('Needs attention')).not.toBeInTheDocument();
  });
});
