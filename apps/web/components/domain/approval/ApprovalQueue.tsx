'use client';

import Link from 'next/link';
import { DataTable, type DataColumn } from '../../ui/data/DataTable';
import { StatusBadge } from '../../ui/indicators/StatusBadge';

export interface ApprovalReviewItem {
  id: string;
  bookId: string;
  bookTitle?: string | null;
  round?: number;
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
      header: 'Document Title / Review ID',
      render: (item) => (
        <div className="flex flex-col">
          <Link href={`/admin/approvals/${item.id}`} className="ui-link font-medium">
            {item.bookTitle || item.bookId}
          </Link>
          <span className="text-xs text-neutral-500 font-mono">Review #{item.id.slice(-8)}</span>
        </div>
      )
    },
    {
      key: 'round',
      header: 'Round',
      render: (item) => <span className="font-mono text-sm">Round #{item.round ?? 1}</span>
    },
    {
      key: 'status',
      header: 'Review Status',
      render: (item) => (
        <StatusBadge
          status={item.status.toLowerCase() === 'pending' ? 'pending_review' : item.status.toLowerCase()}
          label={item.status}
        />
      )
    },
    {
      key: 'createdAt',
      header: 'Submitted Date',
      render: (item) => <span className="text-sm">{new Date(item.createdAt).toLocaleString()}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Link href={`/admin/approvals/${item.id}`} className="ui-link text-sm font-semibold">
          Review &rarr;
        </Link>
      )
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
