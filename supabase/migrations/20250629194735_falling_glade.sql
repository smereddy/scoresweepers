/*
  # Reports Schema for ScoreSweep Backend

  1. New Tables
    - `reports`: Main reports table for tracking uploaded PDFs
      - `report_id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `pdf_url` (text, Supabase storage path)
      - `status` (text, processing status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `report_data`: Processed report analysis results
      - `report_id` (uuid, references reports)
      - `processed_json` (jsonb, AI analysis results)
      - `processed_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own reports
    - Service role has full access for processing

  3. Storage
    - Create reports bucket for PDF storage
    - Configure RLS policies for file access
*/

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  report_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  pdf_url text NOT NULL,
  status text NOT NULL DEFAULT 'uploaded',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create report_data table
CREATE TABLE IF NOT EXISTS report_data (
  report_id uuid PRIMARY KEY REFERENCES reports(report_id) ON DELETE CASCADE,
  processed_json jsonb NOT NULL,
  processed_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reports table
CREATE POLICY "Users can view their own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role has full access to reports"
  ON reports
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for report_data table
CREATE POLICY "Users can view their own report data"
  ON report_data
  FOR SELECT
  TO authenticated
  USING (
    report_id IN (
      SELECT report_id FROM reports WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role has full access to report data"
  ON report_data
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_report_data_report_id ON report_data(report_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for reports table
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert storage bucket for reports (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
CREATE POLICY "Users can upload their own reports"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'reports' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own reports"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'reports' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Service role has full access to reports storage"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'reports')
  WITH CHECK (bucket_id = 'reports');