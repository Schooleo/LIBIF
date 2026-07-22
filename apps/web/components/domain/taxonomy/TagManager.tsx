'use client';

import type { TagDto } from '@libif/shared';
import { useState, type FormEvent } from 'react';
import { createTag, updateTag } from '../../../lib/api-browser';
import { Button, Card, DataTable, FormField, InlineAlert, TextInput, type DataColumn } from '../../ui';

type TagManagerProps = {
  tags: TagDto[];
  canManage: boolean;
};

export function TagManager({ tags: initialTags, canManage }: TagManagerProps) {
  const [tags, setTags] = useState(initialTags);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const beginEdit = (tag: TagDto) => {
    setEditingId(tag.id);
    setName(tag.name);
    setError(undefined);
  };

  const resetForm = () => {
    setEditingId(undefined);
    setName('');
    setError(undefined);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = name.trim();
    if (!normalizedName) {
      setError('Enter a tag name.');
      return;
    }

    setSaving(true);
    setError(undefined);
    try {
      const saved = editingId
        ? await updateTag(editingId, { name: normalizedName })
        : await createTag({ name: normalizedName });
      setTags((current) => {
        const next = editingId
          ? current.map((tag) => tag.id === saved.id ? saved : tag)
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

  const columns: DataColumn<TagDto>[] = [
    { key: 'name', header: 'Name', render: (tag) => tag.name },
    { key: 'slug', header: 'Slug', render: (tag) => tag.slug },
    ...(canManage ? [{
      key: 'actions',
      header: 'Actions',
      render: (tag: TagDto) => <Button variant="secondary" size="sm" onClick={() => beginEdit(tag)}>Edit {tag.name}</Button>
    }] : [])
  ];

  return (
    <section className="ui-stack" aria-label="Tag management">
      {!canManage ? (
        <InlineAlert tone="info" title="Read-only access">
          Librarians can use tag options in document metadata, but only administrators can create or edit them.
        </InlineAlert>
      ) : (
        <Card>
          <form className="ui-stack" onSubmit={submit} aria-label={editingId ? 'Edit tag' : 'Create tag'}>
            <h2>{editingId ? 'Edit tag' : 'Create tag'}</h2>
            <FormField label="Tag name" required error={error}>
              {(fieldProps) => (
                <TextInput {...fieldProps} value={name} disabled={saving} onChange={(event) => setName(event.target.value)} />
              )}
            </FormField>
            <div className="ui-cluster">
              <Button type="submit" loading={saving}>{editingId ? 'Save tag' : 'Create tag'}</Button>
              {editingId ? <Button variant="secondary" onClick={resetForm} disabled={saving}>Cancel editing</Button> : null}
            </div>
          </form>
        </Card>
      )}
      <DataTable caption="Tags" columns={columns} items={tags} getRowKey={(tag) => tag.id} emptyTitle="No tags available" />
    </section>
  );
}
