/*
  # Fix RLS policies for beta_waitlist table

  1. Security Updates
    - Drop existing problematic policies
    - Create new policies that properly allow anonymous inserts
    - Ensure authenticated users can also insert
    - Maintain read access for authenticated users
    - Keep service role access intact

  2. Policy Changes
    - Allow anonymous users to insert waitlist entries with proper conditions
    - Allow authenticated users to insert waitlist entries
    - Allow authenticated users to read all waitlist entries
    - Allow service role full access
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Allow anonymous users to insert waitlist entries" ON beta_waitlist;
DROP POLICY IF EXISTS "Allow authenticated users to insert waitlist entries" ON beta_waitlist;
DROP POLICY IF EXISTS "Allow authenticated users to read waitlist entries" ON beta_waitlist;
DROP POLICY IF EXISTS "Allow service role full access to waitlist" ON beta_waitlist;

-- Create new policies with proper conditions
CREATE POLICY "Enable insert for anonymous users"
  ON beta_waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Enable insert for authenticated users"
  ON beta_waitlist
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users"
  ON beta_waitlist
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable all operations for service role"
  ON beta_waitlist
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);