# ScoreSweep Backend API Documentation

This document describes the backend API endpoints for ScoreSweep's credit report processing system.

## Base URL

All API endpoints are hosted on Supabase Edge Functions:
```
https://your-project-id.supabase.co/functions/v1/
```

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <supabase_jwt_token>
```

## Endpoints

### 1. Upload Report

**POST** `/upload`

Upload a PDF credit report for processing.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field containing PDF

**Validation:**
- File must be PDF format
- Maximum file size: 10MB
- User must be authenticated

**Response:**
```json
{
  "report_id": "uuid",
  "status": "uploaded",
  "pdf_url": "user_id/report_id.pdf"
}
```

**Example:**
```javascript
const formData = new FormData();
formData.append('file', pdfFile);

const response = await fetch(`${supabaseUrl}/functions/v1/upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData,
});
```

### 2. Process Report

**POST** `/process/{report_id}`

Trigger AI processing of an uploaded report.

**Parameters:**
- `report_id`: UUID of the uploaded report

**Processing Steps:**
1. Downloads PDF from Supabase Storage
2. Extracts text using PyMuPDF simulation
3. Sanitizes sensitive information (SSNs, account numbers)
4. Analyzes with mock AI (simulates GPT-4 analysis)
5. Saves processed data to database

**Response:**
```json
{
  "report_id": "uuid",
  "status": "processed",
  "issues_found": 3,
  "confidence": 92
}
```

**Example:**
```javascript
const response = await fetch(`${supabaseUrl}/functions/v1/process/${reportId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

### 3. Get Report Data

**GET** `/report/{report_id}`

Retrieve complete processed report data.

**Parameters:**
- `report_id`: UUID of the report

**Response:**
```json
{
  "report_id": "uuid",
  "status": "processed",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:32:00Z",
  "processed_at": "2024-01-15T10:32:00Z",
  "data": {
    "personalInfo": {
      "name": "John Michael Smith",
      "ssn": "***-**-1234",
      "dateOfBirth": "01/15/1985",
      "addresses": [...]
    },
    "creditAccounts": [...],
    "detectedIssues": [...],
    "analysisMetadata": {
      "processingTime": 2000,
      "confidence": 92,
      "totalIssues": 3,
      "highPriorityIssues": 2
    }
  }
}
```

### 4. Get Report Status

**GET** `/report/{report_id}/status`

Get just the processing status of a report.

**Response:**
```json
{
  "report_id": "uuid",
  "status": "processing",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:31:00Z"
}
```

**Status Values:**
- `uploaded`: File uploaded, ready for processing
- `processing`: Currently being analyzed
- `processed`: Analysis complete
- `error`: Processing failed

### 5. Generate Dispute Documents

**POST** `/generate-dispute/{report_id}`

Generate dispute letters and call scripts based on selected issues.

**Request Body:**
```json
{
  "selectedIssues": ["issue_001", "issue_002"],
  "letterType": "dispute",
  "customizations": {
    "recipientName": "Experian Consumer Assistance",
    "recipientAddress": "P.O. Box 4500, Allen, TX 75013",
    "senderName": "John Michael Smith",
    "senderAddress": "123 Main Street, Anytown, CA 90210"
  },
  "outputFormat": "text"
}
```

**Letter Types:**
- `dispute`: Standard dispute letter
- `validation`: Debt validation request
- `goodwill`: Goodwill removal request

**Response:**
```json
{
  "report_id": "uuid",
  "letter_content": "Dear Sir or Madam...",
  "call_script": "PHONE DISPUTE SCRIPT...",
  "generated_at": "2024-01-15T10:35:00Z",
  "download_url": "optional_pdf_url"
}
```

### 6. Delete Report

**DELETE** `/delete/{report_id}`

Delete a report and its associated PDF file.

**Parameters:**
- `report_id`: UUID of the report to delete

**Response:**
```json
{
  "report_id": "uuid",
  "message": "Report deleted successfully",
  "deleted_at": "2024-01-15T10:40:00Z"
}
```

### 7. Cleanup Expired Reports

**POST** `/cleanup-expired`

Internal endpoint for cleaning up reports older than 30 days. Should be called via cron job.

**Response:**
```json
{
  "message": "Cleanup completed. Deleted 5 of 5 expired reports.",
  "deleted_count": 5,
  "total_expired": 5
}
```

## Data Models

### Report
```typescript
interface Report {
  report_id: string;
  user_id: string;
  pdf_url: string;
  status: 'uploaded' | 'processing' | 'processed' | 'error';
  created_at: string;
  updated_at: string;
}
```

### Processed Data
```typescript
interface ProcessedData {
  personalInfo: {
    name: string;
    ssn: string; // Masked: ***-**-1234
    dateOfBirth: string;
    addresses: Address[];
  };
  creditAccounts: CreditAccount[];
  paymentHistory: PaymentRecord[];
  publicRecords: PublicRecord[];
  inquiries: Inquiry[];
  employmentHistory: Employment[];
  detectedIssues: DetectedIssue[];
  analysisMetadata: {
    processingTime: number;
    confidence: number;
    totalIssues: number;
    highPriorityIssues: number;
  };
}
```

### Detected Issue
```typescript
interface DetectedIssue {
  id: string;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
  affectedItem: string;
  confidence: number; // 0-100
  potentialImpact: string;
  disputeStrategy: string;
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created (for uploads)
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid token)
- `404`: Not Found (report doesn't exist)
- `500`: Internal Server Error

## Security Features

### Data Protection
- All sensitive data (SSNs, account numbers) is masked in responses
- Files are automatically deleted after 30 days
- Row Level Security ensures users can only access their own data

### Input Validation
- File type validation (PDF only)
- File size limits (10MB max)
- User authentication required for all operations

### Privacy Compliance
- No full SSNs or account numbers stored
- Automatic data expiration
- Audit trails for all operations

## Rate Limiting

Supabase Edge Functions have built-in rate limiting:
- 100 requests per second for authenticated users
- Additional limits may apply based on your Supabase plan

## Deployment

Deploy all functions to Supabase:

```bash
# Deploy individual functions
supabase functions deploy upload
supabase functions deploy process
supabase functions deploy report
supabase functions deploy generate-dispute
supabase functions deploy delete-report
supabase functions deploy cleanup-expired

# Or deploy all at once
supabase functions deploy
```

## Environment Variables

Set these in your Supabase project:

```bash
# Required for all functions
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: OpenAI API key for real AI processing
OPENAI_API_KEY=your-openai-api-key
```

## Monitoring

Monitor function performance and errors in the Supabase dashboard:
- Function logs and metrics
- Error tracking and alerting
- Performance monitoring

## Example Integration

Here's how to integrate with the frontend:

```typescript
class ScoreSweepAPI {
  constructor(private supabaseUrl: string, private getToken: () => string) {}

  async uploadReport(file: File): Promise<{ report_id: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.supabaseUrl}/functions/v1/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
      body: formData,
    });

    return response.json();
  }

  async processReport(reportId: string): Promise<void> {
    await fetch(`${this.supabaseUrl}/functions/v1/process/${reportId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getReport(reportId: string): Promise<any> {
    const response = await fetch(`${this.supabaseUrl}/functions/v1/report/${reportId}`, {
      headers: { 'Authorization': `Bearer ${this.getToken()}` },
    });

    return response.json();
  }

  async generateDispute(reportId: string, options: any): Promise<any> {
    const response = await fetch(`${this.supabaseUrl}/functions/v1/generate-dispute/${reportId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    return response.json();
  }
}
```

This backend provides a complete API for ScoreSweep's credit report processing workflow, from upload to dispute generation, with enterprise-grade security and privacy protection.