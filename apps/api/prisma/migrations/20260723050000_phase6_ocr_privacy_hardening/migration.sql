-- OCR text belongs in the private derived object, not duplicated in database metadata.
UPDATE "ProcessingArtifact"
SET
  "metadata" = NULLIF("metadata" - 'textPreview', '{}'::jsonb),
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "metadata" ? 'textPreview';
