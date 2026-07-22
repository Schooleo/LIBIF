import { PageHeader } from '../../../../components/layout';
import { Card, Skeleton } from '../../../../components/ui';

export default function AdminTagsLoading() {
  return (
    <section className="ui-stack" aria-busy="true">
      <PageHeader title="Tags" description="Loading tag management." />
      <Card><Skeleton label="Loading tags" /></Card>
    </section>
  );
}
