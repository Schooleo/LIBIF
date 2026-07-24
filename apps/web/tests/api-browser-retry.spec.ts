import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchProtectedPageUrl } from '../lib/api-browser';

describe('protected page browser adapter', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('preserves stable 429 retry metadata for the canvas viewer countdown', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      code: 'READER_PAGE_RATE_LIMITED',
      message: 'Wait before requesting another page.',
      retryAfterSeconds: 17,
    }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '17' },
    })));

    await expect(fetchProtectedPageUrl('document-1', 2)).rejects.toMatchObject({
      message: 'Wait before requesting another page.',
      statusCode: 429,
      retryAfterSeconds: 17,
    });
  });
});
