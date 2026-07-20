import type { BookListItemDto } from '../../../lib/api-types';
import { DocumentCard } from '../../../components/domain';
import { EmptyState, InlineAlert } from '../../../components/ui';
import { PageHeader } from '../../../components/layout';
import { fetchPublicBooks } from '../../../lib/api-server';

export default async function CatalogPage() {
  let books: BookListItemDto[] = [];
  let loadError: string | undefined;
  try {
    books = await fetchPublicBooks();
  } catch (error) {
    loadError = (error as Error).message;
  }

  return (
    <section className="ui-stack">
      <PageHeader title="Public Catalog" description="Only published books appear here; newly uploaded intakes remain hidden while pending processing/approval." />
      {loadError ? <InlineAlert tone="error">Catalog books could not be loaded: {loadError}</InlineAlert> : null}
      {books.length === 0 ? <EmptyState title="No published books yet." /> : (
        <section className="ui-stack" aria-label="Published books">
          {books.map((book) => <DocumentCard key={book.id} document={{ id: book.id, title: book.title, authors: book.authors.map((author) => author.name), status: book.status }} />)}
        </section>
      )}
    </section>
  );
}
