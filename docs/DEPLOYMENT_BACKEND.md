# Backend Deployment Guide

This guide covers deploying the ScoreSweep backend services to Supabase.

## Prerequisites

- Supabase account and project
- Supabase CLI installed
- Node.js 18+ for local development

## Setup

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link to Your Project

```bash
supabase link --project-ref your-project-ref
```

You can find your project reference in your Supabase dashboard URL:
`https://app.supabase.com/project/your-project-ref`

## Database Setup

### 1. Run Migrations

Deploy the database schema:

```bash
# Run all migrations
supabase db push

# Or run specific migration
supabase migration up --file 20250125000001_reports_schema.sql
```

### 2. Verify Database Setup

Check that tables were created correctly:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('reports', 'report_data');

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('reports', 'report_data');

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'reports';
```

## Edge Functions Deployment

### 1. Deploy All Functions

```bash
# Deploy all functions at once
supabase functions deploy

# Or deploy individually
supabase functions deploy upload
supabase functions deploy process
supabase functions deploy report
supabase functions deploy generate-dispute
supabase functions deploy delete-report
supabase functions deploy cleanup-expired
```

### 2. Set Environment Variables

```bash
# Set required environment variables
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Set OpenAI API key for real AI processing
supabase secrets set OPENAI_API_KEY=your-openai-api-key
```

### 3. Verify Deployment

Test each function:

```bash
# Test upload function
curl -X POST https://your-project.supabase.co/functions/v1/upload \
  -H "Authorization: Bearer your-jwt-token" \
  -F "file=@test-report.pdf"

# Test process function
curl -X POST https://your-project.supabase.co/functions/v1/process/report-id \
  -H "Authorization: Bearer your-jwt-token"

# Test report retrieval
curl https://your-project.supabase.co/functions/v1/report/report-id \
  -H "Authorization: Bearer your-jwt-token"
```

## Storage Configuration

### 1. Verify Storage Bucket

The migration should create the `reports` bucket automatically. Verify:

```sql
SELECT * FROM storage.buckets WHERE id = 'reports';
```

### 2. Configure Storage Policies

The RLS policies for storage should be created by the migration. Verify:

```sql
SELECT * FROM storage.policies WHERE bucket_id = 'reports';
```

## Scheduled Functions

### 1. Set Up Cron Job for Cleanup

Create a cron job to run the cleanup function daily:

```bash
# Using cron-job.org or similar service
# Schedule: Daily at 2 AM UTC
# URL: https://your-project.supabase.co/functions/v1/cleanup-expired
# Method: POST
# Headers: Authorization: Bearer your-service-role-key
```

### 2. Alternative: Database Function

You can also create a database function for cleanup:

```sql
-- Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_reports()
RETURNS void AS $$
BEGIN
  -- Delete reports older than 30 days
  DELETE FROM reports 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule with pg_cron (if available)
SELECT cron.schedule('cleanup-reports', '0 2 * * *', 'SELECT cleanup_expired_reports();');
```

## Environment Configuration

### Production Environment Variables

Set these in your Supabase project:

```bash
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional for real AI processing
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=4000

# Optional for enhanced security
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
MAX_FILE_SIZE=10485760
```

### Development Environment

For local development:

```bash
# Start local Supabase
supabase start

# Serve functions locally
supabase functions serve

# Test locally
curl -X POST http://localhost:54321/functions/v1/upload \
  -H "Authorization: Bearer your-local-jwt-token" \
  -F "file=@test-report.pdf"
```

## Monitoring and Logging

### 1. Function Logs

View function logs:

```bash
# View logs for specific function
supabase functions logs upload --follow

# View logs for all functions
supabase functions logs --follow
```

### 2. Database Monitoring

Monitor database performance:

```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public';

-- Check recent reports
SELECT 
  status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_processing_time
