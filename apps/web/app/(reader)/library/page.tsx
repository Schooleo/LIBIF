import { PageHeader } from '../../../components/layout';
import { InlineAlert } from '../../../components/ui';
import { fetchReaderLibrary } from '../../../lib/api-server';
import { ReaderLibrary } from '../../../components/domain/reader';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  let libraryData: any = { items: [], total: 0, readingCount: 0, bookmarkedCount: 0 };
  let errorMsg: string | null = null;

  try {
    libraryData = await fetchReaderLibrary();
  } catch (err) {
    errorMsg = (err as Error).message;
  }

  return (
    <section className="ui-stack" style={{ gap: '1.5rem' }}>
      <PageHeader
        title="My Personal Library"
        description="Track active reading sessions, filter saved bookmarks, and access your collection."
      />

      {errorMsg ? (
        <InlineAlert tone="error">
          Failed to load personal library items: {errorMsg}. Please ensure you are signed in.
        </InlineAlert>
      ) : (
        <ReaderLibrary
          items={libraryData.items || []}
          total={libraryData.total}
          readingCount={libraryData.readingCount}
          bookmarkedCount={libraryData.bookmarkedCount}
        />
      )}
    </section>
  );
}
