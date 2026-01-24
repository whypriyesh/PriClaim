-- Fix: Remove foreign key constraint and make column nullable

-- Drop the constraint if it exists
ALTER TABLE claims
DROP CONSTRAINT IF EXISTS fk_claims_uploaded_by;

-- Make sure the column exists and is nullable (allows existing claims)
ALTER TABLE claims
ADD COLUMN IF NOT EXISTS uploaded_by UUID;

-- Create index on uploaded_by for faster user queries
CREATE INDEX IF NOT EXISTS idx_claims_uploaded_by 
ON claims(uploaded_by, created_at DESC);

-- Note: We don't add FK constraint to auth.users because Supabase's auth schema
-- is not directly accessible. This is fine for MVP - we just store the UUID.
