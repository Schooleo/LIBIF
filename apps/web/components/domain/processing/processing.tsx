import type { ReactNode } from 'react';
import { Card } from '../../ui/surfaces/Card';
import { StatusBadge } from '../../ui/indicators/StatusBadge';
import { Stepper } from '../../ui/indicators/Stepper';
import { DescriptionList } from '../../ui/data/DataTable';

const stageLabels = ['Validating', 'Compressing', 'Performing OCR', 'Indexing'];

export function ProcessingStageStepper({ currentStage }: { currentStage: string }) {
  return <Stepper steps={stageLabels.map((label) => ({ id: label, label, status: label.toLowerCase().replaceAll(' ', '_') === currentStage ? 'current' : 'upcoming' }))} label="Processing stages" />;
}

export function ProcessingJobSummary({ job }: { job: { id: string; status: string; attempts?: number; detail?: ReactNode } }) {
  return <Card><h2>Processing job</h2><StatusBadge status={job.status} /><DescriptionList items={[{ term: 'Job ID', description: job.id }, { term: 'Attempts', description: job.attempts ?? 0 }]} />{job.detail}</Card>;
}
