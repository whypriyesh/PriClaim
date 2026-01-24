-- Row-Level Security (RLS) Policies for Claims Table
-- This adds database-level security as a second layer of protection

-- Step 1: Enable RLS on the claims table
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies if any (for clean slate)
DROP POLICY IF EXISTS "Users can view own claims" ON claims;
DROP POLICY IF EXISTS "Users can insert own claims" ON claims;
DROP POLICY IF EXISTS "Users can update own claims" ON claims;
DROP POLICY IF EXISTS "Users can delete own claims" ON claims;

-- Step 3: Create SELECT policy (viewing claims)
-- Users can only SELECT claims where uploaded_by matches their user ID
CREATE POLICY "Users can view own claims"
ON claims
FOR SELECT
USING (auth.uid() = uploaded_by);

-- Step 4: Create INSERT policy (creating claims)
-- Users can only INSERT claims where uploaded_by is set to their user ID
CREATE POLICY "Users can insert own claims"
ON claims
FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

-- Step 5: Create UPDATE policy (editing claims)
-- Users can only UPDATE their own claims
CREATE POLICY "Users can update own claims"
ON claims
FOR UPDATE
USING (auth.uid() = uploaded_by)
WITH CHECK (auth.uid() = uploaded_by);

-- Step 6: Create DELETE policy (removing claims)
-- Users can only DELETE their own claims
CREATE POLICY "Users can delete own claims"
ON claims
FOR DELETE
USING (auth.uid() = uploaded_by);

-- Verification: Check that RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'claims';

-- Verification: List all policies on claims table
SELECT * FROM pg_policies WHERE tablename = 'claims';
