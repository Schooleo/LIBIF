import { Injectable } from '@nestjs/common';

type GoogleBookVolume = {
  volumeInfo?: {
    title?: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    language?: string;
  };
};

type GoogleBooksResponse = {
  totalItems?: number;
  items?: GoogleBookVolume[];
};

@Injectable()
export class IsbnService {
  async lookup(isbn: string) {
    const normalized = isbn.replace(/[\s-]/g, '');
    if (!normalized) return { found: false, message: 'ISBN is required.' };
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(normalized)}`, {
        signal: AbortSignal.timeout(4000)
      });
      if (!response.ok) {
        return { found: false, message: 'ISBN lookup provider returned an error.' };
      }
      const data = (await response.json()) as GoogleBooksResponse;
      const info = data.items?.[0]?.volumeInfo;
      if (!data.totalItems || !info) {
        return { found: false, message: 'Không tìm thấy thông tin, vui lòng tự điền.' };
      }
      const year = info.publishedDate ? Number.parseInt(info.publishedDate.slice(0, 4), 10) : undefined;
      return {
        found: true,
        metadata: {
          isbn: normalized,
          title: info.title ?? '',
          subtitle: info.subtitle,
          authors: info.authors ?? [],
          publisher: info.publisher,
          publishedYear: Number.isFinite(year) ? year : undefined,
          description: info.description,
          language: info.language
        }
      };
    } catch {
      return { found: false, message: 'Không tìm thấy thông tin, vui lòng tự điền.' };
    }
  }
}
