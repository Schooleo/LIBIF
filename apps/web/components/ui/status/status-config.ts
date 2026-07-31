import type { Tone } from '../types';

export type StatusKey =
  | 'draft'
  | 'pending_processing'
  | 'processing'
  | 'pending_approval'
  | 'published'
  | 'rejected'
  | 'correction_requested'
  | 'archived'
  | 'idle'
  | 'validating'
  | 'uploading'
  | 'accepted'
  | 'validation_failed'
  | 'failed'
  | 'cancelled'
  | 'queued'
  | 'compressing'
  | 'performing_ocr'
  | 'indexing'
  | 'retrying'
  | 'completed'
  | 'pending_review'
  | 'approved'
  | 'approved_and_published'
  | 'correction_in_progress'
  | 'resubmitted'
  | 'running'
  | 'expired'
  | 'editable'
  | 'delete_blocked'
  | 'reassignment_required'
  | 'deleting'
  | 'deleted'
  | 'active'
  | 'duplicate_candidate'
  | 'merge_preview'
  | 'merging'
  | 'merged'
  | 'invited'
  | 'suspended'
  | 'deactivated'
  | 'unread'
  | 'read'
  | 'action_required'
  | 'action_completed'
  | 'stale';

type StatusConfig = { label: string; tone: Tone; marker: string };

export const statusConfig: Record<StatusKey, StatusConfig> = {
  draft: { label: 'Draft', tone: 'neutral', marker: '○' },
  pending_processing: { label: 'Pending processing', tone: 'info', marker: '◌' },
  processing: { label: 'Processing', tone: 'info', marker: '●' },
  pending_approval: { label: 'Pending approval', tone: 'warning', marker: '◌' },
  published: { label: 'Published', tone: 'success', marker: '●' },
  rejected: { label: 'Rejected', tone: 'error', marker: '●' },
  correction_requested: { label: 'Correction requested', tone: 'warning', marker: '◐' },
  archived: { label: 'Archived', tone: 'neutral', marker: '◌' },

  idle: { label: 'Idle', tone: 'neutral', marker: '○' },
  validating: { label: 'Validating', tone: 'info', marker: '●' },
  uploading: { label: 'Uploading', tone: 'info', marker: '●' },
  accepted: { label: 'Accepted', tone: 'success', marker: '●' },
  validation_failed: { label: 'Validation failed', tone: 'error', marker: '●' },
  failed: { label: 'Failed', tone: 'error', marker: '●' },
  cancelled: { label: 'Cancelled', tone: 'neutral', marker: '◌' },

  queued: { label: 'Queued', tone: 'neutral', marker: '○' },
  compressing: { label: 'Compressing', tone: 'info', marker: '●' },
  performing_ocr: { label: 'Performing OCR', tone: 'info', marker: '●' },
  indexing: { label: 'Indexing', tone: 'info', marker: '●' },
  retrying: { label: 'Retrying', tone: 'warning', marker: '◐' },
  completed: { label: 'Completed', tone: 'success', marker: '●' },

  pending_review: { label: 'Pending review', tone: 'warning', marker: '◌' },
  approved: { label: 'Approved', tone: 'success', marker: '●' },
  approved_and_published: { label: 'Approved and published', tone: 'success', marker: '●' },
  correction_in_progress: { label: 'Correction in progress', tone: 'info', marker: '◐' },
  resubmitted: { label: 'Resubmitted', tone: 'info', marker: '●' },

  running: { label: 'Running', tone: 'info', marker: '●' },
  expired: { label: 'Expired', tone: 'warning', marker: '◐' },

  editable: { label: 'Editable', tone: 'success', marker: '●' },
  delete_blocked: { label: 'Delete blocked', tone: 'warning', marker: '◐' },
  reassignment_required: { label: 'Reassignment required', tone: 'warning', marker: '◐' },
  deleting: { label: 'Deleting', tone: 'info', marker: '●' },
  deleted: { label: 'Deleted', tone: 'neutral', marker: '◌' },

  active: { label: 'Active', tone: 'success', marker: '●' },
  duplicate_candidate: { label: 'Duplicate candidate', tone: 'warning', marker: '◐' },
  merge_preview: { label: 'Merge preview', tone: 'info', marker: '◌' },
  merging: { label: 'Merging', tone: 'info', marker: '●' },
  merged: { label: 'Merged', tone: 'success', marker: '●' },

  invited: { label: 'Invited', tone: 'info', marker: '○' },
  suspended: { label: 'Suspended', tone: 'warning', marker: '◐' },
  deactivated: { label: 'Deactivated', tone: 'error', marker: '●' },

  unread: { label: 'Unread', tone: 'info', marker: '●' },
  read: { label: 'Read', tone: 'neutral', marker: '○' },
  action_required: { label: 'Action required', tone: 'warning', marker: '◐' },
  action_completed: { label: 'Action completed', tone: 'success', marker: '●' },
  stale: { label: 'Stale', tone: 'warning', marker: '◐' }
};
