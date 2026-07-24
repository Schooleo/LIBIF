'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { UserDetailResponseDto } from '../../../lib/api-types';
import {
  changeAdminUserRole,
  deactivateAdminUser,
  reactivateAdminUser,
} from '../../../lib/api-browser';
import {
  Button,
  Card,
  DescriptionList,
  FormField,
  InlineAlert,
  Select,
  StatusBadge,
  Textarea,
  Timeline,
} from '../../ui';
import { UserRoleBadge } from './UserRoleBadge';

export function UserAdministrationPanel({ initialUser }: { initialUser: UserDetailResponseDto }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [role, setRole] = useState(initialUser.role);
  const [roleReason, setRoleReason] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [pendingAction, setPendingAction] = useState<'role' | 'status'>();
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string }>();

  async function submitRole(event: FormEvent) {
    event.preventDefault();
    setPendingAction('role');
    setMessage(undefined);
    try {
      const updated = await changeAdminUserRole(user.id, { role, reason: roleReason });
      setUser(updated);
      setRole(updated.role);
      setRoleReason('');
      setMessage({ tone: 'success', text: 'Role updated and active sessions revoked.' });
      router.refresh();
    } catch (error) {
      setMessage({ tone: 'error', text: errorMessage(error) });
    } finally {
      setPendingAction(undefined);
    }
  }

  async function submitStatus(event: FormEvent) {
    event.preventDefault();
    setPendingAction('status');
    setMessage(undefined);
    try {
      const updated = user.status === 'ACTIVE'
        ? await deactivateAdminUser(user.id, { reason: statusReason })
        : await reactivateAdminUser(user.id, { reason: statusReason });
      setUser(updated);
      setStatusReason('');
      setMessage({
        tone: 'success',
        text: updated.status === 'ACTIVE' ? 'Account reactivated.' : 'Account deactivated and active sessions revoked.',
      });
      router.refresh();
    } catch (error) {
      setMessage({ tone: 'error', text: errorMessage(error) });
    } finally {
      setPendingAction(undefined);
    }
  }

  return (
    <div className="ui-stack">
      {message ? <InlineAlert tone={message.tone}>{message.text}</InlineAlert> : null}
      <Card className="ui-stack">
        <div className="ui-cluster">
          <UserRoleBadge role={user.role} />
          <StatusBadge status={user.status} />
        </div>
        <DescriptionList items={[
          { term: 'Email', description: user.email },
          { term: 'Active sessions', description: user.activeSessionCount },
          { term: 'Created', description: formatDateTime(user.createdAt) },
          { term: 'Last sign-in', description: user.lastSignInAt ? formatDateTime(user.lastSignInAt) : 'Never' },
        ]} />
      </Card>

      <div className="ui-grid ui-grid-cols-2">
        <Card>
          <form className="ui-stack" onSubmit={submitRole}>
            <h2>Change role</h2>
            <FormField label="Role" required>
              {(props) => (
                <Select {...props} value={role} onChange={(event) => setRole(event.target.value as typeof role)}>
                  <option value="ADMIN">Administrator</option>
                  <option value="LIBRARIAN">Librarian</option>
                  <option value="READER">Reader</option>
                </Select>
              )}
            </FormField>
            <FormField label="Reason" required description="Recorded in the immutable administration audit trail.">
              {(props) => <Textarea {...props} value={roleReason} onChange={(event) => setRoleReason(event.target.value)} required maxLength={500} />}
            </FormField>
            <Button type="submit" loading={pendingAction === 'role'} disabled={role === user.role || !roleReason.trim()}>
              Save role
            </Button>
          </form>
        </Card>

        <Card>
          <form className="ui-stack" onSubmit={submitStatus}>
            <h2>{user.status === 'ACTIVE' ? 'Deactivate account' : 'Reactivate account'}</h2>
            <p>
              {user.status === 'ACTIVE'
                ? 'Deactivation revokes current sessions and prevents future sign-in.'
                : 'Reactivation restores sign-in without restoring revoked sessions.'}
            </p>
            <FormField label="Reason" required description="Recorded in the immutable administration audit trail.">
              {(props) => <Textarea {...props} value={statusReason} onChange={(event) => setStatusReason(event.target.value)} required maxLength={500} />}
            </FormField>
            <Button
              type="submit"
              variant={user.status === 'ACTIVE' ? 'destructive' : 'primary'}
              loading={pendingAction === 'status'}
              disabled={!statusReason.trim()}
            >
              {user.status === 'ACTIVE' ? 'Deactivate account' : 'Reactivate account'}
            </Button>
          </form>
        </Card>
      </div>

      <Card className="ui-stack">
        <h2>Session summary</h2>
        <DescriptionList items={[
          { term: 'Active', description: user.sessionSummary.activeCount },
          { term: 'Revoked', description: user.sessionSummary.revokedCount },
          { term: 'Expired', description: user.sessionSummary.expiredCount },
          {
            term: 'Most recent activity',
            description: user.sessionSummary.mostRecentLastSeenAt
              ? formatDateTime(user.sessionSummary.mostRecentLastSeenAt)
              : 'No session activity',
          },
        ]} />
      </Card>

      <Card className="ui-stack">
        <h2>Administration history</h2>
        {user.administrationEvents.length > 0 ? (
          <Timeline items={user.administrationEvents.map((event) => ({
            id: event.id,
            title: formatAction(event.action),
            time: formatDateTime(event.createdAt),
            detail: (
              <span>
                {event.previousRole && event.nextRole ? `${event.previousRole} → ${event.nextRole}. ` : ''}
                {event.reason || 'No reason recorded.'}
                {event.actorEmail ? ` By ${event.actorEmail}.` : ''}
              </span>
            ),
          }))} />
        ) : <p>No administration changes have been recorded.</p>}
      </Card>
    </div>
  );
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function formatAction(value: string): string {
  return value.toLowerCase().split('_').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unexpected administration error';
}
