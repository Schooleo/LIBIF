import type { ReactNode } from 'react';
import { StatusBadge } from '../../ui/indicators/StatusBadge';
import { Card } from '../../ui/surfaces/Card';
import { DescriptionList } from '../../ui/data/DataTable';

type DocumentSummary = { id: string; title: string; authors?: string[]; status?: string; description?: string };

export function DocumentStatusBadge({ status }: { status: string }) { return <StatusBadge status={status} />; }
export function DocumentCard({ document, actions }: { document: DocumentSummary; actions?: ReactNode }) { return <Card><h2>{document.title}</h2>{document.authors?.length ? <p>{document.authors.join(', ')}</p> : null}{document.status ? <DocumentStatusBadge status={document.status} /> : null}{actions}</Card>; }
export function DocumentRow({ document, actions }: { document: DocumentSummary; actions?: ReactNode }) { return <article className="ui-cluster"><strong>{document.title}</strong>{document.status ? <DocumentStatusBadge status={document.status} /> : null}{actions}</article>; }
export function DocumentMetadataSummary({ title, metadata }: { title: string; metadata: { label: string; value: ReactNode }[] }) { return <Card><h2>{title}</h2><DescriptionList items={metadata.map((item) => ({ term: item.label, description: item.value }))} /></Card>; }
export function AuditTimeline({ events }: { events: { id: string; title: string; time?: string; detail?: ReactNode }[] }) { return <ol className="ui-timeline">{events.map((event) => <li key={event.id}><strong>{event.title}</strong>{event.time ? <time> {event.time}</time> : null}{event.detail}</li>)}</ol>; }
