import Link from 'next/link';
import { PageHeader } from '../../../../../components/layout';
import { Button } from '../../../../../components/ui/actions/Button';
import { InlineAlert } from '../../../../../components/ui/feedback/feedback';
import { fetchTaxonomyCategories, fetchTaxonomyTags } from '../../../../../lib/api-server';
import { NewDocumentClient } from './NewDocumentClient';

export default async function NewDocumentIntakePage() {
  const [categoryResult, tagResult] = await Promise.allSettled([fetchTaxonomyCategories(), fetchTaxonomyTags()]);
  const categories = categoryResult.status === 'fulfilled' ? categoryResult.value : [];
  const tags = tagResult.status === 'fulfilled' ? tagResult.value : [];
  const loadErrors = [categoryResult, tagResult]
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .map((result) => result.reason instanceof Error ? result.reason.message : 'Unknown taxonomy error');

  return (
    <section className="ui-stack ui-stack-lg">
      <PageHeader
        title="New Digital Document Intake"
        description="Upload a document PDF file, save metadata, assign category/tags, and queue processing."
        actions={
          <Link href="/admin/documents">
            <Button variant="secondary">Cancel & Return</Button>
          </Link>
        }
      />
      {loadErrors.length > 0 ? <InlineAlert tone="error">Some taxonomy options could not be loaded: {loadErrors.join('; ')}</InlineAlert> : null}
      <NewDocumentClient categories={categories} tags={tags} />
    </section>
  );
}
