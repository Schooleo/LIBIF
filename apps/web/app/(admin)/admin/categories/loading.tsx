import { PageHeader } from '../../../../components/layout';
import { Card, Skeleton } from '../../../../components/ui';

export default function AdminCategoriesLoading() {
  return (
    <section className="ui-stack" aria-busy="true">
      <PageHeader title="Categories" description="Loading category management." />
      <Card><Skeleton label="Loading categories" /></Card>
    </section>
  );
}
