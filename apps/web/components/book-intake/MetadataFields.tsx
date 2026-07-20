'use client';

import type { CreateBookIntakeDto } from '@libif/shared';
import { Button, FormField, InlineAlert, Textarea, TextInput } from '../ui';

type Props = {
  metadata: CreateBookIntakeDto;
  onChange: (metadata: CreateBookIntakeDto) => void;
  onLookup: () => Promise<void>;
  lookupMessage?: string;
};

export function MetadataFields({ metadata, onChange, onLookup, lookupMessage }: Props) {
  const set = <K extends keyof CreateBookIntakeDto>(key: K, value: CreateBookIntakeDto[K]) => onChange({ ...metadata, [key]: value });
  return (
    <section className="ui-stack" aria-label="Metadata fields">
      <FormField label="ISBN" description="Use ISBN lookup when available, or enter metadata manually.">
        {(fieldProps) => (
          <div className="ui-cluster">
            <TextInput {...fieldProps} value={metadata.isbn ?? ''} onChange={(event) => set('isbn', event.target.value)} placeholder="978..." />
            <Button type="button" variant="secondary" onClick={onLookup}>Lookup</Button>
          </div>
        )}
      </FormField>
      {lookupMessage ? <InlineAlert tone="info">{lookupMessage}</InlineAlert> : null}
      <FormField label="Title" required>
        {(fieldProps) => <TextInput {...fieldProps} value={metadata.title} onChange={(event) => set('title', event.target.value)} required />}
      </FormField>
      <FormField label="Authors" required description="Separate multiple authors with commas.">
        {(fieldProps) => <TextInput {...fieldProps} value={metadata.authors.join(', ')} onChange={(event) => set('authors', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} required />}
      </FormField>
      <FormField label="Publisher">
        {(fieldProps) => <TextInput {...fieldProps} value={metadata.publisher ?? ''} onChange={(event) => set('publisher', event.target.value)} />}
      </FormField>
      <FormField label="Published year">
        {(fieldProps) => <TextInput {...fieldProps} type="number" value={metadata.publishedYear ?? ''} onChange={(event) => set('publishedYear', event.target.value ? Number(event.target.value) : undefined)} />}
      </FormField>
      <FormField label="Description">
        {(fieldProps) => <Textarea {...fieldProps} value={metadata.description ?? ''} onChange={(event) => set('description', event.target.value)} rows={4} />}
      </FormField>
    </section>
  );
}
