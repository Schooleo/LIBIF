import { StatusBadge } from '../../ui/indicators/StatusBadge';

const DOCUMENT_STATUS_KEYS: Record<string, string> = {
  DRAFT: 'draft',
  PENDING_PROCESSING: 'pending_processing',
  PROCESSING: 'processing',
  PENDING_APPROVAL: 'pending_approval',
  CORRECTION_REQUIRED: 'correction_requested',
  PUBLISHED: 'published',
  REJECTED: 'rejected'
};

export function DocumentStatusBadge({ status }: { status?: string | null }) {
  if (!status) {
    return <StatusBadge status="idle" label="Unknown" />;
  }

  return <StatusBadge status={DOCUMENT_STATUS_KEYS[status.toUpperCase()] ?? status.toLowerCase()} />;
}
