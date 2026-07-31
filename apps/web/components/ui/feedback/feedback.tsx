import type { ReactNode } from 'react';
import { classNames } from '../../../lib/classnames';
import type { Tone } from '../types';

export function InlineAlert({ tone = 'info', title, children }: { tone?: Tone; title?: string; children: ReactNode }) {
  const role = tone === 'error' || tone === 'warning' ? 'alert' : 'status';
  return <div className={classNames('ui-alert', `ui-alert--${tone}`)} role={role}>{title ? <strong>{title}</strong> : null}<div>{children}</div></div>;
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return <section className="ui-empty"><h2>{title}</h2>{children ? <div>{children}</div> : null}{action}</section>;
}

export function ResultState({ title, tone = 'success', children, action }: { title: string; tone?: Tone; children?: ReactNode; action?: ReactNode }) {
  return <section className={classNames('ui-result', `ui-alert--${tone}`)} aria-live="polite"><h2>{title}</h2>{children ? <div>{children}</div> : null}{action}</section>;
}

export function Toast({ children }: { children: ReactNode }) {
  return <div className="ui-alert ui-alert--info" role="status">{children}</div>;
}
