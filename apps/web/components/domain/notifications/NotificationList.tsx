import { EmptyState } from '../../ui';

export function NotificationList() {
  return (
    <EmptyState title="No new notifications">
      <p className="text-neutral-500">You are all caught up! Notifications will be fully implemented in Phase 6.</p>
    </EmptyState>
  );
}
