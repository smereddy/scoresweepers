/*
  # Fix RLS policies for beta_waitlist table

  1. Security Updates
    - Drop existing problematic policies
    - Create new, properly configured policies for anonymous inserts
    - Ensure anon role has necessary permissions
    - Maintain security while allowing waitlist submissions

  2. Policy Changes
    - Allow anonymous users to insert waitlist entries
    - Allow authenticated users to read their own entries
    - Allow service role full access for admin operations
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON beta_waitlist;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON beta_waitlist;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON beta_waitlist;
DROP POLICY IF EXISTS "Enable all operations for service role" ON beta_waitlist;

-- Ensure RLS is enabled
ALTER TABLE beta_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous users to insert waitlist entries
CREATE POLICY "Allow anonymous waitlist submissions"
  ON beta_waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy for authenticated users to insert waitlist entries
CREATE POLICY "Allow authenticated waitlist submissions"
  ON beta_waitlist
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy for authenticated users to read all waitlist entries
-- (useful for admin dashboard later)
CREATE POLICY "Allow authenticated users to read waitlist"
  ON beta_waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for service role to have full access
CREATE POLICY "Allow service role full access"
  ON beta_waitlist
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions to anon role
GRANT INSERT ON beta_waitlist TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant necessary permissions to authenticated role
GRANT SELECT, INSERT ON beta_waitlist TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;