import { PageHeader } from '../../../../components/layout';
import { ApprovalQueue } from '../../../../components/domain/approval/ApprovalQueue';

export default function AdminApprovalsPage() {
  return (
    <section className="ui-stack">
      <PageHeader title="Approvals" />
      <ApprovalQueue />
    </section>
  );
}
