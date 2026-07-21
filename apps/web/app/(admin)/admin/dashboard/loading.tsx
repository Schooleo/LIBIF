import { PageHeader } from '../../../../components/layout';
import { Card, Skeleton } from '../../../../components/ui';

export default function AdminDashboardLoading() {
  return (
    <section className="ui-stack" aria-busy="true">
      <PageHeader title="Admin Dashboard" description="Loading operational counts for digital intakes, processing jobs, taxonomy, and users." />
      <section className="dashboard-metric-groups" aria-label="Dashboard metrics loading">
        {[['Books', 'Processing', 'Approval'], ['Failures', 'Taxonomy', 'Users']].map((group, index) => (
          <div key={index} className="dashboard-metric-row" aria-label={`Dashboard loading metric row ${index + 1}`}>
            {group.map((label) => (
              <Card key={label} metric>
                <span className="ui-field__description">{label}</span>
                <Skeleton label={`${label} metric loading`} />
              </Card>
            ))}
          </div>
        ))}
      </section>
      <Card>
        <h2>Recent intakes</h2>
        <Skeleton label="Recent intakes loading" />
      </Card>
    </section>
  );
}
