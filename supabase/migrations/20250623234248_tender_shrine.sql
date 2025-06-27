/*
  # Disable RLS on beta_waitlist table

  1. Changes
    - Disable Row Level Security on `beta_waitlist` table
    - Remove all existing RLS policies
    - Grant basic permissions to anon and authenticated roles

  2. Security Note
    - This removes RLS protection, making the table accessible to all users
    - Consider re-enabling RLS with proper policies in production
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow anonymous waitlist submissions" ON beta_waitlist;
DROP POLICY IF EXISTS "Allow authenticated waitlist submissions" ON beta_waitlist;
DROP POLICY IF EXISTS "Allow authenticated users to read waitlist" ON beta_waitlist;
DROP POLICY IF EXISTS "Allow service role full access" ON beta_waitlist;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON beta_waitlist;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON beta_waitlist;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON beta_waitlist;
DROP POLICY IF EXISTS "Enable all operations for service role" ON beta_waitlist;
DROP POLICY IF EXISTS "allanon" ON beta_waitlist;
DROP POLICY IF EXISTS "anon insert" ON beta_waitlist;

-- Disable Row Level Security
ALTER TABLE beta_waitlist DISABLE ROW LEVEL SECURITY;

-- Grant basic permissions to ensure access works
GRANT SELECT, INSERT ON beta_waitlist TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON beta_waitlist TO authenticated;
GRANT ALL ON beta_waitlist TO service_role;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;