import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminCategoriesPage from '../app/(admin)/admin/categories/page';
import AdminTagsPage from '../app/(admin)/admin/tags/page';
import { fetchSession, fetchTaxonomyCategories, fetchTaxonomyTags } from '../lib/api-server';

vi.mock('../lib/api-server', () => ({
  fetchSession: vi.fn(),
  fetchTaxonomyCategories: vi.fn(),
  fetchTaxonomyTags: vi.fn()
}));

const adminSession = {
  authenticated: true,
  user: { id: 'admin-1', email: 'admin@libif.local', role: 'ADMIN' },
  permissions: [],
  strategy: 'persistent-cookie'
};

describe('taxonomy admin routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchSession).mockResolvedValue(adminSession);
    vi.mocked(fetchTaxonomyCategories).mockResolvedValue([{ id: 'category-1', name: 'Archives', slug: 'archives', parentId: null }]);
    vi.mocked(fetchTaxonomyTags).mockResolvedValue([{ id: 'tag-1', name: 'Digital', slug: 'digital' }]);
  });

  it('renders the category list with exactly one route heading', async () => {
    render(await AdminCategoriesPage());

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Categories' })).toBeInTheDocument();
    expect(within(screen.getByRole('table')).getByText('Archives')).toBeInTheDocument();
  });

  it('derives librarian read-only access from the current session', async () => {
    vi.mocked(fetchSession).mockResolvedValue({ ...adminSession, user: { ...adminSession.user, role: 'LIBRARIAN' } });
    render(await AdminTagsPage());

    expect(screen.getByText(/read-only access/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /create tag/i })).not.toBeInTheDocument();
    expect(screen.getByText('Digital')).toBeInTheDocument();
  });

  it('makes a failed permission check explicit and falls back to read-only controls', async () => {
    vi.mocked(fetchSession).mockRejectedValue(new Error('Session API unavailable'));
    render(await AdminCategoriesPage());

    expect(screen.getByRole('alert')).toHaveTextContent(/permissions could not be verified.*session api unavailable/i);
    expect(screen.getByText(/read-only access/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /create category/i })).not.toBeInTheDocument();
  });

  it('renders category and tag API errors without an empty list masquerading as success', async () => {
    vi.mocked(fetchTaxonomyCategories).mockRejectedValue(new Error('Category API unavailable'));
    vi.mocked(fetchTaxonomyTags).mockRejectedValue(new Error('Tag API unavailable'));

    const { unmount } = render(await AdminCategoriesPage());
    expect(screen.getByRole('alert')).toHaveTextContent(/category api unavailable/i);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    unmount();
    render(await AdminTagsPage());
    expect(screen.getByRole('alert')).toHaveTextContent(/tag api unavailable/i);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
