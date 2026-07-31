import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NewBookIntakePage from '../app/(admin)/admin/books/new/page';
import { fetchTaxonomyCategories, fetchTaxonomyTags } from '../lib/api-server';

vi.mock('../lib/api-server', () => ({
  fetchTaxonomyCategories: vi.fn(),
  fetchTaxonomyTags: vi.fn()
}));

describe('new book intake taxonomy integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchTaxonomyCategories).mockResolvedValue([{ id: 'category-1', name: 'Archives', slug: 'archives', parentId: null }]);
    vi.mocked(fetchTaxonomyTags).mockResolvedValue([{ id: 'tag-1', name: 'Digital', slug: 'digital' }]);
  });

  it('loads Member D taxonomy options into the document intake form', async () => {
    render(await NewBookIntakePage());

    expect(fetchTaxonomyCategories).toHaveBeenCalledOnce();
    expect(fetchTaxonomyTags).toHaveBeenCalledOnce();
    expect(screen.getByRole('option', { name: 'Archives' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Digital' })).toBeInTheDocument();
  });

  it('keeps the intake form available with an explicit partial-load error', async () => {
    vi.mocked(fetchTaxonomyTags).mockRejectedValue(new Error('Tag API unavailable'));
    render(await NewBookIntakePage());

    expect(screen.getByRole('alert')).toHaveTextContent(/tag api unavailable/i);
    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/no tags are available/i);
  });
});
