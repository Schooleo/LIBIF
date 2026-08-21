import { StatusBadge } from '../../ui/indicators/StatusBadge';

export function ProcessingStatusBadge({ status }: { status: string }) {
  const statusUpper = status.toUpperCase();
  if (statusUpper === 'SUCCEEDED') {
    return <StatusBadge status="completed" />;
  }
  return <StatusBadge status={status.toLowerCase()} />;
}
