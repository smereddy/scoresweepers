# API Documentation

This document describes the API endpoints and data structures used in ScoreSweep.

## Table of Contents

- [Authentication](#authentication)
- [Supabase Integration](#supabase-integration)
- [Stripe Integration](#stripe-integration)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Authentication

ScoreSweep uses Supabase Auth for user authentication with multiple providers.

### Authentication Methods

#### Google OAuth
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/dashboard`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    }
  }
});
```

#### Email/Password
```typescript
// Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      full_name: 'John Doe',
    }
  }
});

// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
```

#### Demo Mode
The application supports a demo mode that bypasses authentication for testing purposes.

### Session Management

```typescript
// Get current session
const { data: { session }, error } = await supabase.auth.getSession();

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session);
});

// Sign out
const { error } = await supabase.auth.signOut();
```

## Supabase Integration

### Database Tables

#### beta_waitlist
Stores beta user signups.

```sql
CREATE TABLE beta_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  note text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
```

**Operations:**
```typescript
// Insert waitlist entry
const { data, error } = await supabase
  .from('beta_waitlist')
  .insert([
    {
      name: 'John Doe',
      email: 'john@example.com',
      note: 'Interested in credit repair'
    }
  ]);

// Get waitlist entries (admin only)
const { data, error } = await supabase
  .from('beta_waitlist')
  .select('*')
  .order('created_at', { ascending: false });
```

#### stripe_customers
Links Supabase users to Stripe customers.

```sql
CREATE TABLE stripe_customers (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  customer_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT null
);
```

#### stripe_subscriptions
Manages subscription data.

```sql
CREATE TABLE stripe_subscriptions (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer_id text UNIQUE NOT NULL,
  subscription_id text DEFAULT null,
  price_id text DEFAULT null,
  current_period_start bigint DEFAULT null,
  current_period_end bigint DEFAULT null,
  cancel_at_period_end boolean DEFAULT false,
  payment_method_brand text DEFAULT null,
  payment_method_last4 text DEFAULT null,
  status stripe_subscription_status NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT null
);
```

#### stripe_orders
Stores order/purchase information.

```sql
CREATE TABLE stripe_orders (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  checkout_session_id text NOT NULL,
  payment_intent_id text NOT NULL,
  customer_id text NOT NULL,
  amount_subtotal bigint NOT NULL,
  amount_total bigint NOT NULL,
  currency text NOT NULL,
  payment_status text NOT NULL,
  status stripe_order_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT null
);
```

### Views

#### stripe_user_subscriptions
Secure view for user subscription data.

```sql
CREATE VIEW stripe_user_subscriptions AS
SELECT
    c.customer_id,
    s.subscription_id,
    s.status as subscription_status,
    s.price_id,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL
AND s.deleted_at IS NULL;
```

**Usage:**
```typescript
const { data, error } = await supabase
  .from('stripe_user_subscriptions')
  .select('*')
  .maybeSingle();
```

## Stripe Integration

### Edge Functions

#### stripe-checkout
Creates Stripe checkout sessions.

**Endpoint:** `https://your-project.supabase.co/functions/v1/stripe-checkout`

**Request:**
```typescript
interface CheckoutRequest {
  price_id: string;
  mode: 'payment' | 'subscription';
  success_url?: string;
  cancel_url?: string;
}
```

**Response:**
```typescript
interface CheckoutResponse {
  sessionId: string;
  url: string;
}
```

**Example:**
```typescript
const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`, // Optional for anonymous payments
  },
  body: JSON.stringify({
    price_id: 'price_1234567890',
    mode: 'payment',
    success_url: 'https://yourdomain.com/success',
    cancel_url: 'https://yourdomain.com/cancel',
  }),
});
```

#### stripe-webhook
Handles Stripe webhook events.

**Endpoint:** `https://your-project.supabase.co/functions/v1/stripe-webhook`

**Supported Events:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### Product Configuration

Products are configured in `src/stripe-config.ts`:

```typescript
export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price?: string;
  currency?: string;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_donation',
    priceId: 'price_1234567890',
    name: 'Donation',
    description: 'Support ScoreSweep development',
    mode: 'payment',
    price: '$5.00',
    currency: 'usd'
  }
];
```

## Data Models

### Credit Report Data

