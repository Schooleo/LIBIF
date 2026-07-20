export function Spinner({ label = 'Loading' }: { label?: string }) {
  return <span className="ui-button__spinner" role="status" aria-label={label} />;
}
