import { afterEach, describe, expect, it, vi } from 'vitest';
import { uploadDocumentIntake } from '../lib/api-browser';

describe('uploadDocumentIntake', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('posts the intake to the API origin with credentials', async () => {
    vi.stubEnv('NEXT_PUBLIC_LIBIF_ENABLE_DEV_AUTH', 'true');
    vi.stubEnv('NEXT_PUBLIC_LIBIF_DEV_ROLE', 'LIBRARIAN');
    vi.stubEnv('NEXT_PUBLIC_LIBIF_DEV_EMAIL', 'librarian@example.com');
    const result = {
      book: { id: 'book-1', title: 'Clean Code', status: 'UPLOADED' },
      file: { id: 'file-1', originalFilename: 'book.pdf', sizeBytes: '8' },
      processingJob: { id: 'job-1', status: 'QUEUED' }
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(result)
    });
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['%PDF-1.4'], 'book.pdf', { type: 'application/pdf' });
    await expect(uploadDocumentIntake(file, {
      title: 'Clean Code',
      authors: ['Robert C. Martin'],
      tags: []
    })).resolves.toEqual(result);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://localhost:3001/api/uploads');
    expect(options).toMatchObject({ method: 'POST', credentials: 'include' });
    expect(options.headers).toEqual({
      'x-libif-dev-role': 'LIBRARIAN',
      'x-libif-dev-user-email': 'librarian@example.com'
    });
    expect(options.body).toBeInstanceOf(FormData);
    expect((options.body as FormData).get('file')).toBe(file);
    expect(JSON.parse(String((options.body as FormData).get('metadata')))).toEqual({
      title: 'Clean Code',
      authors: ['Robert C. Martin'],
      tags: []
    });
  });

  it('surfaces the API error message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'Forbidden resource' })
    }));

    const file = new File(['%PDF-1.4'], 'book.pdf', { type: 'application/pdf' });
    await expect(uploadDocumentIntake(file, {
      title: 'Clean Code',
      authors: ['Robert C. Martin'],
      tags: []
    })).rejects.toThrow('Forbidden resource');
  });
});
