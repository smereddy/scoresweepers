# Deployment Guide

This guide covers deploying ScoreSweep to various platforms and environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Netlify Deployment](#netlify-deployment)
- [Supabase Setup](#supabase-setup)
- [Stripe Integration](#stripe-integration)
- [Domain Configuration](#domain-configuration)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+ and npm
- Git repository with your code
- Supabase account
- Stripe account (for payments)
- Domain name (optional)

## Environment Configuration

### Required Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe Configuration (for edge functions)
STRIPE_SECRET_KEY=sk_live_... # or sk_test_... for testing
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Custom Domain
VITE_CUSTOM_DOMAIN=https://yourdomain.com
```

### Environment-Specific Configurations

#### Development
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Production
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Netlify Deployment

### Automatic Deployment (Recommended)

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Set Environment Variables**
   - Go to Site settings > Environment variables
   - Add all required environment variables

4. **Configure Redirects**
   
   The project includes a `public/_redirects` file:
   ```
   /*    /index.html   200
   /auth/callback    /index.html   200
   ```

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

### Netlify Configuration File

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/auth/callback"
  to = "/index.html"
  status = 200

[context.production.environment]
  NODE_ENV = "production"

[context.deploy-preview.environment]
  NODE_ENV = "development"
```

## Supabase Setup

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Database Setup

Run the migrations in order:

```sql
-- Run each migration file in supabase/migrations/
-- in chronological order
```

### 3. Authentication Setup

1. **Enable Auth Providers**
   - Go to Authentication > Providers
   - Enable Google OAuth
   - Configure redirect URLs:
     - `https://yourdomain.com/auth/callback`
     - `http://localhost:5173/auth/callback` (for development)

2. **Configure Email Templates**
   - Customize email templates in Authentication > Email Templates
   - Update redirect URLs to your domain

### 4. Edge Functions Deployment

Deploy Stripe integration functions:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook
```

### 5. Row Level Security (RLS)

Ensure RLS policies are properly configured:

```sql
-- Verify RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check existing policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

## Stripe Integration

### 1. Stripe Account Setup

1. Create a Stripe account
2. Get your API keys from the Dashboard
3. Configure webhook endpoints

### 2. Webhook Configuration

1. **Create Webhook Endpoint**
   - URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
   - Events to send:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

2. **Configure Webhook Secret**
   - Copy the webhook signing secret
   - Add to Supabase edge function secrets:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 3. Product Configuration

Update `src/stripe-config.ts` with your Stripe product IDs:

```typescript
export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_your_product_id',
    priceId: 'price_your_price_id',
    name: 'Your Product Name',
    description: 'Product description',
    mode: 'payment', // or 'subscription'
    price: '$5.00',
    currency: 'usd'
  }
];
```

## Domain Configuration

### 1. Custom Domain Setup

1. **Configure DNS**
   - Add CNAME record pointing to Netlify:
   ```
   CNAME www your-site.netlify.app
   ```

2. **SSL Certificate**
   - Netlify automatically provisions SSL certificates
   - Verify HTTPS is working

### 2. Update Redirect URLs

Update all redirect URLs in:
- Supabase Auth settings
- Stripe webhook endpoints
- Environment variables

## Monitoring and Analytics

### 1. Error Monitoring

Consider integrating error monitoring:

```typescript
// Example: Sentry integration
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

### 2. Analytics

Add analytics tracking:

```typescript
// Example: Google Analytics
import { gtag } from 'ga-gtag';

gtag('config', 'GA_MEASUREMENT_ID');
```

### 3. Performance Monitoring

Monitor key metrics:
- Page load times
- API response times
- Error rates
- User engagement

## Troubleshooting

### Common Issues

#### 1. Authentication Redirect Issues

**Problem**: OAuth redirects not working

**Solution**:
- Verify redirect URLs in Supabase Auth settings
- Check that URLs match exactly (including protocol)
- Ensure `_redirects` file is properly configured

#### 2. Stripe Webhook Failures

**Problem**: Webhooks not being received

**Solution**:
- Verify webhook URL is correct
- Check Supabase edge function logs
- Ensure webhook secret is properly set
- Verify selected events match your handlers

#### 3. Database Connection Issues

**Problem**: Cannot connect to Supabase

**Solution**:
- Verify environment variables are set correctly
- Check Supabase project status
- Ensure RLS policies allow access
- Verify API keys are valid

#### 4. Build Failures

**Problem**: Build fails on Netlify

**Solution**:
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors
- Ensure environment variables are set

### Debug Commands

```bash
# Check build locally
npm run build

# Lint code
npm run lint

# Check TypeScript
npx tsc --noEmit

# Test Supabase connection
supabase status

# View edge function logs
supabase functions logs stripe-webhook
```

### Performance Optimization

1. **Bundle Analysis**
   ```bash
   npm run build -- --analyze
   ```

2. **Image Optimization**
   - Use WebP format when possible
   - Implement lazy loading
   - Optimize image sizes

3. **Code Splitting**
   - Implement route-based code splitting
   - Use dynamic imports for large components

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] RLS policies configured
- [ ] Input validation implemented
- [ ] Error messages don't expose sensitive data
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Content Security Policy implemented

## Backup and Recovery

### Database Backups

Supabase automatically backs up your database, but consider:
- Regular manual backups for critical data
- Testing restore procedures
- Documenting recovery processes

### Code Backups

- Use Git for version control
- Tag releases for easy rollback
- Maintain staging environment for testing

---

For additional help with deployment, contact hello@scoresweep.org or create an issue in the GitHub repository.