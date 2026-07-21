import { StatusBadge } from '../../ui/indicators/StatusBadge';

export function ProcessingStatusBadge({ status }: { status: string }) {
  let displayStatus = status.toLowerCase();
  if (displayStatus === 'succeeded') {
    displayStatus = 'completed';
  }
  return <StatusBadge status={displayStatus} />;
}
