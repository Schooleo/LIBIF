-- Keep the complete extracted/OCR text in PostgreSQL as a searchable projection.
-- The canonical artifact remains private in object storage.
ALTER TABLE "Book" ADD COLUMN "searchText" TEXT;

-- The expression matches the public-catalogue search query exactly, allowing
-- PostgreSQL to use a GIN index for title, ISBN, and processed document text.
CREATE INDEX "Book_catalogue_search_idx" ON "Book" USING GIN (
  to_tsvector(
    'simple',
    "title" || ' ' || COALESCE("isbn", '') || ' ' || COALESCE("searchText", '')
  )
);
