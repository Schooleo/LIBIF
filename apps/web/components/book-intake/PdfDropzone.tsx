'use client';

type Props = {
  file: File | null;
  onFile: (file: File | null) => void;
  error?: string;
};

export function PdfDropzone({ file, onFile, error }: Props) {
  const handleFiles = (files: FileList | null) => {
    const next = files?.[0] ?? null;
    onFile(next);
  };

  return (
    <section
      className="dropzone"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        handleFiles(event.dataTransfer.files);
      }}
    >
      <label>
        PDF file (max 200MB)
        <input aria-label="PDF file" type="file" accept="application/pdf,.pdf" onChange={(event) => handleFiles(event.target.files)} />
      </label>
      {file ? <p>Selected: {file.name} ({Math.round(file.size / 1024)} KB)</p> : <p>Drag and drop a scanned PDF here.</p>}
      {error ? <p className="error" role="alert">{error}</p> : null}
    </section>
  );
}
