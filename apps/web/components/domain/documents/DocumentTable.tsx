import Link from 'next/link';
import { StatusBadge } from '../../ui/indicators/StatusBadge';
import { Button } from '../../ui/actions/Button';
import { DataTable, type DataColumn } from '../../ui/data/DataTable';

export type DocumentTableItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  authors: string[];
  category?: string | null;
  status: string;
  activeFile?: { originalFilename: string; sizeBytes: string; version: number } | null;
  updatedAt: string;
};

interface DocumentTableProps {
  documents: DocumentTableItem[];
  emptyMessage?: string;
}

export function DocumentTable({ documents, emptyMessage = 'No document records found.' }: DocumentTableProps) {
  const columns: DataColumn<DocumentTableItem>[] = [
    {
      key: 'title',
      header: 'Title & Subtitle',
      render: (item) => (
        <div className="ui-stack ui-stack-tight">
          <Link href={`/admin/documents/${item.id}`} className="ui-link-bold">
            {item.title}
          </Link>
          {item.subtitle ? <span className="ui-text-sm ui-text-muted">{item.subtitle}</span> : null}
        </div>
      )
    },
    {
      key: 'authors',
      header: 'Authors',
      render: (item) => <span>{item.authors.length > 0 ? item.authors.join(', ') : '—'}</span>
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) => <span>{item.category ?? '—'}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      key: 'activeFile',
      header: 'Active File',
      render: (item) => (
        <span>
          {item.activeFile
            ? `${item.activeFile.originalFilename} (v${item.activeFile.version})`
            : 'No file'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="ui-cluster">
          <Link href={`/admin/documents/${item.id}`}>
            <Button size="sm" variant="secondary">View</Button>
          </Link>
          <Link href={`/admin/documents/${item.id}/edit`}>
            <Button size="sm" variant="ghost">Edit</Button>
          </Link>
        </div>
      )
    }
  ];

  return (
    <DataTable
      caption="Admin document management list"
      columns={columns}
      items={documents}
      getRowKey={(item) => item.id}
      emptyTitle={emptyMessage}
    />
  );
}
