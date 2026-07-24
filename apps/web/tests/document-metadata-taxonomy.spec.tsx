import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DocumentMetadataForm } from '../components/domain/documents/DocumentMetadataForm';

const categories = [
  { id: 'category-1', name: 'Archives', slug: 'archives', parentId: null },
  { id: 'category-2', name: 'Research', slug: 'research', parentId: null }
];

const tags = [
  { id: 'tag-1', name: 'Digital', slug: 'digital' },
  { id: 'tag-2', name: 'Preservation', slug: 'preservation' }
];

describe('document metadata taxonomy integration', () => {
  it('aligns the ISBN prefill action with the ISBN input', () => {
    render(<DocumentMetadataForm categories={categories} tags={tags} onSubmit={vi.fn()} />);

    expect(screen.getByRole('button', { name: /prefill from isbn/i })).toHaveStyle({ alignSelf: 'flex-end' });
  });

  it('submits taxonomy selections through the document metadata contract', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <DocumentMetadataForm
        categories={categories}
        tags={tags}
        initialValues={{ title: 'Digital Archives', authors: 'Ada Archivist' }}
        onSubmit={onSubmit}
      />
    );

    await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'category-2');
    await user.click(screen.getByRole('checkbox', { name: 'Preservation' }));
    await user.click(screen.getByRole('button', { name: /save document metadata/i }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      categoryId: 'category-2',
      tags: 'Preservation'
    }));
  });
});
