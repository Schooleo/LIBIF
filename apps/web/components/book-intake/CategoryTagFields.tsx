'use client';

import type { CategoryDto, CreateBookIntakeDto } from '../../lib/api';
import { FormField, Select, TextInput } from '../ui';

type Props = {
  categories: CategoryDto[];
  metadata: CreateBookIntakeDto;
  onChange: (metadata: CreateBookIntakeDto) => void;
};

export function CategoryTagFields({ categories, metadata, onChange }: Props) {
  return (
    <section className="ui-stack" aria-label="Category and tags">
      <FormField label="Category">
        {(fieldProps) => (
          <Select {...fieldProps} value={metadata.categoryId ?? ''} onChange={(event) => onChange({ ...metadata, categoryId: event.target.value || undefined })}>
            <option value="">No category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </Select>
        )}
      </FormField>
      <FormField label="Tags" description="Separate tags with commas.">
        {(fieldProps) => <TextInput {...fieldProps} value={metadata.tags.join(', ')} onChange={(event) => onChange({ ...metadata, tags: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} />}
      </FormField>
    </section>
  );
}
