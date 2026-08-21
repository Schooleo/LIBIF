import { AccessBoundaryCard } from '../../../../components/layout';

export default function PasswordResetCompletedPage() {
  return <AccessBoundaryCard title="Password reset complete" description="Your password has been updated and existing sessions were revoked. Sign in again with the new password." actionHref="/sign-in" actionLabel="Sign in" />;
}
