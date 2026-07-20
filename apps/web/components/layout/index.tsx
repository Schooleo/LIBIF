import type { ReactNode } from 'react';

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return <header className="ui-stack"><div className="ui-cluster"><h1>{title}</h1>{actions}</div>{description ? <p>{description}</p> : null}</header>;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav aria-label="Breadcrumb"><ol className="ui-cluster">{items.map((item) => <li key={item.label}>{item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}</li>)}</ol></nav>;
}

export function Tabs({ tabs }: { tabs: { label: string; href: string; active?: boolean }[] }) {
  return <nav aria-label="Tabs" className="ui-cluster">{tabs.map((tab) => <a key={tab.href} href={tab.href} aria-current={tab.active ? 'page' : undefined}>{tab.label}</a>)}</nav>;
}
