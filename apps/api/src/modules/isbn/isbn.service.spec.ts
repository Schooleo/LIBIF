import { IsbnService } from './isbn.service';

describe('IsbnService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('maps Google Books metadata', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ totalItems: 1, items: [{ volumeInfo: { title: 'Clean Code', authors: ['Robert C. Martin'], publisher: 'Prentice Hall', publishedDate: '2008-08-01', description: 'A book', language: 'en' } }] })
    } as Response);
    const result = await new IsbnService().lookup('978-0132350884');
    expect(result).toMatchObject({ found: true, metadata: { title: 'Clean Code', authors: ['Robert C. Martin'], publishedYear: 2008 } });
  });

  it('returns found false when provider has no result', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ totalItems: 0 }) } as Response);
    await expect(new IsbnService().lookup('1234567890')).resolves.toMatchObject({ found: false });
  });
});
