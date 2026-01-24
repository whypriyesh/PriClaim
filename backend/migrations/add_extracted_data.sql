-- Add extracted_data column to store parsed document content

ALTER TABLE claims
ADD COLUMN IF NOT EXISTS extracted_data JSONB;

-- Add index for faster queries on extraction status
CREATE INDEX IF NOT EXISTS idx_claims_extracted_data ON claims USING gin(extracted_data);
