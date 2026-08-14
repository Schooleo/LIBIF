'use client';

import Link from 'next/link';
import { DataTable, type DataColumn } from '../../ui/data/DataTable';
import { ProgressBar } from '../../ui/indicators/ProgressBar';
import { DocumentStatusBadge } from './DocumentStatusBadge';
import { ProcessingActions } from './ProcessingActions';
import { ProcessingStatusBadge } from './ProcessingStatusBadge';

export interface ProcessingJob {
  id: string;
  bookId: string;
  bookTitle?: string | null;
  bookStatus?: string | null;
  type: string;
  status: string;
  stage?: string | null;
  progressPercent?: number;
  attempts: number;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProcessingQueueProps {
  jobs: ProcessingJob[];
  loading?: boolean;
  caption?: string;
  emptyTitle?: string;
  showActions?: boolean;
}

function formatStageLabel(stage?: string | null, status?: string): string {
  if (!stage) {
    if (status === 'SUCCEEDED') return 'Completed';
    if (status === 'QUEUED') return 'Queued';
    return 'Processing';
  }
  return stage.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export function ProcessingQueue({
  jobs,
  loading = false,
  caption = 'Processing Jobs Queue',
  emptyTitle = 'No processing jobs found',
  showActions = true
}: ProcessingQueueProps) {
  const columns: DataColumn<ProcessingJob>[] = [
    {
      key: 'bookTitle',
      header: 'Book Title / Job ID',
      render: (job) => (
        <div className="flex flex-col">
          <Link href={`/admin/processing/${job.id}`} className="ui-link font-medium">
            {job.bookTitle || job.bookId}
          </Link>
          <span className="text-xs text-neutral-500 font-mono">Job #{job.id.slice(-8)}</span>
        </div>
      )
    },
    {
      key: 'stage',
      header: 'Stage & Progress',
      render: (job) => {
        const stageLabel = formatStageLabel(job.stage, job.status);
        const percent = job.progressPercent ?? (job.status === 'SUCCEEDED' ? 100 : job.status === 'QUEUED' ? 0 : 50);
        return (
          <div className="min-w-[160px]">
            <ProgressBar value={percent} label={stageLabel} />
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Processing Status',
      render: (job) => <ProcessingStatusBadge status={job.status} />
    },
    {
      key: 'bookStatus',
      header: 'Document Status',
      render: (job) => <DocumentStatusBadge status={job.bookStatus} />
    },
    {
      key: 'attempts',
      header: 'Attempts',
      render: (job) => <span className="text-center font-mono text-sm">{job.attempts}</span>
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (job) => <span className="text-sm">{new Date(job.createdAt).toLocaleString()}</span>
    },
    ...(showActions
      ? [{
          key: 'actions',
          header: 'Actions',
          render: (job: ProcessingJob) => <ProcessingActions jobId={job.id} status={job.status} />
        }]
      : [])
  ];

  return (
    <DataTable
      caption={caption}
      columns={columns}
      items={jobs}
      getRowKey={(job) => job.id}
      loading={loading}
      emptyTitle={emptyTitle}
    />
  );
}
