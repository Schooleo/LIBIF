import { headers } from 'next/headers';
import Link from 'next/link';
import { PageHeader } from '../../../../../components/layout';
import { InlineAlert } from '../../../../../components/ui';
import { ApprovalReviewWorkspace } from '../../../../../components/domain/approval/ApprovalReviewWorkspace';
import { getApiBaseUrl } from '../../../../../lib/api-client';
import { getDevAuthHeaders } from '../../../../../lib/auth/session';
import type { ApprovalReviewItem } from '../../../../../components/domain/approval/ApprovalQueue';

async function fetchApprovalReview(id: string): Promise<ApprovalReviewItem> {
  const incomingHeaders = await headers();
  const cookie = incomingHeaders.get('cookie');
  const devHeaders = getDevAuthHeaders();

  const res = await fetch(`${getApiBaseUrl()}/api/admin/approvals/${id}`, {
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

      {review ? <ApprovalReviewWorkspace review={review} /> : null}
    </section>
  );
}
