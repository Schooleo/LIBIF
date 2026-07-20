import { Badge } from './Badge';
import { statusConfig, type StatusKey } from '../status/status-config';

export function StatusBadge({ status, label }: { status: StatusKey | string; label?: string }) {
  const normalized = String(status).toLowerCase() as StatusKey;
  const config = statusConfig[normalized] ?? { label: label ?? String(status), tone: 'neutral' as const, marker: '○' };
  return <Badge tone={config.tone}><span aria-hidden="true">{config.marker}</span><span>{label ?? config.label}</span></Badge>;
}
