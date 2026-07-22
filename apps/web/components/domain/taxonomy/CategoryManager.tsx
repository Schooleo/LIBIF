'use client';

import type { CategoryDto } from '@libif/shared';
import { useState, type FormEvent } from 'react';
import { createCategory, updateCategory } from '../../../lib/api-browser';
import { Button, Card, DataTable, FormField, InlineAlert, Select, TextInput, type DataColumn } from '../../ui';

type CategoryManagerProps = {
  categories: CategoryDto[];
  canManage: boolean;
};

type CategoryDraft = {
  name: string;
  parentId: string;
};

const emptyDraft: CategoryDraft = { name: '', parentId: '' };

export function CategoryManager({ categories: initialCategories, canManage }: CategoryManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [draft, setDraft] = useState<CategoryDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const beginEdit = (category: CategoryDto) => {
    setEditingId(category.id);
    setDraft({ name: category.name, parentId: category.parentId ?? '' });
    setError(undefined);
  };

  const resetForm = () => {
    setEditingId(undefined);
    setDraft(emptyDraft);
    setError(undefined);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draft.name.trim();
    if (!name) {
      setError('Enter a category name.');
      return;
    }

    setSaving(true);
    setError(undefined);
    try {
      const saved = editingId
        ? await updateCategory(editingId, { name, parentId: draft.parentId || null })
        : await createCategory({ name, parentId: draft.parentId || undefined });
      setCategories((current) => {
        const next = editingId
          ? current.map((category) => category.id === saved.id ? saved : category)
          : [...current, saved];
        return next.sort((left, right) => left.name.localeCompare(right.name));
      });
      resetForm();
    } catch (saveError) {
      setError((saveError as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const columns: DataColumn<CategoryDto>[] = [
    { key: 'name', header: 'Name', render: (category) => category.name },
    { key: 'slug', header: 'Slug', render: (category) => category.slug },
    {
      key: 'parent',
      header: 'Parent',
      render: (category) => categories.find((candidate) => candidate.id === category.parentId)?.name ?? 'None'
    },
    ...(canManage ? [{
      key: 'actions',
      header: 'Actions',
      render: (category: CategoryDto) => <Button variant="secondary" size="sm" onClick={() => beginEdit(category)}>Edit {category.name}</Button>
    }] : [])
  ];

  return (
    <section className="ui-stack" aria-label="Category management">
      {!canManage ? (
        <InlineAlert tone="info" title="Read-only access">
          Librarians can use category options in document metadata, but only administrators can create or edit them.
        </InlineAlert>
      ) : (
        <Card>
          <form className="ui-stack" onSubmit={submit} aria-label={editingId ? 'Edit category' : 'Create category'}>
            <h2>{editingId ? 'Edit category' : 'Create category'}</h2>
            <FormField label="Category name" required error={error}>
              {(fieldProps) => (
                <TextInput
                  {...fieldProps}
                  value={draft.name}
                  disabled={saving}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                />
              )}
            </FormField>
            <FormField label="Parent category" description="Optional. A category cannot be its own parent or a child of one of its descendants.">
              {(fieldProps) => (
                <Select
                  {...fieldProps}
                  value={draft.parentId}
                  disabled={saving}
                  onChange={(event) => setDraft((current) => ({ ...current, parentId: event.target.value }))}
                >
                  <option value="">No parent</option>
                  {categories.filter((category) => category.id !== editingId).map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </Select>
              )}
            </FormField>
            <div className="ui-cluster">
              <Button type="submit" loading={saving}>{editingId ? 'Save category' : 'Create category'}</Button>
              {editingId ? <Button variant="secondary" onClick={resetForm} disabled={saving}>Cancel editing</Button> : null}
            </div>
          </form>
        </Card>
      )}
      <DataTable
        caption="Categories"
        columns={columns}
        items={categories}
        getRowKey={(category) => category.id}
        emptyTitle="No categories available"
      />
    </section>
  );
}
