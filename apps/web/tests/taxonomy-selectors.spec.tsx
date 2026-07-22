import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { CategorySelector, TagSelector } from '../components/domain/taxonomy';

const categories = [
  { id: 'category-1', name: 'Archives', slug: 'archives', parentId: null },
  { id: 'category-2', name: 'Research', slug: 'research', parentId: null }
];
const tags = [
  { id: 'tag-1', name: 'Digital', slug: 'digital' },
  { id: 'tag-2', name: 'Preservation', slug: 'preservation' }
];

describe('taxonomy selectors', () => {
  it('reports category selection through a controlled value contract', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<CategorySelector categories={categories} onChange={onChange} />);

    await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'category-2');

    expect(onChange).toHaveBeenCalledWith('category-2');
  });

  it('adds and removes tag ids without exposing taxonomy persistence logic', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<TagSelector tags={tags} value={['tag-1']} onChange={onChange} />);

    await user.click(screen.getByRole('checkbox', { name: 'Preservation' }));
    expect(onChange).toHaveBeenLastCalledWith(['tag-1', 'tag-2']);

    rerender(<TagSelector tags={tags} value={['tag-1', 'tag-2']} onChange={onChange} />);
    await user.click(screen.getByRole('checkbox', { name: 'Digital' }));
    expect(onChange).toHaveBeenLastCalledWith(['tag-2']);
  });

  it('renders an explicit empty state when no tags are available', () => {
    render(<TagSelector tags={[]} value={[]} onChange={vi.fn()} />);

    expect(screen.getByRole('status')).toHaveTextContent(/no tags are available/i);
  });

  it('has no automated accessibility violations', async () => {
    const { container } = render(
      <div>
        <CategorySelector categories={categories} value="category-1" onChange={vi.fn()} />
        <TagSelector tags={tags} value={['tag-1']} onChange={vi.fn()} />
      </div>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
