-- Add error handling and observability columns to claims table

ALTER TABLE claims
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

-- Create index on status for faster worker queries
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
