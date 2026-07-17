'use client';

import type { CategoryDto, CreateBookIntakeDto } from '@libif/shared';

type Props = {
  categories: CategoryDto[];
  metadata: CreateBookIntakeDto;
  onChange: (metadata: CreateBookIntakeDto) => void;
};

export function CategoryTagFields({ categories, metadata, onChange }: Props) {
  return (
    <section className="grid">
      <label>
        Category
        <select value={metadata.categoryId ?? ''} onChange={(event) => onChange({ ...metadata, categoryId: event.target.value || undefined })}>
          <option value="">No category</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </label>
      <label>
        Tags (comma separated)
        <input aria-label="Tags" value={metadata.tags.join(', ')} onChange={(event) => onChange({ ...metadata, tags: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} />
      </label>
    </section>
  );
}
