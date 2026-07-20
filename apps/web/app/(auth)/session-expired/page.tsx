import { AccessBoundaryCard } from '../../../components/layout';

export default function SessionExpiredPage() {
  return <AccessBoundaryCard title="Session expired" description="Your session is missing, expired, or was revoked. Sign in again to continue." actionHref="/sign-in" actionLabel="Sign in again" />;
}
