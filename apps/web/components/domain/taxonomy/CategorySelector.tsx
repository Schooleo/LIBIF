'use client';

import type { CategoryDto } from '@libif/shared';
import { FormField, Select } from '../../ui';

type CategorySelectorProps = {
  categories: CategoryDto[];
  value?: string;
  onChange: (categoryId: string | undefined) => void;
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
};

export function CategorySelector({ categories, value, onChange, label = 'Category', description = 'Choose the category used to organize this document.', error, disabled }: CategorySelectorProps) {
  return (
    <FormField label={label} description={description} error={error}>
      {(fieldProps) => (
        <Select {...fieldProps} value={value ?? ''} disabled={disabled} onChange={(event) => onChange(event.target.value || undefined)}>
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </Select>
      )}
    </FormField>
  );
}
