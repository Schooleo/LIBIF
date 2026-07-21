'use client';

import Link from 'next/link';
import { DataTable, type DataColumn } from '../../ui/data/DataTable';
import { ProcessingStatusBadge } from './ProcessingStatusBadge';
import { ProcessingActions } from './ProcessingActions';

export interface ProcessingJob {
  id: string;
  bookId: string;
  type: string;
  status: string;
  attempts: number;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProcessingQueueProps {
  jobs: ProcessingJob[];
  loading?: boolean;
}

export function ProcessingQueue({ jobs, loading = false }: ProcessingQueueProps) {
  const columns: DataColumn<ProcessingJob>[] = [
    {
      key: 'id',
      header: 'Job ID',
      render: (job) => (
        <Link href={`/admin/processing/${job.id}`} className="ui-link font-medium">
          {job.id}
        </Link>
      )
    },
    {
      key: 'bookId',
      header: 'Book ID',
      render: (job) => <span className="font-mono text-sm">{job.bookId}</span>
    },
    {
      key: 'type',
      header: 'Pipeline Type',
      render: (job) => <span>{job.type}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (job) => <ProcessingStatusBadge status={job.status} />
    },
    {
      key: 'attempts',
      header: 'Attempts',
      render: (job) => <span className="text-center">{job.attempts}</span>
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (job) => <span>{new Date(job.createdAt).toLocaleString()}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (job) => <ProcessingActions jobId={job.id} status={job.status} />
    }
  ];

  return (
    <DataTable
      caption="Processing Jobs Queue"
      columns={columns}
      items={jobs}
      getRowKey={(job) => job.id}
      loading={loading}
      emptyTitle="No processing jobs found"
    />
  );
}
