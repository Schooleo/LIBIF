import type {
  ManagementDashboardSummaryDto,
  ReaderAccessReportItemDto,
  ReaderAccessReportQuery,
  ReaderAccessReportResponseDto,
} from '../../../lib/api-types';
import {
  Card,
  DataTable,
  MetricCard,
  StatusBadge,
  type DataColumn,
} from '../../ui';

const readerAccessColumns: DataColumn<ReaderAccessReportItemDto>[] = [
  { key: 'occurredAt', header: 'When', render: (event) => <time dateTime={event.occurredAt}>{formatDateTime(event.occurredAt)}</time> },
  { key: 'reader', header: 'Reader', render: (event) => event.readerLabel },
  { key: 'event', header: 'Event', render: (event) => <StatusBadge status={event.eventType} /> },
  { key: 'risk', header: 'Risk', render: (event) => <StatusBadge status={event.riskLevel} /> },
  { key: 'document', header: 'Document', render: (event) => event.documentReference },
  {
    key: 'trace',
    header: 'Trace',
    render: (event) => event.traceFingerprint
      ? <code title={event.traceFingerprint}>{event.traceFingerprint.slice(0, 12)}…</code>
      : '—',
  },
];

export function ManagementReporting({
  summary,
  report,
  query,
  apiBaseUrl,
}: {
  summary: ManagementDashboardSummaryDto;
  report: ReaderAccessReportResponseDto;
  query: ReaderAccessReportQuery;
  apiBaseUrl: string;
}) {
  const rangeQuery = buildQuery({ from: query.from, to: query.to });
  const readerQuery = buildQuery(query);
  const exports = [
    { label: 'Reader access CSV', path: `/api/admin/reports/reader-access.csv${readerQuery}` },
    { label: 'Documents CSV', path: `/api/admin/reports/documents.csv${rangeQuery}` },
    { label: 'Users CSV', path: `/api/admin/reports/users.csv${rangeQuery}` },
    { label: 'Activity CSV', path: `/api/admin/reports/activity.csv${rangeQuery}` },
  ];

  return (
    <div className="ui-stack">
      <Card>
        <form method="get" className="ui-cluster" aria-label="Management reporting filters">
          <label>
            <span className="ui-field__label">From (inclusive UTC)</span>
            <input className="ui-input" type="date" name="from" defaultValue={dateInputValue(query.from)} />
          </label>
          <label>
            <span className="ui-field__label">To (exclusive UTC)</span>
            <input className="ui-input" type="date" name="to" defaultValue={dateInputValue(query.to)} />
          </label>
          <label>
            <span className="ui-field__label">Risk</span>
            <select className="ui-select" name="risk" defaultValue={query.risk ?? ''}>
              <option value="">All risk levels</option>
              <option value="NONE">None</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
          <button className="ui-button ui-button--primary" type="submit">Apply filters</button>
          <a className="ui-button ui-button--secondary" href="/admin/management">Reset</a>
        </form>
      </Card>

      <section className="dashboard-metric-row" aria-label="Management summary">
        <MetricCard label="Documents created" value={summary.documentsCreated} />
        <MetricCard label="Users created" value={summary.usersCreated} />
        <MetricCard label="Activity events" value={summary.activityEvents} />
        <MetricCard label="Reader access events" value={summary.readerSecurity.total} description={`${summary.readerSecurity.highRisk} high-risk`} />
      </section>

      <section className="dashboard-metric-row" aria-label="Reader security summary">
        <MetricCard label="Rate limited" value={summary.readerSecurity.rateLimited} />
        <MetricCard label="Scrape suspected" value={summary.readerSecurity.scrapeSuspected} />
        <MetricCard label="No-risk events" value={report.riskCounts.none} />
        <MetricCard label="Elevated-risk events" value={report.riskCounts.low + report.riskCounts.medium + report.riskCounts.high} />
      </section>

      <Card className="ui-stack">
        <h2>Bounded CSV exports</h2>
        <p>Exports use the same inclusive-start and exclusive-end UTC range shown above and apply formula-safe CSV escaping.</p>
        <div className="ui-cluster">
          {exports.map((item) => (
            <a key={item.path} className="ui-button ui-button--secondary" href={`${apiBaseUrl}${item.path}`}>
              {item.label}
            </a>
          ))}
        </div>
      </Card>

      <section className="ui-stack" aria-labelledby="reader-access-heading">
        <h2 id="reader-access-heading">Reader access audit</h2>
        <DataTable
          caption="Bounded reader access audit events"
          columns={readerAccessColumns}
          items={report.items}
          getRowKey={(event) => event.eventReference}
          emptyTitle="No reader access events match this range."
          state={{ page: report.page, pageSize: report.pageSize }}
          rowCount={report.totalCount}
        />
      </section>

      <p className="ui-field__description">
        Generated <time dateTime={summary.generatedAt}>{formatDateTime(summary.generatedAt)}</time>;
        range <time dateTime={summary.from}>{formatDateTime(summary.from)}</time> to{' '}
        <time dateTime={summary.to}>{formatDateTime(summary.to)}</time>.
      </p>
    </div>
  );
}

function buildQuery(query: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

function dateInputValue(value: string | undefined): string {
  return value?.slice(0, 10) ?? '';
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
