import { Badge } from '../../ui';

interface NotificationBadgeProps {
  count: number;
  maxVisibleCount?: number;
}

/**
 * Visual-only unread notification badge.
 *
 * Note on Accessibility:
 * This badge is wrapped in `aria-hidden="true"` because the outer navigation link
 * (e.g. `AdminShell` / `AdminNavigation`) provides the full accessible name
 * including the accurate unread count (e.g., "Notifications, 12 unread").
 */
export function NotificationBadge({ count, maxVisibleCount = 99 }: NotificationBadgeProps) {
  if (count <= 0) return null;

  const visualCount = count > maxVisibleCount ? `${maxVisibleCount}+` : String(count);

  return (
    <span aria-hidden="true">
      <Badge tone="info">{visualCount}</Badge>
    </span>
  );
}
