export type Step = { id: string; label: string; status?: 'complete' | 'current' | 'upcoming' | 'error' };

export function Stepper({ steps, label = 'Workflow progress' }: { steps: Step[]; label?: string }) {
  return (
    <ol className="ui-stepper" aria-label={label}>
      {steps.map((step) => <li key={step.id} className="ui-stepper__item" aria-current={step.status === 'current' ? 'step' : undefined}><span aria-hidden="true">{step.status === 'complete' ? '●' : '○'}</span>{step.label}</li>)}
    </ol>
  );
}
