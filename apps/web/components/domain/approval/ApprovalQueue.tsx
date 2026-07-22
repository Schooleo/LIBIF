'use client';

import { DataTable, type DataColumn } from '../../ui/data/DataTable';
import { StatusBadge } from '../../ui/indicators/StatusBadge';

export interface ApprovalReviewItem {
  id: string;
  bookId: string;
  bookTitle?: string | null;
  reviewerId?: string | null;
  status: string;
  reason?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApprovalQueueProps {
  items?: ApprovalReviewItem[];
  loading?: boolean;
}

export function ApprovalQueue({ items = [], loading = false }: ApprovalQueueProps) {
  const columns: DataColumn<ApprovalReviewItem>[] = [
    {
      key: 'bookTitle',
      header: 'Document Title',
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-medium text-neutral-900">{item.bookTitle || item.bookId}</span>
          <span className="text-xs text-neutral-500 font-mono">Book ID: {item.bookId}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Review Status',
      render: (_item) => <StatusBadge status="pending_review" label="Awaiting Review" />
    },
    {
      key: 'createdAt',
      header: 'Submitted Date',
      render: (item) => <span className="text-sm">{new Date(item.createdAt).toLocaleString()}</span>
    }
  ];

  return (
    <DataTable
      caption="Pending Approvals"
      columns={columns}
      items={items}
      getRowKey={(item) => item.id}
      loading={loading}
      emptyTitle="No items pending approval"
    />
  );
}
