'use client';

import { Button } from '../../ui/actions/Button';

interface ProcessingActionsProps {
  jobId: string;
  status: string;
  onRetry?: () => void;
  onCancel?: () => void;
}

export function ProcessingActions({ jobId, status, onRetry, onCancel }: ProcessingActionsProps) {
  const isFailed = status.toUpperCase() === 'FAILED';
  const isRunning = status.toUpperCase() === 'RUNNING' || status.toUpperCase() === 'QUEUED';

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      alert(`Retry requested for job ${jobId}`);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      alert(`Cancel requested for job ${jobId}`);
    }
  };

  return (
    <div className="flex gap-2">
      {isFailed && (
        <Button variant="secondary" size="sm" onClick={handleRetry}>
          Retry Job
        </Button>
      )}
      {isRunning && (
        <Button variant="secondary" size="sm" onClick={handleCancel}>
          Cancel Job
        </Button>
      )}
    </div>
  );
}
