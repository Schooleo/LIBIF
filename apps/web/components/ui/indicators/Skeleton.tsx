export function Skeleton({ label = 'Loading content' }: { label?: string }) {
  return <span className="ui-skeleton" role="status" aria-label={label} />;
}
