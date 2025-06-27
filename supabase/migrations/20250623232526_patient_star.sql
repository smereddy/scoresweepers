/*
  # Clean Beta Waitlist Setup

  1. New Tables
    - `beta_waitlist`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, unique, required)
      - `note` (text, optional)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `beta_waitlist` table
    - Add policy for anonymous users to insert waitlist entries
    - Add policy for authenticated users to read waitlist entries
    - Add policy for service role to have full access

  3. Indexes
    - Index on email for faster lookups
    - Index on created_at for sorting
*/

-- Drop the table if it exists to start fresh
DROP TABLE IF EXISTS beta_waitlist CASCADE;

-- Create the beta_waitlist table
CREATE TABLE beta_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  note text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE beta_waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous users to insert (public waitlist signup)
CREATE POLICY "Allow anonymous users to insert waitlist entries"
  ON beta_waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy for authenticated users to insert (in case they're logged in)
CREATE POLICY "Allow authenticated users to insert waitlist entries"
  ON beta_waitlist
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy for authenticated users to read waitlist entries (admin access)
CREATE POLICY "Allow authenticated users to read waitlist entries"
  ON beta_waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for service role to have full access (admin operations)
CREATE POLICY "Allow service role full access to waitlist"
  ON beta_waitlist
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_beta_waitlist_email ON beta_waitlist(email);
CREATE INDEX idx_beta_waitlist_created_at ON beta_waitlist(created_at DESC);