-- Update the status check constraint to include new status values

-- First, drop the existing constraint
ALTER TABLE claims
DROP CONSTRAINT IF EXISTS claims_status_check;

-- Add updated constraint with all valid statuses
ALTER TABLE claims
ADD CONSTRAINT claims_status_check
CHECK (status IN ('queued', 'text_extraction', 'ocr_processing', 'auditing', 'completed', 'failed'));
