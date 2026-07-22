'use client';

import type { CategoryDto, TagDto } from '@libif/shared';
import { useState } from 'react';
import { CategorySelector, TagSelector } from '../taxonomy';
import { FormField } from '../../ui/forms/FormField';
import { TextInput, Textarea, Select } from '../../ui/forms/inputs';
import { Button } from '../../ui/actions/Button';
import { InlineAlert } from '../../ui/feedback/feedback';

export type CategoryOption = CategoryDto;
export type TagOption = TagDto;

export type DocumentMetadataFormValues = {
  title: string;
  subtitle: string;
  description: string;
  publisher: string;
  publishedYear: string;
  language: string;
  isbn: string;
  categoryId: string;
  authors: string; // comma-separated
  tags: string; // comma-separated
};

interface DocumentMetadataFormProps {
  initialValues?: Partial<DocumentMetadataFormValues>;
  categories: CategoryOption[];
  tags: TagOption[];
  onSubmit: (values: DocumentMetadataFormValues) => Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
}

export function DocumentMetadataForm({
  initialValues,
  categories,
  tags,
  onSubmit,
  submitLabel = 'Save Document Metadata',
  isLoading = false
}: DocumentMetadataFormProps) {
  const [form, setForm] = useState<DocumentMetadataFormValues>({
    title: initialValues?.title ?? '',
    subtitle: initialValues?.subtitle ?? '',
    description: initialValues?.description ?? '',
    publisher: initialValues?.publisher ?? '',
    publishedYear: initialValues?.publishedYear ?? '',
    language: initialValues?.language ?? 'vi',
    isbn: initialValues?.isbn ?? '',
    categoryId: initialValues?.categoryId ?? '',
    authors: initialValues?.authors ?? '',
    tags: initialValues?.tags ?? ''
  });

  const [isbnLookupLoading, setIsbnLookupLoading] = useState(false);
  const [isbnLookupMessage, setIsbnLookupMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const selectedTagNames = form.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  const selectedTagIds = tags.filter((tag) => selectedTagNames.includes(tag.name)).map((tag) => tag.id);

  const handleChange = (field: keyof DocumentMetadataFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleIsbnLookup = async () => {
    if (!form.isbn.trim()) {
      setIsbnLookupMessage('Please enter an ISBN first.');
      return;
    }
    setIsbnLookupLoading(true);
    setIsbnLookupMessage(null);
    try {
      const res = await fetch(`/api/isbn/lookup?isbn=${encodeURIComponent(form.isbn.trim())}`);
      if (!res.ok) throw new Error('ISBN metadata not found.');
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        title: data.title || prev.title,
        subtitle: data.subtitle || prev.subtitle,
        description: data.description || prev.description,
        publisher: data.publisher || prev.publisher,
        publishedYear: data.publishedYear ? String(data.publishedYear) : prev.publishedYear,
        authors: data.authors?.length ? data.authors.join(', ') : prev.authors,
        language: data.language || prev.language
      }));
      setIsbnLookupMessage('Metadata prefilled from ISBN.');
    } catch (err) {
      setIsbnLookupMessage((err as Error).message || 'ISBN lookup failed.');
    } finally {
      setIsbnLookupLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!form.title.trim()) { setErrorMsg('Document title is required.'); return; }
    if (!form.authors.trim()) { setErrorMsg('At least one author is required.'); return; }
    try {
      await onSubmit(form);
    } catch (err) {
      setErrorMsg((err as Error).message || 'Failed to submit metadata.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ui-stack ui-stack-lg" noValidate>
      {errorMsg ? <InlineAlert tone="error">{errorMsg}</InlineAlert> : null}
      {isbnLookupMessage ? (
        <InlineAlert tone={isbnLookupMessage.includes('prefilled') ? 'success' : 'info'}>
          {isbnLookupMessage}
        </InlineAlert>
      ) : null}

      <div className="ui-cluster ui-cluster-align-end">
        <div style={{ flex: 1 }}>
          <FormField label="ISBN (Optional)" description="ISBN-10 or ISBN-13 for auto-enrichment">
            {(fp) => (
              <TextInput
                {...fp}
                value={form.isbn}
                onChange={(e) => handleChange('isbn', e.target.value)}
                placeholder="e.g. 9780132350884"
              />
            )}
          </FormField>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={handleIsbnLookup}
          disabled={isbnLookupLoading || !form.isbn.trim()}
        >
          {isbnLookupLoading ? 'Looking up...' : 'Prefill from ISBN'}
        </Button>
      </div>

      <FormField label="Document Title" required>
        {(fp) => (
          <TextInput
            {...fp}
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g. Artificial Intelligence: A Modern Approach"
            required
          />
        )}
      </FormField>

      <FormField label="Subtitle">
        {(fp) => (
          <TextInput
            {...fp}
            value={form.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            placeholder="e.g. 4th Edition"
          />
        )}
      </FormField>

      <FormField label="Authors" required description="Separate multiple authors with commas">
        {(fp) => (
          <TextInput
            {...fp}
            value={form.authors}
            onChange={(e) => handleChange('authors', e.target.value)}
            placeholder="e.g. Stuart Russell, Peter Norvig"
            required
          />
        )}
      </FormField>

      <div className="ui-grid ui-grid-cols-2">
        <CategorySelector
          categories={categories}
          value={form.categoryId}
          onChange={(categoryId) => handleChange('categoryId', categoryId ?? '')}
        />

        <FormField label="Language">
          {(fp) => (
            <Select {...fp} value={form.language} onChange={(e) => handleChange('language', e.target.value)}>
              <option value="vi">Vietnamese (vi)</option>
              <option value="en">English (en)</option>
              <option value="fr">French (fr)</option>
              <option value="de">German (de)</option>
              <option value="ja">Japanese (ja)</option>
            </Select>
          )}
        </FormField>
      </div>

      <div className="ui-grid ui-grid-cols-2">
        <FormField label="Publisher">
          {(fp) => (
            <TextInput
              {...fp}
              value={form.publisher}
              onChange={(e) => handleChange('publisher', e.target.value)}
              placeholder="e.g. Pearson"
            />
          )}
        </FormField>
        <FormField label="Published Year">
          {(fp) => (
            <TextInput
              {...fp}
              type="number"
              value={form.publishedYear}
              onChange={(e) => handleChange('publishedYear', e.target.value)}
              placeholder="e.g. 2020"
            />
          )}
        </FormField>
      </div>

      <TagSelector
        tags={tags}
        value={selectedTagIds}
        onChange={(tagIds) => handleChange('tags', tags.filter((tag) => tagIds.includes(tag.id)).map((tag) => tag.name).join(', '))}
      />

      <FormField label="Description">
        {(fp) => (
          <Textarea
            {...fp}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Detailed abstract or summary of the document..."
            rows={4}
          />
        )}
      </FormField>

      <div className="ui-cluster ui-cluster-justify-end">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
