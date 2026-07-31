import { headers } from 'next/headers';
import { PageHeader } from '../../../../components/layout';
import { InlineAlert } from '../../../../components/ui';
import { ProcessingQueue, type ProcessingJob } from '../../../../components/domain/processing/ProcessingQueue';
import { getApiBaseUrl } from '../../../../lib/api-client';
import { getDevAuthHeaders } from '../../../../lib/auth/session';

async function fetchProcessingJobs(): Promise<ProcessingJob[]> {
  const incomingHeaders = await headers();
  const cookie = incomingHeaders.get('cookie');
  const devHeaders = getDevAuthHeaders();

  const res = await fetch(`${getApiBaseUrl()}/api/admin/processing/jobs`, {
    cache: 'no-store',
    headers: {
      ...devHeaders,
      ...(cookie ? { cookie } : {})
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch processing jobs: ${res.statusText}`);
  }

  return res.json();
}

export default async function AdminProcessingPage() {
  let jobs: ProcessingJob[] = [];
  let loadError: string | undefined;

  try {
    jobs = await fetchProcessingJobs();
  } catch (error) {
    loadError = (error as Error).message;
  }

  const activeCount = jobs.filter((j) => j.status === 'QUEUED' || j.status === 'RUNNING').length;

  return (
    <section className="ui-stack">
      <div className="flex justify-between items-center">
        <PageHeader title="Processing Queue" />
        {!loadError && (
          <span className="text-sm font-semibold text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
            Active Jobs ({activeCount})
          </span>
        )}
      </div>

      {loadError ? (
        <InlineAlert tone="error">
          Processing jobs could not be loaded: {loadError}
        </InlineAlert>
      ) : null}
      {!loadError && (
        <section className="ui-stack" aria-label="Processing jobs">
          <ProcessingQueue jobs={jobs} />
        </section>
      )}
    </section>
  );
}
