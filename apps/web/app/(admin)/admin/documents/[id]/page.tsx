import Link from 'next/link';
import { PageHeader } from '../../../../../components/layout';
import { Button } from '../../../../../components/ui/actions/Button';
import { InlineAlert } from '../../../../../components/ui/feedback/feedback';
import { DocumentMetadataSummary, AuditTimeline, ApprovalHistoryTimeline, CorrectionNotice } from '../../../../../components/domain/documents/documents';
import { UploadLifecyclePanel } from '../../../../../components/domain/upload/UploadLifecyclePanel';
import { fetchDocumentDetail } from '../../../../../lib/api-server';

interface DocumentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  const { id } = await params;
  let doc: any = null;
  let loadError: string | undefined;

  try {
    doc = await fetchDocumentDetail(id);
  } catch (err) {
    loadError = (err as Error).message;
  }

  if (loadError || !doc) {
    return (
      <section className="ui-stack">
        <PageHeader title="Document Detail" />
        <InlineAlert tone="error">Failed to load document record: {loadError || 'Not found'}</InlineAlert>
        <Link href="/admin/documents">
          <Button variant="secondary">Return to Documents List</Button>
        </Link>
      </section>
    );
  }

  const isCorrectionRequired = doc.status === 'REJECTED' || doc.latestApprovalReview?.status === 'CORRECTION_REQUESTED';

  const metadataItems = [
    { label: 'Status', value: doc.status },
    { label: 'Authors', value: doc.authors?.map((a: any) => a.name).join(', ') || '—' },
    { label: 'Category', value: doc.category?.name || '—' },
    { label: 'Tags', value: doc.tags?.map((t: any) => t.name).join(', ') || '—' },
    { label: 'ISBN', value: doc.isbn || '—' },
    { label: 'Publisher', value: doc.publisher || '—' },
    { label: 'Published Year', value: doc.publishedYear ? String(doc.publishedYear) : '—' },
    { label: 'Language', value: doc.language || 'vi' },
    { label: 'Description', value: doc.description || '—' }
  ];

  const auditEvents = doc.auditHistory?.map((evt: any) => ({
    id: evt.id,
    title: `${evt.action}${evt.actorEmail ? ` by ${evt.actorEmail}` : ''}`,
    time: new Date(evt.createdAt).toLocaleString(),
    detail: evt.message
  })) ?? [];

  return (
    <section className="ui-stack ui-stack-lg">
      <PageHeader
        title={doc.title}
        description={doc.subtitle ?? `Document ID: ${doc.id}`}
        actions={
          <div className="ui-cluster">
            <Link href={`/admin/documents/${doc.id}/edit`}>
              <Button variant="primary">Edit Metadata</Button>
            </Link>
            <Link href="/admin/documents">
              <Button variant="secondary">Back to List</Button>
            </Link>
          </div>
        }
      />

      {isCorrectionRequired ? (
        <CorrectionNotice
          reason={doc.latestApprovalReview?.reason}
          requestedChanges={doc.latestApprovalReview?.requestedChanges}
          actions={
            <div className="ui-cluster">
              <Link href={`/admin/documents/${doc.id}/edit`}>
                <Button variant="primary" size="sm">Edit Metadata to Correct</Button>
              </Link>
            </div>
          }
        />
      ) : null}

      <div className="ui-grid ui-grid-cols-2">
        <div className="ui-stack ui-stack-md">
          <DocumentMetadataSummary title="Document Metadata" metadata={metadataItems} />
          {doc.approvalHistory?.length > 0 ? (
            <ApprovalHistoryTimeline reviews={doc.approvalHistory} />
          ) : null}
          {auditEvents.length > 0 ? (
            <div className="ui-stack ui-stack-tight">
              <h3>Audit History Timeline</h3>
              <AuditTimeline events={auditEvents} />
            </div>
          ) : null}
        </div>

        <div>
          <UploadLifecyclePanel
            documentId={doc.id}
            activeFile={doc.activeFile}
            fileVersions={doc.files}
            activeJob={doc.activeProcessingJob}
          />
        </div>
      </div>
    </section>
  );
}

