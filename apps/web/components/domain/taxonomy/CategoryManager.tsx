'use client';

import type { CategoryDto } from '@libif/shared';
import { useState, type FormEvent } from 'react';
import { createCategory, deleteCategory, fetchCategoryImpact, reassignAndDeleteCategory, updateCategory, type CategoryImpactResponse } from '../../../lib/api-browser';
import { Button, Card, DataTable, Dialog, FormField, InlineAlert, Select, TextInput, type DataColumn } from '../../ui';

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

  // Delete / Reassign dialog state
  const [deletingCategory, setDeletingCategory] = useState<CategoryDto | null>(null);
  const [impact, setImpact] = useState<CategoryImpactResponse | null>(null);
  const [targetCategoryId, setTargetCategoryId] = useState<string>('');
  const [loadingImpact, setLoadingImpact] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>();

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

  const beginDelete = async (category: CategoryDto) => {
    setDeletingCategory(category);
    setImpact(null);
    setTargetCategoryId('');
    setLoadingImpact(true);
    setDeleteError(undefined);
    try {
      const data = await fetchCategoryImpact(category.id);
      setImpact(data);
    } catch (err) {
      setDeleteError((err as Error).message);
    } finally {
      setLoadingImpact(false);
    }
  };

  const closeDeleteDialog = () => {
    setDeletingCategory(null);
    setImpact(null);
    setTargetCategoryId('');
    setDeleteError(undefined);
  };

  const confirmDelete = async () => {
    if (!deletingCategory || !impact) return;
    if (!impact.canDirectDelete && !targetCategoryId) {
      setDeleteError('Please select a target category for reassignment.');
      return;
    }

    setDeleting(true);
    setDeleteError(undefined);
    try {
      if (impact.canDirectDelete) {
        await deleteCategory(deletingCategory.id);
      } else {
        await reassignAndDeleteCategory(deletingCategory.id, targetCategoryId);
      }
      setCategories((current) => {
        const next = current
          .filter((c) => c.id !== deletingCategory.id)
          .map((c) => (c.parentId === deletingCategory.id ? { ...c, parentId: targetCategoryId || null } : c));
        return next;
      });
      closeDeleteDialog();
    } catch (err) {
      setDeleteError((err as Error).message);
    } finally {
      setDeleting(false);
    }
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
          ? current.map((category) => (category.id === saved.id ? saved : category))
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
      render: (category) => categories.find((candidate) => candidate.id === category.parentId)?.name ?? 'None',
    },
    ...(canManage
      ? [
          {
            key: 'actions',
            header: 'Actions',
            render: (category: CategoryDto) => (
              <div className="ui-cluster">
                <Button variant="secondary" size="sm" onClick={() => beginEdit(category)}>
                  Edit {category.name}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => beginDelete(category)}>
                  Delete {category.name}
                </Button>
              </div>
            ),
          },
        ]
      : []),
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
                  {categories
                    .filter((category) => category.id !== editingId)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </Select>
              )}
            </FormField>
            <div className="ui-cluster">
              <Button type="submit" loading={saving}>
                {editingId ? 'Save category' : 'Create category'}
              </Button>
              {editingId ? (
                <Button variant="secondary" onClick={resetForm} disabled={saving}>
                  Cancel editing
                </Button>
              ) : null}
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

      {deletingCategory ? (
        <Dialog
          open={!!deletingCategory}
          title={`Delete Category "${deletingCategory.name}"`}
          description={
            loadingImpact
              ? 'Checking category impact...'
              : impact?.canDirectDelete
              ? 'This category has no associated documents or subcategories and can be safely deleted.'
              : 'Institutional policy requires all documents and subcategories to be reassigned before this container can be removed.'
          }
          onClose={closeDeleteDialog}
        >
          <div className="ui-stack">
            {deleteError ? <InlineAlert tone="error" title="Operation failed">{deleteError}</InlineAlert> : null}
            {impact && !impact.canDirectDelete ? (
              <>
                <div className="ui-stack">
                  <p><strong>Documents affected:</strong> {impact.documentCount}</p>
                  <p><strong>Subcategories affected:</strong> {impact.childCount}</p>
                </div>
                <FormField label="Reassign to category" required description="Select a destination category for all contents.">
                  {(fieldProps) => (
                    <Select
                      {...fieldProps}
                      value={targetCategoryId}
                      disabled={deleting}
                      onChange={(e) => setTargetCategoryId(e.target.value)}
                    >
                      <option value="">Select a target category</option>
                      {categories
                        .filter((c) => c.id !== deletingCategory.id)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </Select>
                  )}
                </FormField>
              </>
            ) : null}
            <div className="ui-cluster">
              <Button
                variant="primary"
                loading={deleting}
                disabled={loadingImpact || (!impact?.canDirectDelete && !targetCategoryId)}
                onClick={confirmDelete}
              >
                {impact?.canDirectDelete ? 'Delete category' : 'Reassign and delete'}
              </Button>
              <Button variant="secondary" disabled={deleting} onClick={closeDeleteDialog}>
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      ) : null}
    </section>
  );
}
