'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../../ui/surfaces/Card';
import { StatusBadge } from '../../ui/indicators/StatusBadge';
import { ProgressBar } from '../../ui/indicators/ProgressBar';
import { Button } from '../../ui/actions/Button';
import { FileDropzone } from '../../ui/forms/FileDropzone';
import { InlineAlert } from '../../ui/feedback/feedback';
import { replaceDocumentFile, submitDocumentProcessing } from '../../../lib/api-browser';

export type FileVersionInfo = {
  id: string;
  originalFilename: string;
  sizeBytes: string;
  version: number;
  status: string;
  createdAt: string;
};

export type ActiveJobInfo = {
  id: string;
  status: string;
  stage?: string | null;
  progressPercent: number;
  errorMessage?: string | null;
  updatedAt: string;
};

interface UploadLifecyclePanelProps {
  documentId: string;
  activeFile?: FileVersionInfo | null;
  fileVersions?: FileVersionInfo[];
  activeJob?: ActiveJobInfo | null;
  onFileReplaced?: () => void;
  onProcessingSubmitted?: () => void;
}

export function UploadLifecyclePanel({
  documentId,
  activeFile,
  fileVersions = [],
  activeJob,
  onFileReplaced,
  onProcessingSubmitted
}: UploadLifecyclePanelProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleReplaceFile = async () => {
    if (!selectedFile) return;
    setIsReplacing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await replaceDocumentFile(documentId, selectedFile);
      setSuccessMsg(`File successfully replaced with "${selectedFile.name}".`);
      setSelectedFile(null);
      router.refresh();
      if (onFileReplaced) onFileReplaced();
    } catch (err) {
      setErrorMsg((err as Error).message || 'Failed to replace file.');
    } finally {
      setIsReplacing(false);
    }
  };

  const handleSubmitProcessing = async () => {
    setIsSubmittingJob(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await submitDocumentProcessing(documentId);
      setSuccessMsg('Processing job queued successfully.');
      router.refresh();
      if (onProcessingSubmitted) onProcessingSubmitted();
    } catch (err) {
      setErrorMsg((err as Error).message || 'Failed to submit processing.');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  return (
    <Card className="ui-stack ui-stack-md">
      <div className="ui-cluster ui-cluster-justify-between">
        <h3>File &amp; Intake Lifecycle</h3>
        <StatusBadge status={activeJob?.status ?? 'PENDING_PROCESSING'} />
      </div>

      {errorMsg ? <InlineAlert tone="error">{errorMsg}</InlineAlert> : null}
      {successMsg ? <InlineAlert tone="success">{successMsg}</InlineAlert> : null}

      {activeFile ? (
        <div className="ui-stack ui-stack-tight">
          <p>
            <strong>Active File:</strong> {activeFile.originalFilename} (v{activeFile.version})
            {' — '}{(Number(activeFile.sizeBytes) / (1024 * 1024)).toFixed(2)} MB
          </p>
          <p className="ui-text-sm ui-text-muted">
            Uploaded on {new Date(activeFile.createdAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <InlineAlert tone="warning">No active PDF file uploaded for this document.</InlineAlert>
      )}

      {activeJob ? (
        <div className="ui-stack ui-stack-tight">
          <div className="ui-cluster ui-cluster-justify-between">
            <span className="ui-text-sm">
              Processing{activeJob.stage ? ` (${activeJob.stage})` : ''}
            </span>
            <span className="ui-text-sm">{activeJob.progressPercent}%</span>
          </div>
          <ProgressBar value={activeJob.progressPercent} max={100} label="Processing progress" />
          {activeJob.errorMessage ? (
            <InlineAlert tone="error">Job Error: {activeJob.errorMessage}</InlineAlert>
          ) : null}
        </div>
      ) : null}

      <div className="ui-cluster">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSubmitProcessing}
          disabled={isSubmittingJob || !activeFile}
        >
          {isSubmittingJob ? 'Submitting...' : 'Re-queue Processing'}
        </Button>
      </div>

      <div className="ui-stack ui-stack-tight" style={{ marginTop: '1rem' }}>
        <h4>Replace Active PDF File</h4>
        <FileDropzone
          label="Select new PDF file to replace active file"
          accept="application/pdf"
          file={selectedFile}
          onFile={setSelectedFile}
          description="PDF only. Replacing creates a new file version."
        />
        {selectedFile ? (
          <div className="ui-cluster ui-cluster-justify-end" style={{ marginTop: '0.5rem' }}>
            <Button variant="primary" size="sm" onClick={handleReplaceFile} disabled={isReplacing}>
              {isReplacing ? 'Uploading...' : 'Confirm Replace File'}
            </Button>
          </div>
        ) : null}
      </div>

      {fileVersions.length > 1 ? (
        <div className="ui-stack ui-stack-tight" style={{ marginTop: '1rem' }}>
          <h4>Version History ({fileVersions.length} versions)</h4>
          <ul className="ui-stack ui-stack-tight">
            {fileVersions.map((fv) => (
              <li key={fv.id} className="ui-cluster ui-cluster-justify-between ui-text-sm">
                <span>v{fv.version}: {fv.originalFilename}</span>
                <StatusBadge status={fv.status} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
}
