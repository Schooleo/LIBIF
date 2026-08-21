'use client';

import { useState } from 'react';
import { DocumentCard, DocumentMetadataSummary, ProcessingJobSummary, ProcessingStageStepper, UploadWorkflow, UserRoleBadge } from '../domain';
import { Badge, Button, Card, Checkbox, DataTable, Dialog, Drawer, EmptyState, FormField, IconButton, InlineAlert, Pagination, ProgressBar, ResultState, SearchInput, Select, Skeleton, StatusBadge, TableToolbar, TextInput, Textarea, type DataTableState } from '../ui';

const rows = [
  { id: 'doc-1', title: 'Digital Library Foundations and a very long multilingual catalogue title that wraps instead of clipping content', status: 'published' },
  { id: 'doc-2', title: 'OCR Pipeline Notes', status: 'performing_ocr' }
];

export function ComponentCatalogue() {
  const [tableState, setTableState] = useState<DataTableState>({ page: 1, pageSize: 10, sortKey: 'title', sortDirection: 'ascending', filters: { status: 'published' } });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <section className="ui-stack" aria-label="Component catalogue examples">
      <Card>
        <h2>Actions</h2>
        <div className="ui-cluster">
          <Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="destructive">Delete</Button><Button loading>Loading</Button><Button disabled>Disabled</Button><IconButton label="Open menu" icon="☰" />
          <Button className="component-catalogue__focus-demo" variant="secondary">Focus-visible demo</Button>
        </div>
      </Card>
      <Card><h2>Indicators</h2><div className="ui-cluster"><Badge>Neutral</Badge><StatusBadge status="published" /><StatusBadge status="failed" /><StatusBadge status="pending_review" /><StatusBadge status="delete_blocked" /><Skeleton /><ProgressBar value={64} label="Processing" /></div></Card>
      <Card><h2>Forms</h2><div className="ui-stack"><FormField label="Search" description="Catalogue query">{(props) => <SearchInput {...props} />}</FormField><FormField label="Title" required error="Title is required">{(props) => <TextInput {...props} />}</FormField><FormField label="Description">{(props) => <Textarea {...props} />}</FormField><FormField label="Category">{(props) => <Select {...props}><option>General</option></Select>}</FormField><Checkbox label="Permission restricted" /></div></Card>
      <Card><h2>Feedback</h2><div className="ui-stack"><InlineAlert tone="info">Informational message</InlineAlert><EmptyState title="Empty state">No records match the filters.</EmptyState><ResultState title="Completed">The operation finished successfully.</ResultState></div></Card>
      <Card>
        <h2>Data</h2>
        <TableToolbar resultSummary="Server-state ready: page, page size, sort, and filters are controlled by the caller."><SearchInput aria-label="Filter documents" placeholder="Filter documents" /></TableToolbar>
        <DataTable
          caption="Documents"
          items={rows}
          getRowKey={(row) => row.id}
          rowCount={42}
          state={tableState}
          onStateChange={setTableState}
          columns={[
            { key: 'title', header: 'Title', sortable: true, render: (row) => <span className="component-catalogue__long-content">{row.title}</span> },
            { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> }
          ]}
        />
        <Pagination page={tableState.page} totalPages={5} onPageChange={(page) => setTableState((current) => ({ ...current, page }))} />
      </Card>
      <Card>
        <h2>Overlay behavior</h2>
        <div className="ui-cluster"><Button onClick={() => setDialogOpen(true)}>Open dialog</Button><Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open drawer</Button></div>
        <Dialog open={dialogOpen} title="Confirm publication" description="Escape closes and focus returns to the trigger." onClose={() => setDialogOpen(false)}><p>Confirming this action uses the shared modal foundation.</p><Button>Approve</Button></Dialog>
        <Drawer open={drawerOpen} title="Filters" onClose={() => setDrawerOpen(false)}><FormField label="Status">{(props) => <Select {...props}><option>Published</option><option>Draft</option></Select>}</FormField></Drawer>
      </Card>
      <Card>
        <h2>Responsive narrow container</h2>
        <div className="component-catalogue__narrow ui-stack"><FormField label="Long title in narrow panel">{(props) => <TextInput {...props} defaultValue="A long document title should wrap with usable controls" />}</FormField><ProgressBar value={30} label="Narrow progress" /><StatusBadge status="correction_in_progress" /></div>
      </Card>
      <Card><h2>Domain</h2><div className="ui-stack"><DocumentCard document={{ id: 'doc-1', title: 'Digital Library Foundations', authors: ['LIBIF'], status: 'published' }} /><DocumentMetadataSummary title="Metadata" metadata={[{ label: 'Publisher', value: 'LIBIF' }, { label: 'Year', value: '2026' }]} /><UploadWorkflow status="uploading" progress={45} steps={[{ id: 'upload', label: 'Upload', status: 'current' }]} /><ProcessingStageStepper currentStage="compressing" /><ProcessingJobSummary job={{ id: 'job-1', status: 'queued', attempts: 0 }} /><UserRoleBadge role="LIBRARIAN" /></div></Card>
    </section>
  );
}
