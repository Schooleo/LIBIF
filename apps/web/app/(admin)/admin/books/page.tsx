import type { BookListItemDto } from '../../../../lib/api';
import { DocumentCard } from '../../../../components/domain';
import { EmptyState, InlineAlert } from '../../../../components/ui';
import { PageHeader } from '../../../../components/layout';
import { fetchAdminBooks } from '../../../../lib/api';

export default async function AdminBooksPage() {
  let books: BookListItemDto[] = [];
  let loadError: string | undefined;
  try {
    books = await fetchAdminBooks();
  } catch (error) {
    loadError = (error as Error).message;
  }

  return (
    <section className="ui-stack">
      <PageHeader title="Admin Books" />
      {loadError ? <InlineAlert tone="error">Admin books could not be loaded: {loadError}</InlineAlert> : null}
      {books.length === 0 ? <EmptyState title="No digital book intakes yet." /> : (
        <section className="ui-stack" aria-label="Digital book intakes">
          {books.map((book) => <DocumentCard key={book.id} document={{ id: book.id, title: book.title, authors: book.authors.map((author) => author.name), status: book.status }} />)}
        </section>
      )}
    </section>
  );
}
