import { PageHeader } from '../../../../components/layout';
import { NotificationList } from '../../../../components/domain/notifications/NotificationList';

export default function AdminNotificationsPage() {
  return (
    <section className="ui-stack">
      <PageHeader title="Notifications" />
      <NotificationList />
    </section>
  );
}
