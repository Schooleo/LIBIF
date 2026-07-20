import { AccessBoundaryCard } from '../../../components/layout';

export default function AccessDeniedPage() {
  return <AccessBoundaryCard title="Access denied" description="Your signed-in account does not have permission to open this workspace. Sign in with a staff account or return to the reader catalogue." actionHref="/sign-in" actionLabel="Sign in" />;
}
