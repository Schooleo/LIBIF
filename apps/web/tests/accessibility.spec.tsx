import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ComponentCatalogue } from '../components/catalogue/ComponentCatalogue';

describe('component catalogue accessibility', () => {
  it('has no automated axe violations in the default catalogue render', async () => {
    const { container } = render(<ComponentCatalogue />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('includes narrow-container, long-content, and overlay demonstrations for responsive review', () => {
    const { container } = render(<ComponentCatalogue />);
    expect(container.querySelector('.component-catalogue__narrow')).toBeInTheDocument();
    expect(container.querySelector('.component-catalogue__long-content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open dialog/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open drawer/i })).toBeInTheDocument();
  });
});
