'use client';

import type { CategoryDto, TagDto } from '@libif/shared';
import type { CreateBookIntakeDto } from '../../lib/api-types';
import { CategorySelector, TagSelector } from '../domain/taxonomy';

type Props = {
  categories: CategoryDto[];
  tags: TagDto[];
  metadata: CreateBookIntakeDto;
  onChange: (metadata: CreateBookIntakeDto) => void;
};

export function CategoryTagFields({ categories, tags, metadata, onChange }: Props) {
  const selectedTagIds = tags.filter((tag) => metadata.tags.includes(tag.name)).map((tag) => tag.id);

  return (
    <section className="ui-stack" aria-label="Category and tags">
      <CategorySelector
        categories={categories}
        value={metadata.categoryId}
        onChange={(categoryId) => onChange({ ...metadata, categoryId })}
      />
      <TagSelector
        tags={tags}
        value={selectedTagIds}
        onChange={(tagIds) => onChange({ ...metadata, tags: tags.filter((tag) => tagIds.includes(tag.id)).map((tag) => tag.name) })}
      />
    </section>
  );
}
