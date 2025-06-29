# Backend Deployment Guide

This guide covers deploying the ScoreSweep backend services to Supabase.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Edge Functions Deployment](#edge-functions-deployment)
- [Storage Configuration](#storage-configuration)
- [Scheduled Functions](#scheduled-functions)
- [Monitoring and Logging](#monitoring-and-logging)
- [Troubleshooting](#troubleshooting)
- [Production Checklist](#production-checklist)

## Prerequisites

- Supabase account and project
- Supabase CLI installed
- Node.js 18+ for local development
- OpenAI API key for AI processing

## Environment Configuration

### Required Environment Variables

Set these environment variables in your Supabase project:

```bash
# Required for all functions
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Required for AI processing
OPENAI_API_KEY=sk_... # Your OpenAI API key
OPENAI_MODEL=gpt-4o # Or another model like gpt-3.5-turbo

# Optional configuration
MAX_FILE_SIZE=10485760 # 10MB in bytes
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Setting Up OpenAI API Key

1. **Get your API key**:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (it starts with "sk-")

2. **Add to Supabase**:
   ```bash
   # Using Supabase CLI
   supabase secrets set OPENAI_API_KEY=sk_your_key_here
   
   # Optional: Set model to use
   supabase secrets set OPENAI_MODEL=gpt-4o
   ```

3. **Verify in Supabase Dashboard**:
   - Go to your Supabase project
   - Navigate to Settings > API
   - Check under "Edge Function Secrets"

### Environment-Specific Configurations

#### Development
```bash
# Local development
supabase secrets set --env local OPENAI_API_KEY=sk_your_key_here

# Start local Supabase with secrets
supabase start
```

#### Production
```bash
# Production environment
supabase secrets set --project-ref your-project-ref OPENAI_API_KEY=sk_your_key_here
```

## Database Setup

### 1. Run Migrations

Deploy the database schema:

```bash
# Run all migrations
supabase db push

# Or run specific migration
supabase migration up --file 20250629194735_falling_glade.sql
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

# Set OpenAI API key for AI processing
supabase secrets set OPENAI_API_KEY=sk_your_key_here
supabase secrets set OPENAI_MODEL=gpt-4o
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

## OpenAI API Integration

### 1. API Key Management

Your OpenAI API key is used in the following Edge Functions:
- `process` - For analyzing credit reports
- `generate-dispute` - For creating dispute letters and scripts

The key is securely stored as an environment variable and never exposed to clients.

### 2. Billing and Usage

When using your own OpenAI API key:
- All API calls will be billed to your OpenAI account
- You can monitor usage in the [OpenAI dashboard](https://platform.openai.com/usage)
- Set usage limits in your OpenAI account to control costs

### 3. Model Selection

You can configure which OpenAI model to use:

```bash
# Set default model (gpt-4o recommended for best results)
supabase secrets set OPENAI_MODEL=gpt-4o

# For cost savings, you can use:
supabase secrets set OPENAI_MODEL=gpt-3.5-turbo
```

### 4. Fallback Mechanism

If the OpenAI API call fails or no API key is provided, the system will fall back to template-based generation to ensure the application remains functional.

### 5. Testing OpenAI Integration

Test that your OpenAI API key is working:

```bash
# Test process function with OpenAI
curl -X POST https://your-project.supabase.co/functions/v1/process/report-id \
  -H "Authorization: Bearer your-jwt-token"

# Check logs for OpenAI API calls
supabase functions logs process
```

## Monitoring and Logging

### 1. Function Logs

View function logs:

```bash
# View logs for specific function
supabase functions logs process --follow

# View logs for all functions
supabase functions logs --follow
```

### 2. OpenAI API Usage Monitoring

Monitor your OpenAI API usage:
- Go to [OpenAI Usage Dashboard](https://platform.openai.com/usage)
- Set up usage limits to prevent unexpected costs
- Review usage patterns to optimize API calls

### 3. Database Monitoring

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

## Troubleshooting

### Common Issues

#### 1. OpenAI API Key Issues

**Problem**: OpenAI API calls failing

**Solutions**:
- Verify your API key is correctly set in Supabase secrets
- Check that your OpenAI account has billing set up
- Ensure you haven't hit rate limits or usage caps
- Check function logs for specific error messages

```bash
# Check if OpenAI API key is set
supabase secrets list | grep OPENAI_API_KEY

# Update API key if needed
supabase secrets set OPENAI_API_KEY=sk_new_key_here
```

#### 2. Function deployment fails

```bash
# Check function syntax
deno check supabase/functions/process/index.ts
   
# Check logs
supabase functions logs process
```

#### 3. Database connection issues

```sql
-- Check connection limits
SELECT * FROM pg_stat_activity;
   
-- Check RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### Debug Commands

```bash
# Check function status
supabase functions list

# View function details
supabase functions inspect process

# Test function locally
supabase functions serve process --debug

# Check database status
supabase status

# View migration history
supabase migration list
```

## Production Checklist

- [ ] All migrations applied successfully
- [ ] All edge functions deployed
- [ ] Environment variables set, including OPENAI_API_KEY
- [ ] Storage bucket configured with RLS
- [ ] Cleanup cron job scheduled
- [ ] Monitoring and logging configured
- [ ] Error tracking implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Backup strategy implemented
- [ ] Security policies reviewed
- [ ] Performance optimizations applied
- [ ] OpenAI API usage limits configured

Your ScoreSweep backend is now ready for production with your own OpenAI API key integration! 🚀