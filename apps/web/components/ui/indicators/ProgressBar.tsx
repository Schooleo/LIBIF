export function ProgressBar({ value, max = 100, label = 'Progress' }: { value: number; max?: number; label?: string }) {
  const safeMax = Math.max(1, max);
  const safeValue = Math.max(0, Math.min(value, safeMax));
  const percent = Math.round((safeValue / safeMax) * 100);
  return (
    <div className="ui-progress">
      <div className="ui-cluster"><span>{label}</span><strong>{percent}%</strong></div>
      <div className="ui-progress__track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue}>
        <div className="ui-progress__bar" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
