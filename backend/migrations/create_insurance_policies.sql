-- Create insurance_policies table for storing insurance policy documents

-- Drop existing table if it exists (clean slate)
DROP TABLE IF EXISTS insurance_policies CASCADE;

-- Create table
CREATE TABLE IF NOT EXISTS insurance_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    policy_text TEXT NOT NULL,
    company_name VARCHAR(255),
    policy_type VARCHAR(100),
    coverage_limit NUMERIC,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_policies_created_by ON insurance_policies(created_by);
CREATE INDEX IF NOT EXISTS idx_policies_company ON insurance_policies(company_name);
CREATE INDEX IF NOT EXISTS idx_policies_created_at ON insurance_policies(created_at DESC);

-- Enable Row-Level Security
ALTER TABLE insurance_policies ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can insert policies
-- Only users with role='admin' in user_metadata can create policies
CREATE POLICY "Admins can create policies"
ON insurance_policies
FOR INSERT
WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Policy: Everyone can read policies
-- All authenticated users can view policies
CREATE POLICY "Everyone can read policies"
ON insurance_policies
FOR SELECT
USING (true);

-- Policy: Admins can update policies
CREATE POLICY "Admins can update policies"
ON insurance_policies
FOR UPDATE
USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Policy: Admins can delete policies
CREATE POLICY "Admins can delete policies"
ON insurance_policies
FOR DELETE
USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Add comments for documentation
COMMENT ON TABLE insurance_policies IS 'Insurance policy documents uploaded by hospital admins';
COMMENT ON COLUMN insurance_policies.name IS 'Display name of the policy';
COMMENT ON COLUMN insurance_policies.policy_text IS 'Full text content of the insurance policy';
COMMENT ON COLUMN insurance_policies.company_name IS 'Insurance company name';
COMMENT ON COLUMN insurance_policies.policy_type IS 'Type of policy (health, life, etc)';
COMMENT ON COLUMN insurance_policies.coverage_limit IS 'Maximum coverage amount';
COMMENT ON COLUMN insurance_policies.created_by IS 'Admin user who uploaded this policy';
