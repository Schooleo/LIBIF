import type { LibrarianDashboardSummaryDto } from '../../../lib/api-types';
import { DataTable, type DataColumn, EmptyState, MetricCard, StatusBadge } from '../../ui';

type RecentBook = LibrarianDashboardSummaryDto['recentBooks'][number];

type Metric = {
  label: string;
  value: number;
  description?: string;
};

const recentBookColumns: DataColumn<RecentBook>[] = [
  { key: 'title', header: 'Title', render: (book) => <strong>{book.title}</strong> },
  { key: 'status', header: 'Status', render: (book) => <StatusBadge status={book.status} /> },
  { key: 'createdAt', header: 'Created', render: (book) => <time dateTime={book.createdAt}>{formatDate(book.createdAt)}</time> }
];

export function DashboardMetrics({ summary }: { summary: LibrarianDashboardSummaryDto }) {
  const metrics: Metric[] = [
    { label: 'Total books', value: summary.books.total, description: `${summary.books.published} published` },
    { label: 'Pending processing', value: summary.books.pendingProcessing, description: `${summary.books.processing} currently processing` },
    { label: 'Pending approval', value: summary.books.pendingApproval, description: `${summary.books.rejected} rejected` },
    { label: 'Processing failures', value: summary.processingJobs.failed, description: `${summary.processingJobs.queued} queued jobs` },
    { label: 'Categories', value: summary.taxonomy.categories, description: `${summary.taxonomy.tags} tags` },
    { label: 'Users', value: summary.users.total, description: `${summary.users.librarians} librarians, ${summary.users.readers} readers` }
  ];

  return (
    <div className="ui-stack">
      <section className="dashboard-metric-groups" aria-label="Dashboard metrics">
        {chunk(metrics, 3).map((group, index) => (
          <div key={index} className="dashboard-metric-row" aria-label={`Dashboard metric row ${index + 1}`}>
            {group.map((metric) => <MetricCard key={metric.label} label={metric.label} value={metric.value} description={metric.description} />)}
          </div>
        ))}
      </section>
      <section className="ui-stack" aria-labelledby="dashboard-book-status-heading">
        <h2 id="dashboard-book-status-heading">Book lifecycle summary</h2>
        <div className="ui-cluster">
          <StatusCount status="DRAFT" value={summary.books.draft} />
          <StatusCount status="PENDING_PROCESSING" value={summary.books.pendingProcessing} />
          <StatusCount status="PROCESSING" value={summary.books.processing} />
          <StatusCount status="PENDING_APPROVAL" value={summary.books.pendingApproval} />
          <StatusCount status="PUBLISHED" value={summary.books.published} />
          <StatusCount status="REJECTED" value={summary.books.rejected} />
        </div>
      </section>
      <section className="ui-stack" aria-labelledby="dashboard-recent-books-heading">
        <h2 id="dashboard-recent-books-heading">Recent intakes</h2>
        {summary.recentBooks.length > 0 ? (
          <DataTable caption="Recent digital book intakes" columns={recentBookColumns} items={summary.recentBooks} getRowKey={(book) => book.id} />
        ) : (
          <EmptyState title="No recent intakes yet.">New digital book intakes will appear here after staff upload documents.</EmptyState>
        )}
      </section>
      <p className="ui-field__description">Generated at <time dateTime={summary.generatedAt}>{formatDateTime(summary.generatedAt)}</time>.</p>
    </div>
  );
}

function StatusCount({ status, value }: { status: string; value: number }) {
  return <span className="ui-cluster"><StatusBadge status={status} /><strong>{value}</strong></span>;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = [];
  for (let index = 0; index < items.length; index += size) groups.push(items.slice(index, index + size));
  return groups;
}
