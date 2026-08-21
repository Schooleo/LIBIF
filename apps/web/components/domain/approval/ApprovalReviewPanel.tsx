'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ConfirmationDialog, Dialog, FormField, InlineAlert, TextInput } from '../../ui';
import { API_BASE_URL } from '../../../lib/api-client';
import { getDevAuthHeaders } from '../../../lib/auth/session';

interface ApprovalReviewPanelProps {
  reviewId: string;
  bookId: string;
  bookTitle?: string | null;
  status: string;
}

export function ApprovalReviewPanel({ reviewId, bookId: _bookId, bookTitle, status }: ApprovalReviewPanelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [activeModal, setActiveModal] = useState<'approve-and-publish' | 'reject' | 'correction' | null>(null);
  const [reason, setReason] = useState('');
  const [requestedChanges, setRequestedChanges] = useState('');

  const isPending = status.toUpperCase() === 'PENDING';

  const closeModal = () => {
    setActiveModal(null);
    setReason('');
    setRequestedChanges('');
    setError(null);
  };

  const executeAction = async (endpoint: string, bodyPayload?: any) => {
    setLoading(true);
    setError(null);
    try {
      const devHeaders = getDevAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/admin/approvals/${reviewId}/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...devHeaders,
          'Content-Type': 'application/json'
        },
        body: bodyPayload ? JSON.stringify(bodyPayload) : undefined
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to execute ${endpoint}`);
      }

      closeModal();
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!isPending) {
    return (
      <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
        <p className="text-sm font-medium text-neutral-700">
          This review is closed with status: <span className="font-semibold">{status}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="ui-stack gap-4">
      {error && <InlineAlert tone="error">{error}</InlineAlert>}

      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          disabled={loading}
          onClick={() => setActiveModal('approve-and-publish')}
        >
          {loading ? 'Processing...' : 'Approve & Publish'}
        </Button>

        <Button
          variant="secondary"
          disabled={loading}
          onClick={() => setActiveModal('correction')}
        >
          Request Correction
        </Button>

        <Button
          variant="ghost"
          disabled={loading}
          onClick={() => setActiveModal('reject')}
        >
          Reject
        </Button>
      </div>

      {/* Approve & Publish Confirmation Modal */}
      <ConfirmationDialog
        open={activeModal === 'approve-and-publish'}
        onClose={closeModal}
        title="Approve and Publish to Catalogue"
        showCloseButton={false}
      >
        <div className="ui-stack gap-3">
          <InlineAlert tone="warning">
            This action will immediately publish <strong>«{bookTitle || 'this document'}»</strong> to the public reader catalogue. Readers will gain reading access.
          </InlineAlert>
          <p className="text-sm text-neutral-600">
            Please confirm that document quality, metadata, and licensing are verified before proceeding.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="button"
              disabled={loading}
              onClick={() => executeAction('approve-and-publish', { comment: 'Approved & Published' })}
            >
              {loading ? 'Publishing...' : 'Confirm Approve & Publish'}
            </Button>
          </div>
        </div>
      </ConfirmationDialog>

      {/* Reject Modal */}
      <Dialog
        open={activeModal === 'reject'}
        onClose={closeModal}
        title="Reject Document"
        showCloseButton={false}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeAction('reject', { reason });
          }}
          className="ui-stack gap-4"
        >
          <p className="text-sm text-neutral-600">
            Please provide a clear reason for rejecting <strong>«{bookTitle || 'this document'}»</strong>.
          </p>
          <FormField label="Reason for Rejection" required>
            {(fieldProps) => (
              <TextInput
                {...fieldProps}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Low scan quality / Invalid copyright"
                required
              />
            )}
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading || !reason.trim()}>
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Request Correction Modal */}
      <Dialog
        open={activeModal === 'correction'}
        onClose={closeModal}
        title="Request Metadata or File Correction"
        showCloseButton={false}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeAction('request-correction', { reason, requestedChanges });
          }}
          className="ui-stack gap-4"
        >
          <p className="text-sm text-neutral-600">
            Specify the reason and detailed changes needed for <strong>«{bookTitle || 'this document'}»</strong> from the uploader.
          </p>
          <FormField label="Reason for Correction Request" required>
            {(fieldProps) => (
              <TextInput
                {...fieldProps}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Missing ISBN / Incorrect category"
                required
              />
            )}
          </FormField>
          <FormField label="Requested Changes" required>
            {(fieldProps) => (
              <textarea
                {...fieldProps}
                className="ui-input min-h-[80px] w-full p-2 border border-neutral-300 rounded-md text-sm"
                value={requestedChanges}
                onChange={(e) => setRequestedChanges(e.target.value)}
                placeholder="e.g. Please update category to Computer Science and add ISBN."
                required
              />
            )}
          </FormField>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading || !reason.trim() || !requestedChanges.trim()}>
              Send Correction Request
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
