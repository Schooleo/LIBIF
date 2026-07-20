import { AccessBoundaryCard } from '../../../components/layout';

export default function AccessDeniedPage() {
  return <AccessBoundaryCard title="Access denied" description="Your current role does not have permission to open this workspace. Phase 2 only represents the authorization boundary; production credential flows arrive in a later batch." actionHref="/" actionLabel="Return home" />;
}