FROM reports 
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY status;
```

### 3. Error Tracking

Set up error tracking in your functions:

```typescript
// Add to each function
try {
  // Function logic
} catch (error) {
  console.error('Function error:', {
    function: 'upload',
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
  
  // Optional: Send to external error tracking service
  // await sendToSentry(error);
}
```

## Security Configuration

### 1. API Keys and Secrets

Secure your API keys:

```bash
# Rotate service role key if needed
# Generate new key in Supabase dashboard
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=new-key

# Use environment-specific keys
supabase secrets set OPENAI_API_KEY=prod-key --project-ref prod-project
supabase secrets set OPENAI_API_KEY=dev-key --project-ref dev-project
```

### 2. CORS Configuration

Configure CORS for your domain:

```typescript
// Update corsHeaders in each function
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
```

### 3. Rate Limiting

Implement rate limiting:

```typescript
// Add to functions that need rate limiting
const rateLimitKey = `rate_limit:${user.id}:${functionName}`;
const currentCount = await redis.incr(rateLimitKey);
if (currentCount === 1) {
  await redis.expire(rateLimitKey, 60); // 1 minute window
}
if (currentCount > 10) { // 10 requests per minute
  return new Response('Rate limit exceeded', { status: 429 });
}
```

## Performance Optimization

### 1. Database Indexes

Ensure proper indexing:

```sql
-- Check existing indexes
SELECT indexname, indexdef FROM pg_indexes 
WHERE tablename IN ('reports', 'report_data');

-- Add additional indexes if needed
CREATE INDEX CONCURRENTLY idx_reports_status_created 
ON reports(status, created_at) 
WHERE status IN ('uploaded', 'processing');
```

### 2. Function Optimization

Optimize function performance:

```typescript
// Use connection pooling
const supabase = createClient(url, key, {
  db: { schema: 'public' },
  auth: { persistSession: false },
  global: { headers: { 'x-application-name': 'scoresweep-backend' } }
});

// Implement caching for frequently accessed data
const cache = new Map();
const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
    return cached.data;
  }
  return null;
};
```

### 3. Storage Optimization

Optimize file storage:

```typescript
// Compress PDFs before storage
const compressedPdf = await compressPdf(pdfBuffer);

// Use appropriate storage class
const { data, error } = await supabase.storage
  .from('reports')
  .upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: 'application/pdf',
  });
```

## Backup and Recovery

### 1. Database Backups

Supabase automatically backs up your database, but you can also:

```bash
# Manual backup
supabase db dump --file backup.sql

# Restore from backup
supabase db reset --file backup.sql
```

### 2. Storage Backups

Implement storage backup strategy:

```typescript
// Function to backup critical files
async function backupCriticalFiles() {
  const { data: files } = await supabase.storage
    .from('reports')
    .list('', { limit: 1000 });
    
  for (const file of files) {
    // Copy to backup bucket or external storage
    await copyToBackup(file);
  }
}
```

## Troubleshooting

### Common Issues

1. **Function deployment fails**
   ```bash
   # Check function syntax
   deno check supabase/functions/upload/index.ts
   
   # Check logs
   supabase functions logs upload
   ```

2. **Database connection issues**
   ```sql
   -- Check connection limits
   SELECT * FROM pg_stat_activity;
   
   -- Check RLS policies
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

3. **Storage upload fails**
   ```bash
   # Check bucket exists
   SELECT * FROM storage.buckets WHERE id = 'reports';
   
   # Check storage policies
   SELECT * FROM storage.policies WHERE bucket_id = 'reports';
   ```

### Debug Commands

```bash
# Check function status
supabase functions list

# View function details
supabase functions inspect upload

# Test function locally
supabase functions serve upload --debug

# Check database status
supabase status

# View migration history
supabase migration list
```

## Production Checklist

- [ ] All migrations applied successfully
- [ ] All edge functions deployed
- [ ] Environment variables set
- [ ] Storage bucket configured with RLS
- [ ] Cleanup cron job scheduled
- [ ] Monitoring and logging configured
- [ ] Error tracking implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Backup strategy implemented
- [ ] Security policies reviewed
- [ ] Performance optimizations applied

Your ScoreSweep backend is now ready for production! 🚀