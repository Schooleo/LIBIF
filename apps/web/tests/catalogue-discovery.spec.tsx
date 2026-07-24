import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CatalogueDiscovery } from '../components/domain/reader/CatalogueDiscovery';

const push = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/catalogue',
  useSearchParams: () => new URLSearchParams('q=security&page=2'),
}));

const book = {
  id: 'book-1',
  title: 'Secure Reading',
  isbn: null,
  status: 'PUBLISHED' as const,
  category: null,
  tags: [],
  authors: [],
  createdAt: '2026-07-24T00:00:00.000Z',
};

describe('CatalogueDiscovery URL state', () => {
  beforeEach(() => push.mockReset());

  it('persists the selected view mode in the catalogue URL', async () => {
    const user = userEvent.setup();
    render(
      <CatalogueDiscovery
        initialData={{ items: [book], totalCount: 1, page: 1, pageSize: 20 }}
        categories={[]}
        tags={[]}
        currentParams={{ q: 'security', page: 2, view: 'grid' }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'List view' }));

    expect(push).toHaveBeenCalledWith('/catalogue?q=security&page=2&view=list');
  });

  it('persists public tag filtering in the URL and returns to page one', async () => {
    const user = userEvent.setup();
    render(
      <CatalogueDiscovery
        initialData={{ items: [book], totalCount: 1, page: 1, pageSize: 20 }}
        categories={[]}
        tags={[{ id: 'tag-1', name: 'Security', slug: 'security' }]}
        currentParams={{ q: 'security', page: 2 }}
      />,
    );

    await user.click(screen.getByRole('button', { name: '#Security' }));

    expect(push).toHaveBeenCalledWith('/catalogue?q=security&page=1&tagIds=tag-1');
  });
});