#### DetectedIssue
```typescript
interface DetectedIssue {
  id: string;
  type: 'Personal Info Error' | 'Account Error' | 'Payment History Error' | 'Inquiry Error' | 'Public Record Error';
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
  affectedItem: string;
  bureau: 'Experian' | 'Equifax' | 'TransUnion';
  confidence: number;
  potentialImpact: string;
  disputeStrategy: string;
}
```

#### CreditAccount
```typescript
interface CreditAccount {
  id: string;
  creditorName: string;
  accountNumber: string;
  accountType: 'Credit Card' | 'Mortgage' | 'Auto Loan' | 'Student Loan' | 'Personal Loan' | 'Line of Credit';
  status: 'Open' | 'Closed' | 'Paid' | 'Charge Off' | 'Collection';
  balance: number;
  creditLimit?: number;
  monthlyPayment?: number;
  dateOpened: string;
  dateClosed?: string;
  lastActivity: string;
  paymentHistory: PaymentHistory[];
  remarks?: string;
  bureau: 'Experian' | 'Equifax' | 'TransUnion';
}
```

### Audit Workflow

#### AuditWorkflow
```typescript
interface AuditWorkflow {
  id: string;
  name: string;
  reportType: ReportType;
  currentStep: WorkflowStep;
  createdAt: string;
  updatedAt: string;
  progress: number;
  status: 'Draft' | 'In Progress' | 'Complete' | 'Review Required';
  
  setupData?: {
    reportType: ReportType;
    bureaus?: string[];
    agencies?: string[];
    purpose?: string;
  };
  
  uploadData?: {
    fileName?: string;
    fileSize?: number;
    uploadedAt?: string;
    processingStatus?: 'pending' | 'processing' | 'complete' | 'error';
  };
  
  analysisData?: {
    issuesFound: number;
    confidence: number;
    processingTime: number;
    issues: (DetectedIssue | ConsumerReportIssue)[];
  };
  
  reviewData?: {
    selectedIssues: string[];
    userNotes?: string;
    validationComplete: boolean;
  };
  
  generationData?: {
    letterType: 'dispute' | 'validation' | 'goodwill';
    customizations?: Record<string, string>;
    generatedAt?: string;
  };
}
```

## Error Handling

### Standard Error Response

```typescript
interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
}
```

### Common Error Codes

#### Authentication Errors
- `401 Unauthorized` - Invalid or missing authentication
- `403 Forbidden` - Insufficient permissions

#### Validation Errors
- `400 Bad Request` - Invalid request parameters
- `422 Unprocessable Entity` - Validation failed

#### Server Errors
- `500 Internal Server Error` - Unexpected server error
- `503 Service Unavailable` - Service temporarily unavailable

### Error Handling Examples

```typescript
// Supabase error handling
const { data, error } = await supabase
  .from('beta_waitlist')
  .insert([{ name, email, note }]);

if (error) {
  if (error.code === '23505') {
    // Unique constraint violation
    throw new Error('Email already exists');
  }
  throw new Error('Failed to save entry');
}

// Stripe error handling
try {
  const response = await fetch('/api/stripe-checkout', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Payment failed');
  }
} catch (error) {
  console.error('Stripe error:', error);
  // Handle error appropriately
}
```

## Rate Limiting

### Supabase Rate Limits

Supabase applies rate limiting based on your plan:
- **Free tier**: 500 requests per second
- **Pro tier**: 1000 requests per second
- **Team tier**: 2500 requests per second

### Stripe Rate Limits

Stripe API has the following limits:
- **Live mode**: 100 requests per second
- **Test mode**: 25 requests per second

### Implementation

```typescript
// Implement exponential backoff for retries
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
```

## Security Considerations

### Row Level Security (RLS)

All tables use RLS policies to ensure data security:

```sql
-- Example RLS policy
CREATE POLICY "Users can view their own data"
  ON stripe_customers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);
```

### Input Validation

Always validate inputs on both client and server:

```typescript
// Client-side validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Server-side validation in edge functions
function validateParameters<T extends Record<string, any>>(
  values: T,
  expected: Expectations<T>
): string | undefined {
  // Validation logic
}
```

### Environment Variables

Never expose sensitive data in client-side code:

```typescript
// ✅ Good - server-side only
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');

// ❌ Bad - exposed to client
const stripeSecret = import.meta.env.VITE_STRIPE_SECRET_KEY;
```

---

For more information about the API, see the source code or contact hello@scoresweep.org.