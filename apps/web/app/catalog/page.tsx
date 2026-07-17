import type { BookListItemDto } from '@libif/shared';
import { fetchPublicBooks } from '../../lib/api';

export default async function CatalogPage() {
  let books: BookListItemDto[] = [];
  let loadError: string | undefined;
  try {
    books = await fetchPublicBooks();
  } catch (error) {
    loadError = (error as Error).message;
  }

  return (
    <main>
      <h1>Public Catalog</h1>
      <p>Only published books appear here; newly uploaded intakes remain hidden while pending processing/approval.</p>
      {loadError ? <p className="error" role="alert">Catalog books could not be loaded: {loadError}</p> : null}
      <section className="card grid">
        {books.length === 0 ? <p>No published books yet.</p> : books.map((book) => (
          <article key={book.id}>
            <h2>{book.title}</h2>
            <p>{book.authors.map((author) => author.name).join(', ')}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
