import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../../lib/classnames';

export function Card({ children, compact = false, metric = false, className, ...props }: HTMLAttributes<HTMLElement> & { children: ReactNode; compact?: boolean; metric?: boolean }) {
  return <section {...props} className={classNames('ui-card', compact && 'ui-card--compact', metric && 'ui-card--metric', className)}>{children}</section>;
}

export function Panel(props: HTMLAttributes<HTMLElement> & { children: ReactNode; compact?: boolean }) {
  return <Card {...props} className={classNames('ui-panel', props.className)} />;
}

export function MetricCard({ label, value, description }: { label: string; value: ReactNode; description?: string }) {
  return <Card metric><span className="ui-field__description">{label}</span><strong>{value}</strong>{description ? <span>{description}</span> : null}</Card>;
}

export function SelectableCard({ selected, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean; children: ReactNode }) {
  return <button {...props} type={props.type ?? 'button'} aria-pressed={selected} className={classNames('ui-card', 'ui-selectable-card', props.className)}>{children}</button>;
}
