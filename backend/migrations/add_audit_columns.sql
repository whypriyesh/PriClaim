-- Add columns for policy and audit results

-- Add policy_text column (stores insurance policy for this claim)
ALTER TABLE claims
ADD COLUMN IF NOT EXISTS policy_text TEXT;

-- Add audit_result column (stores AI audit analysis)
ALTER TABLE claims
ADD COLUMN IF NOT EXISTS audit_result JSONB;

-- Add index for querying by verdict
CREATE INDEX IF NOT EXISTS idx_claims_audit_verdict 
ON claims ((audit_result->>'verdict'));

-- Comment for documentation
COMMENT ON COLUMN claims.policy_text IS 'Insurance policy text provided with claim';
COMMENT ON COLUMN claims.audit_result IS 'AI audit results with verdict, risk score, and findings';
