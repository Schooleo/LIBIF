import type { ReactNode } from 'react';
import { StatusBadge } from '../../ui/indicators/StatusBadge';
import { Card } from '../../ui/surfaces/Card';
import { DescriptionList } from '../../ui/data/DataTable';
import { InlineAlert } from '../../ui/feedback/feedback';

type DocumentSummary = { id: string; title: string; authors?: string[]; status?: string; description?: string };

export function DocumentStatusBadge({ status }: { status: string }) { return <StatusBadge status={status} />; }
export function DocumentCard({ document, actions }: { document: DocumentSummary; actions?: ReactNode }) { return <Card><h2>{document.title}</h2>{document.authors?.length ? <p>{document.authors.join(', ')}</p> : null}{document.status ? <DocumentStatusBadge status={document.status} /> : null}{actions}</Card>; }
export function DocumentRow({ document, actions }: { document: DocumentSummary; actions?: ReactNode }) { return <article className="ui-cluster"><strong>{document.title}</strong>{document.status ? <DocumentStatusBadge status={document.status} /> : null}{actions}</article>; }
export function DocumentMetadataSummary({ title, metadata }: { title: string; metadata: { label: string; value: ReactNode }[] }) { return <Card><h2>{title}</h2><DescriptionList items={metadata.map((item) => ({ term: item.label, description: item.value }))} /></Card>; }
export function AuditTimeline({ events }: { events: { id: string; status: string; time?: string; actor?: string; detail?: ReactNode }[] }) {
  return (
    <Card className="ui-stack ui-stack-tight">
      <h3>Audit History Timeline</h3>
      <ol className="ui-audit-timeline">
        {events.map((event, index) => (
          <li key={event.id} className="ui-audit-timeline__item">
            <div className="ui-audit-timeline__summary">
              <span className="ui-audit-timeline__number">[{index + 1}]</span>
              <div className="ui-audit-timeline__facts">
                <div className="ui-audit-timeline__fact">
                  <span>TIME</span>
                  {event.time ? <time>{event.time}</time> : <span>—</span>}
                </div>
                <div className="ui-audit-timeline__fact">
                  <span>STATUS</span>
                  <strong>{event.status}</strong>
                </div>
              </div>
            </div>
            {event.actor ? <p><strong>Actor:</strong> {event.actor}</p> : null}
            {event.detail ? <p><strong>Details:</strong> {event.detail}</p> : null}
          </li>
        ))}
      </ol>
    </Card>
  );
}

export interface ApprovalReviewItem {
  id: string;
  status: string;
  reason?: string | null;
  requestedChanges?: string | null;
  reviewerEmail?: string | null;
  decidedAt?: string | null;
  createdAt: string;
}

export function ApprovalHistoryTimeline({ reviews }: { reviews: ApprovalReviewItem[] }) {
  if (!reviews || reviews.length === 0) return null;
  return (
    <Card className="ui-stack ui-stack-tight">
      <h3>Approval &amp; Review History</h3>
      <ol className="ui-timeline">
        {reviews.map((rev) => (
          <li key={rev.id} className="ui-stack ui-stack-tight">
            <div className="ui-cluster ui-cluster-justify-between">
              <span className="ui-cluster">
                <strong>Status:</strong> <StatusBadge status={rev.status} />
              </span>
              <time className="ui-text-sm ui-text-muted">
                {new Date(rev.decidedAt || rev.createdAt).toLocaleString()}
              </time>
            </div>
            {rev.reviewerEmail ? (
              <p className="ui-text-sm ui-text-muted">Reviewer: {rev.reviewerEmail}</p>
            ) : null}
            {rev.reason ? <p className="ui-text-sm"><strong>Reason:</strong> {rev.reason}</p> : null}
            {rev.requestedChanges ? (
              <p className="ui-text-sm" style={{ color: 'var(--color-warning-700, #b45309)' }}>
                <strong>Requested Changes:</strong> {rev.requestedChanges}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </Card>
  );
}

export function CorrectionNotice({
  reason,
  requestedChanges,
  actions
}: {
  reason?: string | null;
  requestedChanges?: string | null;
  actions?: ReactNode;
}) {
  return (
    <InlineAlert tone="warning" title="Metadata or File Correction Required">
      <div className="ui-stack ui-stack-tight">
        {reason ? <p><strong>Rejection Reason:</strong> {reason}</p> : null}
        {requestedChanges ? <p><strong>Requested Changes:</strong> {requestedChanges}</p> : null}
        {!reason && !requestedChanges ? (
          <p>This document requires correction before it can be published.</p>
        ) : null}
        {actions ? <div className="ui-cluster" style={{ marginTop: '0.5rem' }}>{actions}</div> : null}
      </div>
    </InlineAlert>
  );
}

