import type { LibrarianDashboardSummaryDto } from '../../../../lib/api-types';
import { DashboardMetrics } from '../../../../components/domain/reporting';
import { PageHeader } from '../../../../components/layout';
import { InlineAlert } from '../../../../components/ui';
import { fetchLibrarianDashboardSummary } from '../../../../lib/api-server';

export default async function AdminDashboardPage() {
  let summary: LibrarianDashboardSummaryDto | undefined;
  let loadError: string | undefined;
  try {
    summary = await fetchLibrarianDashboardSummary();
  } catch (error) {
    loadError = (error as Error).message;
  }

  return (
    <section className="ui-stack">
      <PageHeader title="Admin Dashboard" description="Operational counts for digital intakes, processing jobs, taxonomy, and users." />
      {loadError ? <InlineAlert tone="error">Dashboard summary could not be loaded: {loadError}</InlineAlert> : null}
      {summary ? <DashboardMetrics summary={summary} /> : null}
    </section>
  );
}
