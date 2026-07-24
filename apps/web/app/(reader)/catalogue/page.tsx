import { PageHeader } from '../../../components/layout';
import { InlineAlert } from '../../../components/ui';
import { fetchPublicBooks, fetchPublicCategories, fetchPublicTags } from '../../../lib/api-server';
import type { PagedBookListDto, TaxonomyCategoryDto, TaxonomyTagDto } from '../../../lib/api-types';
import { CatalogueDiscovery } from '../../../components/domain/reader/CatalogueDiscovery';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    categoryId?: string;
    tagIds?: string;
    sort?: string;
    page?: string;
    pageSize?: string;
    view?: 'grid' | 'list';
  }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const pageSize = params.pageSize ? parseInt(params.pageSize, 10) : 20;

  const query = {
    q: params.q,
    categoryId: params.categoryId,
    tagIds: params.tagIds,
    sort: params.sort,
    page: isNaN(page) ? 1 : page,
    pageSize: isNaN(pageSize) ? 20 : pageSize,
  };

  let pagedBooks: PagedBookListDto = { items: [], totalCount: 0, page: 1, pageSize: 20 };
  let categories: TaxonomyCategoryDto[] = [];
  let tags: TaxonomyTagDto[] = [];
  let loadError: string | undefined;

  try {
    const [booksRes, catsRes, tagsRes] = await Promise.all([
      fetchPublicBooks(query),
      fetchPublicCategories(),
      fetchPublicTags()
    ]);
    pagedBooks = booksRes;
    categories = catsRes;
    tags = tagsRes;
  } catch (error) {
    loadError = error instanceof Error ? error.message : 'Unknown catalogue error';
  }

  return (
    <section className="ui-stack" style={{ gap: '1.5rem' }}>
      <PageHeader
        title="Public Catalogue"
        description="Search, filter, and discover published digital library books. Only published items are accessible to readers."
      />
      {loadError ? <InlineAlert tone="error">Catalogue could not be loaded: {loadError}</InlineAlert> : null}
      <CatalogueDiscovery
        initialData={pagedBooks}
        categories={categories}
        tags={tags}
        currentParams={{ ...query, view: params.view }}
      />
    </section>
  );
}
