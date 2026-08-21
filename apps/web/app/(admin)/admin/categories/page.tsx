import { PageHeader } from '../../../../components/layout';
import { CategoryManager } from '../../../../components/domain/taxonomy';
import { InlineAlert } from '../../../../components/ui';
import { fetchSession, fetchTaxonomyCategories } from '../../../../lib/api-server';

export default async function AdminCategoriesPage() {
  const [sessionResult, categoryResult] = await Promise.allSettled([
    fetchSession(),
    fetchTaxonomyCategories()
  ]);
  const canManage = sessionResult.status === 'fulfilled' && sessionResult.value.user?.role === 'ADMIN';
  const categories = categoryResult.status === 'fulfilled' ? categoryResult.value : [];

  return (
    <section className="ui-stack">
      <PageHeader title="Categories" description="Organize the category options available to document metadata workflows." />
      {sessionResult.status === 'rejected' ? (
        <InlineAlert tone="error">Permissions could not be verified: {sessionResult.reason instanceof Error ? sessionResult.reason.message : 'Unknown session error'}</InlineAlert>
      ) : null}
      {categoryResult.status === 'rejected' ? (
        <InlineAlert tone="error">Categories could not be loaded: {categoryResult.reason instanceof Error ? categoryResult.reason.message : 'Unknown error'}</InlineAlert>
      ) : <CategoryManager categories={categories} canManage={canManage} />}
    </section>
  );
}
