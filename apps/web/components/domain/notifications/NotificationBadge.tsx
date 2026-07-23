import { Badge } from '../../ui';

interface NotificationBadgeProps {
  count: number;
  maxVisibleCount?: number;
}

export function NotificationBadge({ count, maxVisibleCount = 99 }: NotificationBadgeProps) {
  if (count <= 0) return null;

  const visualCount = count > maxVisibleCount ? `${maxVisibleCount}+` : String(count);

  return (
    <span aria-hidden="true">
      <Badge tone="info">{visualCount}</Badge>
    </span>
  );
}
