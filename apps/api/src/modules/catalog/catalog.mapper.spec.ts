import { mapAdminBook, mapPagedPublicBooks, mapPublicBook } from './catalog.mapper';

describe('catalog mapper', () => {
  const book = {
    id: 'book-1',
    isbn: '9780132350884',
    title: 'Clean Code',
    status: 'PUBLISHED',
    category: { id: 'cat-1', name: 'Programming', slug: 'programming', parentId: null },
    tags: [{ tag: { id: 'tag-1', name: 'Software', slug: 'software' } }],
    authors: [{ author: { id: 'author-1', name: 'Robert C. Martin' } }],
    files: [{ id: 'file-1', originalFilename: 'clean-code.pdf', sizeBytes: 123n }],
    createdAt: new Date('2026-07-21T10:00:00.000Z')
  };

  it('maps public books without file metadata', () => {
    const mapped = mapPublicBook(book);

    expect(mapped).toMatchObject({
      id: 'book-1',
      title: 'Clean Code',
      isbn: '9780132350884',
      status: 'PUBLISHED',
      category: { id: 'cat-1', name: 'Programming', slug: 'programming', parentId: null },
      tags: [{ id: 'tag-1', name: 'Software', slug: 'software' }],
      authors: [{ id: 'author-1', name: 'Robert C. Martin' }],
      createdAt: '2026-07-21T10:00:00.000Z'
    });
    expect(mapped).not.toHaveProperty('file');
  });

  it('maps admin books with file metadata', () => {
    const mapped = mapAdminBook(book);

    expect(mapped).toMatchObject({
      id: 'book-1',
      file: { id: 'file-1', originalFilename: 'clean-code.pdf', sizeBytes: '123' }
    });
  });

  it('wraps public books in a paged response', () => {
    const paged = mapPagedPublicBooks([book], 2, 20, 1);

    expect(paged).toMatchObject({
      page: 2,
      pageSize: 20,
      totalCount: 1,
      items: [{ id: 'book-1', title: 'Clean Code' }]
    });
  });
});
