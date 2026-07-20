import type { CategoryDto } from '@libif/shared';
import { BookIntakeForm } from '../../../../components/book-intake/BookIntakeForm';
import { InlineAlert } from '../../../../components/ui';
import { PageHeader } from '../../../../components/layout';
import { fetchCategories } from '../../../../lib/api';

export default async function NewBookIntakePage() {
  let categories: CategoryDto[] = [];
  let loadError: string | undefined;
  try {
    categories = await fetchCategories();
  } catch (error) {
    loadError = (error as Error).message;
  }

  return (
    <main className="ui-stack">
      <PageHeader title="New Digital Book Intake" description="Upload a scanned PDF, save metadata, assign category/tags, and queue processing." />
      {loadError ? <InlineAlert tone="error">Categories could not be loaded: {loadError}</InlineAlert> : null}
      <BookIntakeForm categories={categories} />
    </main>
  );
}
