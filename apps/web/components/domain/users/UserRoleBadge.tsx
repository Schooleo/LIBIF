import { Badge } from '../../ui/indicators/Badge';

export function UserRoleBadge({ role }: { role: string }) {
  return <Badge tone="info">{role.replaceAll('_', ' ')}</Badge>;
}
