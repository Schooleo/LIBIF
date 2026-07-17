import type { CategoryDto } from '@libif/shared';
import { BookIntakeForm } from '../../../../components/book-intake/BookIntakeForm';
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
    <main>
      <h1>New Digital Book Intake</h1>
      <p>Upload a scanned PDF, save metadata, assign category/tags, and queue processing.</p>
      {loadError ? <p className="error" role="alert">Categories could not be loaded: {loadError}</p> : null}
      <BookIntakeForm categories={categories} />
    </main>
  );
}
