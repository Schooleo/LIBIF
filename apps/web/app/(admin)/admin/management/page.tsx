import { PageHeader } from '../../../../components/layout';
import { ManagementReporting } from '../../../../components/domain/reporting';
import { InlineAlert } from '../../../../components/ui';
import { API_BASE_URL } from '../../../../lib/api-client';
import { fetchManagementDashboardSummary, fetchReaderAccessReport } from '../../../../lib/api-server';
import type { ReaderAccessReportQuery } from '../../../../lib/api-types';
import { requireAdmin } from '../../../../lib/auth/require-admin';

type ManagementPageProps = {
  searchParams: Promise<{
    from?: string;
    to?: string;
    risk?: string;
    page?: string;
  }>;
};

export default async function AdminManagementPage({ searchParams }: ManagementPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const query: ReaderAccessReportQuery = {
    from: params.from,
    to: params.to,
    risk: asRisk(params.risk),
    page: positiveInteger(params.page, 1),
    pageSize: 50,
  };
  const [summary, report] = await Promise.allSettled([
    fetchManagementDashboardSummary({ from: query.from, to: query.to }),
    fetchReaderAccessReport(query),
  ]);

  return (
    <section className="ui-stack">
      <PageHeader title="Management & Reporting" description="Admin-only UTC operations metrics, Reader security review, and bounded formula-safe CSV exports." />
      {summary.status === 'rejected' || report.status === 'rejected' ? (
        <InlineAlert tone="error">
          Management reporting could not be loaded:{' '}
          {summary.status === 'rejected' ? errorMessage(summary.reason) : errorMessage(report.status === 'rejected' ? report.reason : undefined)}
        </InlineAlert>
      ) : (
        <ManagementReporting summary={summary.value} report={report.value} query={query} apiBaseUrl={API_BASE_URL} />
      )}
    </section>
  );
}

function asRisk(value: string | undefined): ReaderAccessReportQuery['risk'] {
  return value === 'NONE' || value === 'LOW' || value === 'MEDIUM' || value === 'HIGH' ? value : undefined;
}

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}
