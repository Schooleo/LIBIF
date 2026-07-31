import { BookIntakeForm } from '../../../../../components/book-intake/BookIntakeForm';
import { InlineAlert } from '../../../../../components/ui';
import { PageHeader } from '../../../../../components/layout';
import { fetchTaxonomyCategories, fetchTaxonomyTags } from '../../../../../lib/api-server';

export default async function NewBookIntakePage() {
  const [categoryResult, tagResult] = await Promise.allSettled([fetchTaxonomyCategories(), fetchTaxonomyTags()]);
  const categories = categoryResult.status === 'fulfilled' ? categoryResult.value : [];
  const tags = tagResult.status === 'fulfilled' ? tagResult.value : [];
  const loadErrors = [categoryResult, tagResult]
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map((result) => result.reason instanceof Error ? result.reason.message : 'Unknown taxonomy error');

  return (
    <section className="ui-stack">
      <PageHeader title="New Digital Book Intake" description="Upload a scanned PDF, save metadata, assign category/tags, and queue processing." />
      {loadErrors.length > 0 ? <InlineAlert tone="error">Some taxonomy options could not be loaded: {loadErrors.join('; ')}</InlineAlert> : null}
      <BookIntakeForm categories={categories} tags={tags} />
    </section>
  );
}
