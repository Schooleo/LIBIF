'use client';

import type { CreateBookIntakeDto } from '@libif/shared';

type Props = {
  metadata: CreateBookIntakeDto;
  onChange: (metadata: CreateBookIntakeDto) => void;
  onLookup: () => Promise<void>;
  lookupMessage?: string;
};

export function MetadataFields({ metadata, onChange, onLookup, lookupMessage }: Props) {
  const set = <K extends keyof CreateBookIntakeDto>(key: K, value: CreateBookIntakeDto[K]) => onChange({ ...metadata, [key]: value });
  return (
    <section className="grid">
      <label>
        ISBN
        <span style={{ display: 'flex', gap: 8 }}>
          <input value={metadata.isbn ?? ''} onChange={(event) => set('isbn', event.target.value)} placeholder="978..." />
          <button type="button" onClick={onLookup}>Lookup</button>
        </span>
      </label>
      {lookupMessage ? <p>{lookupMessage}</p> : null}
      <label>
        Title *
        <input aria-label="Title" value={metadata.title} onChange={(event) => set('title', event.target.value)} required />
      </label>
      <label>
        Authors * (comma separated)
        <input aria-label="Authors" value={metadata.authors.join(', ')} onChange={(event) => set('authors', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} required />
      </label>
      <label>
        Publisher
        <input value={metadata.publisher ?? ''} onChange={(event) => set('publisher', event.target.value)} />
      </label>
      <label>
        Published year
        <input type="number" value={metadata.publishedYear ?? ''} onChange={(event) => set('publishedYear', event.target.value ? Number(event.target.value) : undefined)} />
      </label>
      <label>
        Description
        <textarea value={metadata.description ?? ''} onChange={(event) => set('description', event.target.value)} rows={4} />
      </label>
    </section>
  );
}
