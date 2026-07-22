import { headers } from 'next/headers';
import { PageHeader } from '../../../../components/layout';
import { InlineAlert } from '../../../../components/ui';
import { ApprovalQueue, type ApprovalReviewItem } from '../../../../components/domain/approval/ApprovalQueue';
import { API_BASE_URL } from '../../../../lib/api-client';
import { getDevAuthHeaders } from '../../../../lib/auth/session';

async function fetchPendingApprovals(): Promise<ApprovalReviewItem[]> {
  const incomingHeaders = await headers();
  const cookie = incomingHeaders.get('cookie');
  const devHeaders = getDevAuthHeaders();

  const res = await fetch(`${API_BASE_URL}/api/admin/approvals`, {
    cache: 'no-store',
    headers: {
      ...devHeaders,
      ...(cookie ? { cookie } : {})
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch pending approvals: ${res.statusText}`);
  }

  return res.json();
}

export default async function AdminApprovalsPage() {
  let items: ApprovalReviewItem[] = [];
  let loadError: string | undefined;

  try {
    items = await fetchPendingApprovals();
  } catch (error) {
    loadError = (error as Error).message;
  }

  return (
    <section className="ui-stack">
      <PageHeader title="Approvals" />
      {loadError ? (
        <InlineAlert tone="error">
          Pending approvals could not be loaded: {loadError}
        </InlineAlert>
      ) : null}
      {!loadError && <ApprovalQueue items={items} />}
    </section>
  );
}
