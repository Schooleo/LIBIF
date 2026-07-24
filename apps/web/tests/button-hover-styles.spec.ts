import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const componentStyles = readFileSync(resolve(__dirname, '../styles/components.css'), 'utf8');

describe('shared button hover styles', () => {
  it('preserves the primary brand colour instead of replacing it with the global teal hover colour', () => {
    expect(componentStyles).toContain(
      ".ui-button--primary:hover:not(:disabled):not([aria-disabled='true']) { background: var(--color-action-primary);",
    );
    expect(componentStyles).not.toContain(
      '.ui-button--primary:hover { background: var(--color-interactive-hover);',
    );
  });

  it('defines guarded hover states for the shared secondary, ghost, destructive, and link variants', () => {
    for (const variant of ['secondary', 'ghost', 'destructive', 'link']) {
      expect(componentStyles).toContain(
        `.ui-button--${variant}:hover:not(:disabled):not([aria-disabled='true'])`,
      );
    }
  });
});
