import { Badge } from '../../ui';

interface NotificationBadgeProps {
  count: number;
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return null;
  return (
    <Badge tone="info">
      {count}
    </Badge>
  );
}
