import type { ReactNode } from 'react';
import { classNames } from '../../../lib/classnames';
import type { Tone } from '../types';

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={classNames('ui-badge', `ui-badge--${tone}`, className)}>{children}</span>;
}
