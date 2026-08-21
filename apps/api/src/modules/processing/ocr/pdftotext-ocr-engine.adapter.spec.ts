import { splitPdftotextPages } from './pdftotext-ocr-engine.adapter';

describe('splitPdftotextPages', () => {
  it('preserves page numbers, including pages without extracted text', () => {
    expect(splitPdftotextPages('first page\f\fthird page\f', 3)).toEqual([
      'first page',
      '',
      'third page'
    ]);
  });
});
