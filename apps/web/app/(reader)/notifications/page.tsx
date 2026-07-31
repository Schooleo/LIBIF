import { PageHeader } from '../../../components/layout';
import { fetchMyNotifications } from '../../../lib/api-server';
import { ReaderNotificationCenter } from '../../../components/domain/reader';

export const dynamic = 'force-dynamic';

export default async function ReaderNotificationsPage() {
  let initialNotifications: any[] = [];
  try {
    initialNotifications = await fetchMyNotifications();
  } catch {
    // If not authenticated or error, component handles fallback gracefully
  }

  return (
    <section className="ui-stack" style={{ gap: '1.5rem' }}>
      <PageHeader
        title="My Notifications"
        description="Updates regarding available documents, publication approvals, and account notices."
      />
      <ReaderNotificationCenter initialNotifications={initialNotifications} />
    </section>
  );
}
