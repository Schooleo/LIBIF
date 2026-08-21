'use client';

import type { TagDto } from '@libif/shared';
import { useId } from 'react';
import { Checkbox } from '../../ui';

type TagSelectorProps = {
  tags: TagDto[];
  value: string[];
  onChange: (tagIds: string[]) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
};

export function TagSelector({ tags, value, onChange, label = 'Tags', description = 'Select every tag that applies to this document.', disabled }: TagSelectorProps) {
  const descriptionId = useId();
  const selected = new Set(value);
  const updateTag = (tagId: string, checked: boolean) => {
    if (checked) onChange([...value, tagId]);
    else onChange(value.filter((selectedId) => selectedId !== tagId));
  };

  return (
    <fieldset className="ui-stack" aria-describedby={descriptionId} disabled={disabled}>
      <legend className="ui-field__label">{label}</legend>
      <p className="ui-field__description" id={descriptionId}>{description}</p>
      {tags.length > 0 ? (
        <div className="ui-cluster">
          {tags.map((tag) => (
            <Checkbox
              key={tag.id}
              label={tag.name}
              checked={selected.has(tag.id)}
              onChange={(event) => updateTag(tag.id, event.target.checked)}
            />
          ))}
        </div>
      ) : (
        <p role="status">No tags are available.</p>
      )}
    </fieldset>
  );
}
