import { headers } from 'next/headers';
import Link from 'next/link';
import { PageHeader } from '../../../../../components/layout';
import { InlineAlert } from '../../../../../components/ui';
import { Card } from '../../../../../components/ui/surfaces/Card';
import { DescriptionList } from '../../../../../components/ui/data/DataTable';
import { StatusBadge } from '../../../../../components/ui/indicators/StatusBadge';
import { ApprovalReviewPanel } from '../../../../../components/domain/approval/ApprovalReviewPanel';
import { API_BASE_URL } from '../../../../../lib/api-client';
import { getDevAuthHeaders } from '../../../../../lib/auth/session';
import type { ApprovalReviewItem } from '../../../../../components/domain/approval/ApprovalQueue';

async function fetchApprovalReview(id: string): Promise<ApprovalReviewItem> {
  const incomingHeaders = await headers();
  const cookie = incomingHeaders.get('cookie');
  const devHeaders = getDevAuthHeaders();

  const res = await fetch(`${API_BASE_URL}/api/admin/approvals/${id}`, {
    cache: 'no-store',
    headers: {
      ...devHeaders,
      ...(cookie ? { cookie } : {})
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch approval review ${id}: ${res.statusText}`);
  }

  return res.json();
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminApprovalReviewDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const reviewId = resolvedParams.id;
  let review: ApprovalReviewItem | undefined;
  let loadError: string | undefined;

  try {
    review = await fetchApprovalReview(reviewId);
  } catch (error) {
    loadError = (error as Error).message;
  }

  return (
    <section className="ui-stack">
      <div className="flex justify-between items-center">
        <PageHeader title={review?.bookTitle ? `Review: ${review.bookTitle}` : `Review Details: ${reviewId}`} />
        <Link href="/admin/approvals" className="ui-link text-sm">
          &larr; Back to queue
        </Link>
      </div>

      {loadError ? (
        <InlineAlert tone="error">
          Approval review details could not be loaded: {loadError}
        </InlineAlert>
      ) : null}

      {review && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 ui-stack">
            <Card>
              <h2 className="text-lg font-semibold mb-4">Review Information</h2>
              <DescriptionList
                items={[
                  { term: 'Document Title', description: <strong>{review.bookTitle || 'Untitled'}</strong> },
                  { term: 'Review ID', description: <span className="font-mono">{review.id}</span> },
                  { term: 'Book ID', description: <span className="font-mono">{review.bookId}</span> },
                  { term: 'Review Round', description: `Round #${review.round ?? 1}` },
                  { term: 'Current Status', description: <StatusBadge status={review.status.toLowerCase()} label={review.status} /> },
                  { term: 'Reason / Comment', description: review.reason || 'N/A' },
                  { term: 'Submitted Date', description: new Date(review.createdAt).toLocaleString() },
                  { term: 'Updated Date', description: new Date(review.updatedAt).toLocaleString() }
                ]}
              />
            </Card>
          </div>

          <div className="ui-stack">
            <Card>
              <h2 className="text-lg font-semibold mb-4">Review Decision</h2>
              <ApprovalReviewPanel
                reviewId={review.id}
                bookId={review.bookId}
                bookTitle={review.bookTitle}
                status={review.status}
              />
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}
