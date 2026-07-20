import { ProgressBar } from '../../ui/indicators/ProgressBar';
import { Stepper, type Step } from '../../ui/indicators/Stepper';
import { StatusBadge } from '../../ui/indicators/StatusBadge';

export function UploadWorkflow({ status, progress, steps }: { status: string; progress?: number; steps: Step[] }) {
  return <section className="ui-stack" aria-label="Upload workflow"><StatusBadge status={status} />{progress !== undefined ? <ProgressBar value={progress} label="Upload progress" /> : null}<Stepper steps={steps} /></section>;
}
