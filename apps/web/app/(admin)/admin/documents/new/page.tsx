import Link from 'next/link';
import { PageHeader } from '../../../../../components/layout';
import { Button } from '../../../../../components/ui/actions/Button';
import { InlineAlert } from '../../../../../components/ui/feedback/feedback';
import { fetchCategories } from '../../../../../lib/api-server';
import { NewDocumentClient } from './NewDocumentClient';

export default async function NewDocumentIntakePage() {
  let categories: any[] = [];
  let loadError: string | undefined;

  try {
    categories = await fetchCategories();
  } catch (err) {
    loadError = (err as Error).message;
  }

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
      {loadError ? <InlineAlert tone="error">Categories could not be loaded: {loadError}</InlineAlert> : null}
      <NewDocumentClient categories={categories} />
    </section>
  );
}
