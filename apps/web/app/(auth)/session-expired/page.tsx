import { AccessBoundaryCard } from '../../../components/layout';

export default function SessionExpiredPage() {
  return <AccessBoundaryCard title="Session expired" description="The app can now route users to a session boundary state. Full sign-in and recovery flows remain deferred until the authentication batch." actionHref="/" actionLabel="Return home" />;
}
