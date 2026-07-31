import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ApprovalReviewPanel } from '../components/domain/approval/ApprovalReviewPanel';

const refreshMock = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: refreshMock
  })
}));

describe('ApprovalReviewPanel confirmation dialogs', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    refreshMock.mockClear();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders closed notice when review status is not PENDING', () => {
    render(
      <ApprovalReviewPanel
        reviewId="rev-1"
        bookId="book-1"
        bookTitle="Designing Data-Intensive Applications"
        status="APPROVED"
      />
    );

    expect(screen.getByText(/closed with status:/i)).toBeInTheDocument();
    expect(screen.getByText('APPROVED')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /approve & publish/i })).not.toBeInTheDocument();
  });

  it('opens confirmation dialog on "Approve & Publish" click instead of immediate API call', async () => {
    const user = userEvent.setup();
    render(
      <ApprovalReviewPanel
        reviewId="rev-1"
        bookId="book-1"
        bookTitle="Clean Architecture"
        status="PENDING"
      />
    );

    const approveBtn = screen.getByRole('button', { name: /approve & publish/i });
    await user.click(approveBtn);

    // Dialog should open
    const dialog = screen.getByRole('dialog', { name: /approve and publish to catalogue/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/Clean Architecture/i)).toBeInTheDocument();

    // API should not have been called yet
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('closes confirmation dialog on Escape without executing action', async () => {
    const user = userEvent.setup();
    render(
      <ApprovalReviewPanel
        reviewId="rev-1"
        bookId="book-1"
        bookTitle="Refactoring"
        status="PENDING"
      />
    );

    await user.click(screen.getByRole('button', { name: /approve & publish/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('executes approve-and-publish action on confirmation', async () => {
    const user = userEvent.setup();
    render(
      <ApprovalReviewPanel
        reviewId="rev-100"
        bookId="book-100"
        bookTitle="Domain-Driven Design"
        status="PENDING"
      />
    );

    await user.click(screen.getByRole('button', { name: /approve & publish/i }));

    const confirmBtn = screen.getByRole('button', { name: 'Confirm Approve & Publish' });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/approvals/rev-100/approve-and-publish'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
    expect(refreshMock).toHaveBeenCalled();
  });

  it('passes accessibility checks on open confirmation dialog', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ApprovalReviewPanel
        reviewId="rev-1"
        bookId="book-1"
        bookTitle="Structure and Interpretation of Computer Programs"
        status="PENDING"
      />
    );

    await user.click(screen.getByRole('button', { name: /approve & publish/i }));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
