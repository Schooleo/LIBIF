import { headers } from 'next/headers';
import { PageHeader } from '../../../../components/layout';
import { InlineAlert } from '../../../../components/ui';
import { ProcessingQueue, type ProcessingJob } from '../../../../components/domain/processing/ProcessingQueue';
import { API_BASE_URL } from '../../../../lib/api-client';
import { getDevAuthHeaders } from '../../../../lib/auth/session';

async function fetchProcessingJobs(): Promise<ProcessingJob[]> {
  const incomingHeaders = await headers();
  const cookie = incomingHeaders.get('cookie');
  const devHeaders = getDevAuthHeaders();

  const res = await fetch(`${API_BASE_URL}/api/admin/processing/jobs`, {
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

  return (
    <section className="ui-stack">
      <PageHeader title="Processing Queue" />
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
