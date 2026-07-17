import type { BookListItemDto } from '@libif/shared';
import { fetchAdminBooks } from '../../../lib/api';

export default async function AdminBooksPage() {
  let books: BookListItemDto[] = [];
  let loadError: string | undefined;
  try {
    books = await fetchAdminBooks();
  } catch (error) {
    loadError = (error as Error).message;
  }

  return (
    <main>
      <h1>Admin Books</h1>
      {loadError ? <p className="error" role="alert">Admin books could not be loaded: {loadError}</p> : null}
      <section className="card grid">
        {books.length === 0 ? <p>No digital book intakes yet.</p> : books.map((book) => (
          <article key={book.id}>
            <h2>{book.title}</h2>
            <p>Status: {book.status}</p>
            <p>Authors: {book.authors.map((author) => author.name).join(', ') || '—'}</p>
            <p>Category: {book.category?.name ?? '—'}</p>
            <p>Tags: {book.tags.map((tag) => tag.name).join(', ') || '—'}</p>
            <p>File: {book.file?.originalFilename ?? '—'}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
