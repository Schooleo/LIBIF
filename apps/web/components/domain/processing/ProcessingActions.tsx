'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../ui/actions/Button';
import { API_BASE_URL } from '../../../lib/api-client';
import { getDevAuthHeaders } from '../../../lib/auth/session';

interface ProcessingActionsProps {
  jobId: string;
  status: string;
  onRefresh?: () => void;
}

export function ProcessingActions({ jobId, status, onRefresh }: ProcessingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusUpper = status.toUpperCase();
  const isFailed = statusUpper === 'FAILED';
  const isCanAdvance = statusUpper === 'QUEUED' || statusUpper === 'RUNNING';
  const isRunning = statusUpper === 'RUNNING' || statusUpper === 'QUEUED';

  const executeAction = async (endpoint: 'advance' | 'retry' | 'cancel') => {
    setLoading(true);
    setError(null);
    try {
      const devHeaders = getDevAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/admin/processing/jobs/${jobId}/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          ...devHeaders,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${endpoint} job`);
      }

      if (onRefresh) {
        onRefresh();
      } else {
        router.refresh();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        {isCanAdvance && (
          <Button
            variant="primary"
            size="sm"
            disabled={loading}
            onClick={() => executeAction('advance')}
          >
            {loading ? 'Processing...' : statusUpper === 'QUEUED' ? 'Start Pipeline' : 'Complete & Send to Approval'}
          </Button>
        )}
        {isFailed && (
          <Button
            variant="secondary"
            size="sm"
            disabled={loading}
            onClick={() => executeAction('retry')}
          >
            {loading ? 'Retrying...' : 'Retry Job'}
          </Button>
        )}
        {isRunning && (
          <Button
            variant="ghost"
            size="sm"
            disabled={loading}
            onClick={() => executeAction('cancel')}
          >
            Cancel
          </Button>
        )}
      </div>
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
    </div>
  );
}
