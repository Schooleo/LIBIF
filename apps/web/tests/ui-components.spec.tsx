import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, DataTable, Dialog, Drawer, FileDropzone, FormField, IconButton, InlineAlert, Pagination, ProgressBar, StatusBadge, TextInput, statusConfig, type DataTableState } from '../components/ui';
import { AuditTimeline, DocumentMetadataSummary, ProcessingJobSummary } from '../components/domain';

const sampleFile = new File(['%PDF-1.4'], 'book.pdf', { type: 'application/pdf' });

describe('shared UI components', () => {
  it('renders button type, disabled, and loading semantics', () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole('button', { name: /save/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('requires accessible names for icon button usage', () => {
    render(<IconButton label="Open menu" icon="☰" />);
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  it('wires FormField descriptions and errors to the input', () => {
    render(<FormField label="Title" required description="Book title" error="Required">{(props) => <TextInput {...props} />}</FormField>);
    const input = screen.getByLabelText(/title/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).toContain('description');
    expect(input.getAttribute('aria-describedby')).toContain('error');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('uses alert/status semantics for feedback', () => {
    render(<InlineAlert tone="error">Upload failed</InlineAlert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Upload failed');
  });

  it('selects a file through FileDropzone', async () => {
    const user = userEvent.setup();
    const onFile = vi.fn();
    render(<FileDropzone label="PDF file" accept="application/pdf" file={null} onFile={onFile} />);
    await user.upload(screen.getByLabelText(/pdf file/i), sampleFile);
    expect(onFile).toHaveBeenCalledWith(sampleFile);
  });

  it('renders canonical status text in addition to status markers', () => {
    const canonicalStatuses = ['archived', 'idle', 'compressing', 'performing_ocr', 'indexing', 'cancelled', 'pending_review', 'approved', 'approved_and_published', 'correction_in_progress', 'resubmitted', 'expired', 'delete_blocked', 'merge_preview', 'stale'] as const;
    for (const status of canonicalStatuses) expect(statusConfig[status]).toBeDefined();
    render(<StatusBadge status="approved_and_published" />);
    expect(screen.getByText('Approved and published')).toBeInTheDocument();
  });

  it('renders accessible progress semantics', () => {
    render(<ProgressBar value={45} label="Upload progress" />);
    expect(screen.getByRole('progressbar', { name: /upload progress/i })).toHaveAttribute('aria-valuenow', '45');
  });

  it('renders DataTable records, empty state, and controlled server-state sorting', async () => {
    const user = userEvent.setup();
    const columns = [{ key: 'name', header: 'Name', sortable: true, render: (item: { id: string; name: string }) => item.name }];
    const state: DataTableState = { page: 1, pageSize: 25, sortKey: 'name', sortDirection: 'ascending', filters: { q: 'ada' } };
    const onStateChange = vi.fn();
    const { rerender } = render(<DataTable caption="Users" columns={columns} items={[{ id: '1', name: 'Ada' }]} getRowKey={(item) => item.id} state={state} rowCount={50} onStateChange={onStateChange} />);
    expect(screen.getByRole('table', { name: /users/i })).toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText(/50 total records/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /name/i }));
    expect(onStateChange).toHaveBeenCalledWith(expect.objectContaining({ page: 1, sortKey: 'name', sortDirection: 'descending' }));
    rerender(<DataTable caption="Users" columns={columns} items={[]} getRowKey={(item) => item.id} />);
    expect(screen.getByText(/no matching records/i)).toBeInTheDocument();
  });

  it('emits controlled page changes from Pagination', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={2} totalPages={4} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: /previous/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it('closes Dialog on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    function DialogHarness() {
      const [open, setOpen] = useState(false);
      return <><Button onClick={() => setOpen(true)}>Open dialog</Button><Dialog open={open} title="Confirm" description="Confirm action" onClose={() => setOpen(false)}><Button>Approve</Button></Dialog></>;
    }
    render(<DialogHarness />);
    const trigger = screen.getByRole('button', { name: /open dialog/i });
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /approve/i })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /confirm/i })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('renders Drawer as a modal overlay with close behavior', async () => {
    const user = userEvent.setup();
    function DrawerHarness() {
      const [open, setOpen] = useState(false);
      return <><Button onClick={() => setOpen(true)}>Open filters</Button><Drawer open={open} title="Filters" onClose={() => setOpen(false)}><Button>Apply filters</Button></Drawer></>;
    }
    render(<DrawerHarness />);
    await user.click(screen.getByRole('button', { name: /open filters/i }));
    expect(screen.getByRole('dialog', { name: /filters/i })).toHaveAttribute('aria-modal', 'true');
    await user.click(screen.getByRole('button', { name: /close drawer/i }));
    expect(screen.queryByRole('dialog', { name: /filters/i })).not.toBeInTheDocument();
  });

  it('renders audit events as numbered, spaced information blocks', () => {
    render(<AuditTimeline events={[
      { id: 'audit-1', status: 'METADATA_UPDATED', time: '24/07/2026, 10:00', actor: 'admin@libif.local', detail: 'Updated title' },
      { id: 'audit-2', status: 'APPROVED', time: '24/07/2026, 11:00', detail: 'Document published' }
    ]} />);

    expect(screen.getByRole('heading', { name: /audit history timeline/i })).toBeInTheDocument();
    expect(screen.getByText('[1]')).toBeInTheDocument();
    expect(screen.getByText('[2]')).toBeInTheDocument();
    expect(screen.getAllByText('TIME')).toHaveLength(2);
    expect(screen.getAllByText('STATUS')).toHaveLength(2);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('admin@libif.local')).toBeInTheDocument();
  });

  it('renders domain summary foundations', () => {
    render(<><DocumentMetadataSummary title="Metadata" metadata={[{ label: 'Publisher', value: 'LIBIF' }]} /><ProcessingJobSummary job={{ id: 'job-1', status: 'queued', attempts: 0 }} /></>);
    expect(screen.getByText('Metadata')).toBeInTheDocument();
    expect(screen.getByText('job-1')).toBeInTheDocument();
  });
});
