import { headers } from 'next/headers';
import Link from 'next/link';
import { PageHeader } from '../../../../../components/layout';
import { InlineAlert } from '../../../../../components/ui';
import { Card } from '../../../../../components/ui/surfaces/Card';
import { DescriptionList } from '../../../../../components/ui/data/DataTable';
import { ProcessingStatusBadge } from '../../../../../components/domain/processing/ProcessingStatusBadge';
import { ProcessingStageStepper } from '../../../../../components/domain/processing/processing';
import { ProcessingActions } from '../../../../../components/domain/processing/ProcessingActions';
import { JobRetryHistory } from '../../../../../components/domain/processing/JobRetryHistory';
import { getApiBaseUrl } from '../../../../../lib/api-client';
import { getDevAuthHeaders } from '../../../../../lib/auth/session';
import type { ProcessingJob } from '../../../../../components/domain/processing/ProcessingQueue';

interface JobHistoryResponse {
  current: ProcessingJob;
  history: ProcessingJob[];
}

async function fetchProcessingJobHistory(id: string): Promise<JobHistoryResponse> {
  const incomingHeaders = await headers();
  const cookie = incomingHeaders.get('cookie');
  const devHeaders = getDevAuthHeaders();

  const res = await fetch(`${getApiBaseUrl()}/api/admin/processing/jobs/${id}/history`, {
    cache: 'no-store',
    headers: {
      ...devHeaders,
      ...(cookie ? { cookie } : {})
    }
  });

  if (!res.ok) {
    // Fallback to single job fetch if history endpoint fails
    const singleRes = await fetch(`${getApiBaseUrl()}/api/admin/processing/jobs/${id}`, {
      cache: 'no-store',
      headers: {
        ...devHeaders,
        ...(cookie ? { cookie } : {})
      }
    });

    if (!singleRes.ok) {
      throw new Error(`Failed to fetch processing job ${id}: ${singleRes.statusText}`);
    }

    const job: ProcessingJob = await singleRes.json();
    return { current: job, history: [job] };
  }

  return res.json();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProcessingJobDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const jobId = resolvedParams.id;
  let jobData: JobHistoryResponse | undefined;
  let loadError: string | undefined;

  try {
    jobData = await fetchProcessingJobHistory(jobId);
  } catch (error) {
    loadError = (error as Error).message;
  }

  const job = jobData?.current;

  const getStepperStage = (jobObj: ProcessingJob) => {
    if (jobObj.stage) {
      return jobObj.stage.toLowerCase();
    }
    switch (jobObj.status.toUpperCase()) {
      case 'QUEUED':
        return 'validating';
      case 'RUNNING':
        return 'performing_ocr';
      case 'SUCCEEDED':
        return 'indexing';
      default:
        return 'validating';
    }
  };

  return (
    <section className="ui-stack">
      <div className="flex justify-between items-center">
        <PageHeader title={job?.bookTitle ? `Job: ${job.bookTitle}` : `Job Details: ${jobId}`} />
        <Link href="/admin/processing" className="ui-link text-sm">
          &larr; Back to queue
        </Link>
      </div>

      {loadError ? (
        <InlineAlert tone="error">
          Processing job details could not be loaded: {loadError}
        </InlineAlert>
      ) : null}

      {job && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 ui-stack">
            {job.status.toUpperCase() === 'SUCCEEDED' && (
              <InlineAlert
                tone={job.bookStatus === 'PUBLISHED' ? 'success' : 'info'}
                title={job.bookStatus === 'PUBLISHED' ? 'Document Published' : 'Processing Complete'}
              >
                {job.bookStatus === 'PUBLISHED' ? (
                  <div>
                    Document pipeline executed successfully and document has been <strong>Approved & Published</strong> to the catalogue.
                    <div className="mt-2">
                      <Link href={`/catalogue/${job.bookId}`} className="ui-link text-sm font-semibold">
                        View in Public Catalogue &rarr;
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    Document pipeline executed successfully. Succeeded and transformed to <strong>Awaiting Approval</strong> status.
                    <div className="mt-2">
                      <Link href="/admin/approvals" className="ui-link text-sm font-semibold">
                        View in Approvals Queue &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </InlineAlert>
            )}

            <Card>
              <h2 className="text-lg font-semibold mb-4">Job Metadata</h2>
              <DescriptionList
                items={[
                  { term: 'Book Title', description: <strong>{job.bookTitle || 'Untitled'}</strong> },
                  { term: 'Job ID', description: <span className="font-mono">{job.id}</span> },
                  { term: 'Book ID', description: <span className="font-mono">{job.bookId}</span> },
                  { term: 'Pipeline Type', description: job.type },
                  { term: 'Current Stage', description: job.stage || 'N/A' },
                  { term: 'Progress', description: `${job.progressPercent ?? (job.status === 'SUCCEEDED' ? 100 : 0)}%` },
                  { term: 'Created At', description: new Date(job.createdAt).toLocaleString() },
                  { term: 'Updated At', description: new Date(job.updatedAt).toLocaleString() }
                ]}
              />
            </Card>

            {job.status.toUpperCase() !== 'FAILED' && job.status.toUpperCase() !== 'SUCCEEDED' && (
              <Card>
                <h2 className="text-lg font-semibold mb-4">Live Progress</h2>
                <ProcessingStageStepper currentStage={getStepperStage(job)} />
              </Card>
            )}

            {job.status.toUpperCase() === 'FAILED' && job.errorMessage && (
              <InlineAlert tone="error" title="Pipeline Failure Details">
                <p className="font-mono text-sm mt-1 whitespace-pre-wrap">{job.errorMessage}</p>
              </InlineAlert>
            )}

            {jobData?.history && jobData.history.length > 0 && (
              <Card>
                <JobRetryHistory historyJobs={jobData.history} currentJobId={job.id} />
              </Card>
            )}
          </div>

          <div className="ui-stack">
            <Card>
              <h2 className="text-lg font-semibold mb-4">Status & Control</h2>
              <div className="ui-stack gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Current Status:</span>
                  <ProcessingStatusBadge status={job.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Total Attempts:</span>
                  <span className="font-semibold">{job.attempts}</span>
                </div>
                <div className="pt-4 border-t border-neutral-100">
                  <ProcessingActions jobId={job.id} status={job.status} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}
