# Setup Guide

This guide will help you set up ScoreSweep for development or production use.

## Table of Contents

- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Supabase Configuration](#supabase-configuration)
- [Stripe Integration](#stripe-integration)
- [Environment Variables](#environment-variables)
- [Demo Mode](#demo-mode)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Option 1: Demo Mode (No Setup Required)

The easiest way to try ScoreSweep is using demo mode:

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/scoresweep.git
   cd scoresweep
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   Navigate to `http://localhost:5173` and click "Try Demo"

Demo mode works without any configuration and uses mock data to demonstrate all features.

### Option 2: Full Setup with Supabase

For full functionality including authentication and payments:

1. **Clone and install** (same as above)

2. **Set up Supabase** (see [Supabase Configuration](#supabase-configuration))

3. **Configure environment variables** (see [Environment Variables](#environment-variables))

4. **Start development server**
   ```bash
   npm run dev
   ```

## Development Setup

### Prerequisites

- **Node.js 18+** and npm
- **Git** for version control
- **Supabase account** (optional for demo mode)
- **Stripe account** (optional for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scoresweep.git
   cd scoresweep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types

# Deployment
npm run deploy       # Deploy to Netlify (requires setup)
```

## Supabase Configuration

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and enter project details
4. Wait for project to be created (2-3 minutes)

### 2. Get Project Credentials

1. Go to **Settings > API**
2. Copy your **Project URL** and **anon public key**
3. Add these to your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database

#### Option A: Using Supabase Dashboard

1. Go to **SQL Editor** in your Supabase dashboard
2. Run each migration file from `supabase/migrations/` in chronological order:
   - `20250623232526_patient_star.sql`
   - `20250623232705_graceful_sky.sql`
   - `20250623234106_black_castle.sql`
   - `20250623234248_tender_shrine.sql`
   - `20250625055354_steep_gate.sql`

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Configure Authentication

1. Go to **Authentication > Providers**
2. **Enable Google OAuth**:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Add authorized redirect URIs:
     - `https://your-project-id.supabase.co/auth/v1/callback`
     - `http://localhost:5173/auth/callback` (for development)

3. **Configure redirect URLs**:
   - Site URL: `http://localhost:5173` (development) or your domain
   - Redirect URLs: Add your domain and localhost

### 5. Deploy Edge Functions (Optional)

For Stripe integration:

```bash
# Deploy Stripe functions
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook

# Set environment variables
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

## Stripe Integration

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Create account and complete verification
3. Get your API keys from the Dashboard

### 2. Configure Products

1. **Create products in Stripe Dashboard**:
   - Go to **Products** and click "Add product"
   - Set up pricing (one-time or recurring)
   - Copy the Price ID

2. **Update product configuration**:
   ```typescript
   // src/stripe-config.ts
   export const stripeProducts: StripeProduct[] = [
     {
       id: 'prod_your_product_id',
       priceId: 'price_your_price_id', // Copy from Stripe
       name: 'Your Product Name',
       description: 'Product description',
       mode: 'payment', // or 'subscription'
       price: '$5.00',
       currency: 'usd'
     }
   ];
   ```

### 3. Set Up Webhooks

1. **Create webhook endpoint**:
   - URL: `https://your-project-id.supabase.co/functions/v1/stripe-webhook`
   - Events: Select all checkout and subscription events

2. **Configure webhook secret**:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

## Environment Variables

### Development (.env)

```env
# Required for full functionality
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_CUSTOM_DOMAIN=http://localhost:5173
```

### Production (Netlify)

Set these in your Netlify dashboard under **Site settings > Environment variables**:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CUSTOM_DOMAIN=https://yourdomain.com
```

### Supabase Edge Functions

Set these in Supabase dashboard under **Edge Functions > Manage secrets**:

```env
STRIPE_SECRET_KEY=sk_live_... # or sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Demo Mode

Demo mode allows you to explore ScoreSweep without any setup:

### Features Available in Demo Mode

- ✅ Complete audit workflow
- ✅ AI analysis simulation
- ✅ Document generation
- ✅ All UI components and animations
- ❌ Real authentication
- ❌ Data persistence
- ❌ Payment processing

### Enabling Demo Mode

Demo mode is enabled by default. To disable it:

```typescript
// src/contexts/AuthContext.tsx
const isDemoMode = false; // Change to false
```

### Demo Data

Demo mode uses mock data defined in:
- `src/data/mockData.ts` - General mock data
- `src/data/creditReportData.ts` - Credit report mock data
- `src/data/consumerReportData.ts` - Consumer report mock data

## Troubleshooting

### Common Issues

#### 1. "Cannot connect to Supabase"

**Symptoms**: Authentication not working, database errors

**Solutions**:
- Verify environment variables are set correctly
- Check Supabase project status
- Ensure you're using the correct project URL and key
- Try refreshing your browser

#### 2. "Stripe payments not working"

**Symptoms**: Payment buttons don't work, checkout fails

**Solutions**:
- Verify Stripe keys are set in Supabase secrets
- Check webhook URL is correct
- Ensure products are configured properly
- Test with Stripe test keys first

#### 3. "Build fails"

**Symptoms**: `npm run build` fails with errors

**Solutions**:
- Run `npm run lint` to check for code issues
- Check TypeScript errors with `npx tsc --noEmit`
- Ensure all environment variables are set
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

#### 4. "Authentication redirect not working"

**Symptoms**: OAuth redirects to wrong URL or fails

**Solutions**:
- Check redirect URLs in Supabase Auth settings
- Ensure URLs match exactly (including protocol)
- Verify `_redirects` file is properly configured
- Check browser console for errors

### Debug Commands

```bash
# Check environment variables
echo $VITE_SUPABASE_URL

# Test build locally
npm run build && npm run preview

# Check TypeScript
npx tsc --noEmit

# Lint code
npm run lint

# Check Supabase connection
supabase status

# View function logs
supabase functions logs stripe-webhook --follow
```

### Getting Help

If you're still having issues:

1. **Check the documentation** in the `docs/` folder
2. **Search existing issues** on GitHub
3. **Create a new issue** with:
   - Steps to reproduce
   - Error messages
   - Environment details (OS, Node version, etc.)
4. **Contact support** at hello@scoresweep.org

### Performance Tips

1. **Use demo mode** for development when possible
2. **Enable caching** in your browser dev tools
3. **Use local Supabase** for faster development:
   ```bash
   supabase start
   ```
4. **Optimize images** and use WebP format when possible

---

You're now ready to start developing with ScoreSweep! 🚀