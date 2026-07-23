'use client';

import type { TagDto } from '@libif/shared';
import { useState, type FormEvent } from 'react';
import { createTag, deleteTag, fetchTagImpact, mergeTag, updateTag, type TagImpactResponse } from '../../../lib/api-browser';
import { Button, Card, DataTable, Dialog, FormField, InlineAlert, Select, TextInput, type DataColumn } from '../../ui';

type TagManagerProps = {
  tags: TagDto[];
  canManage: boolean;
};

type TagModalMode = 'delete' | 'merge' | null;

export function TagManager({ tags: initialTags, canManage }: TagManagerProps) {
  const [tags, setTags] = useState(initialTags);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  // Modal dialog state for Delete / Merge
  const [activeTag, setActiveTag] = useState<TagDto | null>(null);
  const [modalMode, setModalMode] = useState<TagModalMode>(null);
  const [impact, setImpact] = useState<TagImpactResponse | null>(null);
  const [targetTagId, setTargetTagId] = useState<string>('');
  const [loadingImpact, setLoadingImpact] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [modalError, setModalError] = useState<string>();

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

  const openTagModal = async (tag: TagDto, mode: 'delete' | 'merge') => {
    setActiveTag(tag);
    setModalMode(mode);
    setImpact(null);
    setTargetTagId('');
    setLoadingImpact(true);
    setModalError(undefined);
    try {
      const data = await fetchTagImpact(tag.id);
      setImpact(data);
    } catch (err) {
      setModalError((err as Error).message);
    } finally {
      setLoadingImpact(false);
    }
  };

  const closeModal = () => {
    setActiveTag(null);
    setModalMode(null);
    setImpact(null);
    setTargetTagId('');
    setModalError(undefined);
  };

  const confirmModalAction = async () => {
    if (!activeTag || !modalMode) return;

    if (modalMode === 'merge' && !targetTagId) {
      setModalError('Please select a target tag to merge into.');
      return;
    }

    setActionInProgress(true);
    setModalError(undefined);
    try {
      if (modalMode === 'delete') {
        await deleteTag(activeTag.id);
        setTags((current) => current.filter((t) => t.id !== activeTag.id));
      } else if (modalMode === 'merge') {
        await mergeTag(activeTag.id, targetTagId);
        setTags((current) => current.filter((t) => t.id !== activeTag.id));
      }
      closeModal();
    } catch (err) {
      setModalError((err as Error).message);
    } finally {
      setActionInProgress(false);
    }
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
          ? current.map((tag) => (tag.id === saved.id ? saved : tag))
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
    ...(canManage
      ? [
          {
            key: 'actions',
            header: 'Actions',
            render: (tag: TagDto) => (
              <div className="ui-cluster">
                <Button variant="secondary" size="sm" onClick={() => beginEdit(tag)}>
                  Edit {tag.name}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => openTagModal(tag, 'merge')}>
                  Merge {tag.name}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => openTagModal(tag, 'delete')}>
                  Delete {tag.name}
                </Button>
              </div>
            ),
          },
        ]
      : []),
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
              <Button type="submit" loading={saving}>
                {editingId ? 'Save tag' : 'Create tag'}
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

      <DataTable caption="Tags" columns={columns} items={tags} getRowKey={(tag) => tag.id} emptyTitle="No tags available" />

      {activeTag && modalMode ? (
        <Dialog
          open={!!activeTag}
          title={modalMode === 'delete' ? `Delete Tag "${activeTag.name}"` : `Merge Tag "${activeTag.name}"`}
          description={
            loadingImpact
              ? 'Checking tag usage...'
              : modalMode === 'delete'
              ? `This tag is currently assigned to ${impact?.documentCount ?? 0} document(s). Deleting will detach it from all documents.`
              : `This tag is assigned to ${impact?.documentCount ?? 0} document(s). Merging will transfer all document associations to the selected target tag.`
          }
          onClose={closeModal}
        >
          <div className="ui-stack">
            {modalError ? <InlineAlert tone="error" title="Operation failed">{modalError}</InlineAlert> : null}
            {modalMode === 'merge' ? (
              <FormField label="Merge into target tag" required description="Select the destination tag to receive all document associations.">
                {(fieldProps) => (
                  <Select
                    {...fieldProps}
                    value={targetTagId}
                    disabled={actionInProgress}
                    onChange={(e) => setTargetTagId(e.target.value)}
                  >
                    <option value="">Select a target tag</option>
                    {tags
                      .filter((t) => t.id !== activeTag.id)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </Select>
                )}
              </FormField>
            ) : null}
            <div className="ui-cluster">
              <Button
                variant="primary"
                loading={actionInProgress}
                disabled={loadingImpact || (modalMode === 'merge' && !targetTagId)}
                onClick={confirmModalAction}
              >
                {modalMode === 'delete' ? 'Delete tag' : 'Merge tag'}
              </Button>
              <Button variant="secondary" disabled={actionInProgress} onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        </Dialog>
      ) : null}
    </section>
  );
}
