import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoryManager, TagManager } from '../components/domain/taxonomy';
import { createCategory, createTag, updateCategory, updateTag } from '../lib/api-browser';

vi.mock('../lib/api-browser', () => ({
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  createTag: vi.fn(),
  updateTag: vi.fn()
}));

const categories = [
  { id: 'category-1', name: 'Archives', slug: 'archives', parentId: null },
  { id: 'category-2', name: 'Research', slug: 'research', parentId: null }
];
const tags = [
  { id: 'tag-1', name: 'Digital', slug: 'digital' },
  { id: 'tag-2', name: 'Preservation', slug: 'preservation' }
];

describe('taxonomy managers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates and edits categories through the taxonomy adapter', async () => {
    vi.mocked(createCategory).mockResolvedValue({ id: 'category-3', name: 'Collections', slug: 'collections', parentId: 'category-1' });
    vi.mocked(updateCategory).mockResolvedValue({ id: 'category-1', name: 'Institutional Archives', slug: 'institutional-archives', parentId: null });
    const user = userEvent.setup();
    render(<CategoryManager categories={categories} canManage />);

    await user.type(screen.getByRole('textbox', { name: /category name/i }), ' Collections ');
    await user.selectOptions(screen.getByRole('combobox', { name: /parent category/i }), 'category-1');
    await user.click(screen.getByRole('button', { name: /create category/i }));

    await waitFor(() => expect(createCategory).toHaveBeenCalledWith({ name: 'Collections', parentId: 'category-1' }));
    expect(within(screen.getByRole('table')).getByText('Collections')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit Archives' }));
    const name = screen.getByRole('textbox', { name: /category name/i });
    await user.clear(name);
    await user.type(name, 'Institutional Archives');
    await user.click(screen.getByRole('button', { name: /save category/i }));

    await waitFor(() => expect(updateCategory).toHaveBeenCalledWith('category-1', { name: 'Institutional Archives', parentId: null }));
    expect(within(screen.getByRole('table')).getByRole('button', { name: 'Edit Institutional Archives' })).toBeInTheDocument();
  });

  it('creates and edits tags and reports mutation failures', async () => {
    vi.mocked(createTag).mockResolvedValue({ id: 'tag-3', name: 'Open Access', slug: 'open-access' });
    vi.mocked(updateTag).mockRejectedValue(new Error('Tag slug already exists.'));
    const user = userEvent.setup();
    render(<TagManager tags={tags} canManage />);

    await user.type(screen.getByRole('textbox', { name: /tag name/i }), ' Open Access ');
    await user.click(screen.getByRole('button', { name: /create tag/i }));

    await waitFor(() => expect(createTag).toHaveBeenCalledWith({ name: 'Open Access' }));
    expect(await screen.findByText('Open Access')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit Digital' }));
    await user.click(screen.getByRole('button', { name: /save tag/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Tag slug already exists.');
  });

  it('shows librarians a read-only list without mutation controls', () => {
    render(<CategoryManager categories={categories} canManage={false} />);

    expect(screen.getByText(/read-only access/i)).toBeInTheDocument();
    expect(screen.getByText('Archives')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('renders explicit empty states', () => {
    render(<TagManager tags={[]} canManage={false} />);

    expect(screen.getByRole('heading', { name: /no tags available/i })).toBeInTheDocument();
    expect(screen.getByText(/no matching records are available/i)).toBeInTheDocument();
  });

  it('has no automated accessibility violations in admin and read-only states', async () => {
    const { container } = render(
      <div>
        <CategoryManager categories={categories} canManage />
        <TagManager tags={tags} canManage={false} />
      </div>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
