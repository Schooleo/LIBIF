import { Fragment, type ReactNode } from 'react';
import { Button } from '../actions/Button';
import { EmptyState } from '../feedback/feedback';

export type SortDirection = 'ascending' | 'descending';
export type DataTableFilterValue = string | number | boolean | null | undefined | string[];
export type DataTableState = {
  page: number;
  pageSize: number;
  sortKey?: string;
  sortDirection?: SortDirection;
  filters?: Record<string, DataTableFilterValue>;
};

export type DataColumn<T> = {
  key: string;
  header: ReactNode;
  render: (item: T) => ReactNode;
  sortable?: boolean;
  align?: 'start' | 'end';
};

export type DataTableProps<T> = {
  caption: string;
  columns: DataColumn<T>[];
  items: T[];
  getRowKey: (item: T) => string;
  emptyTitle?: string;
  state?: DataTableState;
  rowCount?: number;
  loading?: boolean;
  onStateChange?: (state: DataTableState) => void;
};

function nextSortDirection(current?: SortDirection): SortDirection | undefined {
  if (current === 'ascending') return 'descending';
  if (current === 'descending') return undefined;
  return 'ascending';
}

export function DataTable<T>({ caption, columns, items, getRowKey, emptyTitle = 'No results', state, rowCount, loading = false, onStateChange }: DataTableProps<T>) {
  const updateSort = (column: DataColumn<T>) => {
    if (!column.sortable || !state || !onStateChange) return;
    const isCurrent = state.sortKey === column.key;
    const sortDirection = nextSortDirection(isCurrent ? state.sortDirection : undefined);
    onStateChange({ ...state, page: 1, sortKey: sortDirection ? column.key : undefined, sortDirection });
  };

  if (items.length === 0 && !loading) return <EmptyState title={emptyTitle}>No matching records are available.</EmptyState>;

  return (
    <div className="ui-table-wrap" aria-busy={loading || undefined}>
      <table className="ui-table">
        <caption className="ui-sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => {
              const isCurrentSort = state?.sortKey === column.key;
              const ariaSort = isCurrentSort ? state?.sortDirection ?? 'none' : 'none';
              return (
                <th key={column.key} scope="col" aria-sort={column.sortable ? ariaSort : undefined} data-align={column.align}>
                  {column.sortable && state && onStateChange ? (
                    <button className="ui-table__sort" type="button" onClick={() => updateSort(column)}>
                      <span>{column.header}</span>
                      <span aria-hidden="true">{isCurrentSort && state.sortDirection === 'descending' ? '↓' : '↑'}</span>
                    </button>
                  ) : column.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>{items.map((item) => <tr key={getRowKey(item)}>{columns.map((column) => <td key={column.key} data-align={column.align}>{column.render(item)}</td>)}</tr>)}</tbody>
      </table>
      {state && typeof rowCount === 'number' ? <p className="ui-table__summary">Showing page {state.page} of {Math.max(1, Math.ceil(rowCount / state.pageSize))}; {rowCount} total records.</p> : null}
    </div>
  );
}

export function TableToolbar({ children, resultSummary }: { children: ReactNode; resultSummary?: ReactNode }) {
  return <div className="ui-table-toolbar"><div className="ui-cluster" role="search">{children}</div>{resultSummary ? <p>{resultSummary}</p> : null}</div>;
}

export function BulkActionBar({ selectedCount, children }: { selectedCount: number; children: ReactNode }) { return <div className="ui-alert ui-alert--info" role="status">{selectedCount} selected <span>{children}</span></div>; }

export function ColumnHeader({ children, sorted, onSort }: { children: ReactNode; sorted?: SortDirection; onSort?: () => void }) {
  if (!onSort) return <span>{children}</span>;
  return <button className="ui-table__sort" type="button" onClick={onSort}><span>{children}</span><span aria-hidden="true">{sorted === 'descending' ? '↓' : '↑'}</span></button>;
}

export function RowActions({ children }: { children: ReactNode }) { return <div className="ui-cluster">{children}</div>; }

export function Pagination({ page, totalPages, onPrevious, onNext, onPageChange }: { page: number; totalPages: number; onPrevious?: () => void; onNext?: () => void; onPageChange?: (page: number) => void }) {
  const goPrevious = onPrevious ?? (onPageChange ? () => onPageChange(page - 1) : undefined);
  const goNext = onNext ?? (onPageChange ? () => onPageChange(page + 1) : undefined);
  return <nav className="ui-pagination" aria-label="Pagination"><Button variant="secondary" onClick={goPrevious} disabled={page <= 1}>Previous</Button><span>Page {page} of {totalPages}</span><Button variant="secondary" onClick={goNext} disabled={page >= totalPages}>Next</Button></nav>;
}

export function DescriptionList({ items }: { items: { term: string; description: ReactNode }[] }) {
  return <dl className="ui-description-list">{items.map((item) => <Fragment key={item.term}><dt>{item.term}</dt><dd>{item.description}</dd></Fragment>)}</dl>;
}

export function Timeline({ items }: { items: { id: string; title: string; time?: string; detail?: ReactNode }[] }) { return <ol className="ui-timeline">{items.map((item) => <li key={item.id}><strong>{item.title}</strong>{item.time ? <time> {item.time}</time> : null}{item.detail ? <div>{item.detail}</div> : null}</li>)}</ol>; }
export function ChartCard({ title, children }: { title: string; children: ReactNode }) { return <section className="ui-card"><h2>{title}</h2>{children}</section>; }
export function KpiCard({ label, value }: { label: string; value: ReactNode }) { return <section className="ui-card ui-card--metric"><span>{label}</span><strong>{value}</strong></section>; }
