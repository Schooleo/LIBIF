'use client';

import Link from 'next/link';
import { DataTable, type DataColumn } from '../../ui/data/DataTable';
import { ProcessingStatusBadge } from './ProcessingStatusBadge';
import type { ProcessingJob } from './ProcessingQueue';

interface JobRetryHistoryProps {
  historyJobs: ProcessingJob[];
  currentJobId: string;
}

export function JobRetryHistory({ historyJobs, currentJobId }: JobRetryHistoryProps) {
  const columns: DataColumn<ProcessingJob>[] = [
    {
      key: 'id',
      header: 'Job ID / Attempt',
      render: (job) => (
        <div className="flex flex-col">
          <Link
            href={`/admin/processing/${job.id}`}
            className={`ui-link font-medium ${job.id === currentJobId ? 'font-bold text-emerald-700' : ''}`}
          >
            #{job.id.slice(-8)} {job.id === currentJobId ? '(Current)' : ''}
          </Link>
          <span className="text-xs text-neutral-500">Attempt #{job.attempts}</span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (job) => <ProcessingStatusBadge status={job.status} />
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (job) => <span className="text-sm font-mono">{job.stage || 'N/A'}</span>
    },
    {
      key: 'errorMessage',
      header: 'Reason / Error',
      render: (job) => (
        <span className="text-xs text-neutral-600 truncate max-w-[200px] block">
          {job.errorMessage || job.status}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (job) => <span className="text-xs">{new Date(job.createdAt).toLocaleString()}</span>
    }
  ];

  return (
    <div className="ui-stack gap-2">
      <h3 className="text-md font-semibold text-neutral-800">Job Execution & Retry Lineage</h3>
      <DataTable
        caption="Processing Job History"
        columns={columns}
        items={historyJobs}
        getRowKey={(job) => job.id}
        emptyTitle="No execution history found"
      />
    </div>
  );
}
