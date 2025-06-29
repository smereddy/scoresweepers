import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessedData {
  personalInfo: {
    name: string;
    ssn: string;
    dateOfBirth: string;
    addresses: Array<{
      street: string;
      city: string;
      state: string;
      zipCode: string;
    }>;
  };
  creditAccounts: Array<{
    creditorName: string;
    accountNumber: string;
    accountType: string;
    status: string;
    balance: number;
    paymentHistory: string;
  }>;
  paymentHistory: Array<{
    month: string;
    status: string;
    creditor: string;
  }>;
  publicRecords: Array<{
    type: string;
    amount: number;
    date: string;
    status: string;
  }>;
  inquiries: Array<{
    company: string;
    date: string;
    type: string;
  }>;
  employmentHistory: Array<{
    employer: string;
    position: string;
    dateRange: string;
  }>;
  detectedIssues: Array<{
    id: string;
    type: string;
    severity: 'High' | 'Medium' | 'Low';
    description: string;
    recommendation: string;
    affectedItem: string;
    confidence: number;
    potentialImpact: string;
    disputeStrategy: string;
  }>;
  analysisMetadata: {
    processingTime: number;
    confidence: number;
    totalIssues: number;
    highPriorityIssues: number;
  };
}

// Mock AI analysis function (replace with actual OpenAI integration)
async function analyzeReport(pdfContent: Uint8Array): Promise<ProcessedData> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock extracted and analyzed data
  const mockData: ProcessedData = {
    personalInfo: {
      name: "John Michael Smith",
      ssn: "***-**-1234",
      dateOfBirth: "01/15/1985",
      addresses: [
        {
          street: "123 Main Street",
          city: "Anytown",
          state: "CA",
          zipCode: "90210"
        },
        {
          street: "456 Oak Avenue",
          city: "Oldtown",
          state: "CA",
          zipCode: "90211"
        }
      ]
    },
    creditAccounts: [
      {
        creditorName: "Chase Bank",
        accountNumber: "****1234",
        accountType: "Credit Card",
        status: "Open",
        balance: 2450,
        paymentHistory: "30 days late (1 time)"
      },
      {
        creditorName: "Capital One",
        accountNumber: "****5678",
        accountType: "Credit Card",
        status: "Closed",
        balance: 0,
        paymentHistory: "Never late"
      }
    ],
    paymentHistory: [
      {
        month: "2024-01",
        status: "OK",
        creditor: "Chase Bank"
      },
      {
        month: "2023-12",
        status: "OK",
        creditor: "Chase Bank"
      },
      {
        month: "2023-11",
        status: "30",
        creditor: "Chase Bank"
      }
    ],
    publicRecords: [
      {
        type: "Tax Lien",
        amount: 3250,
        date: "2019-07-10",
        status: "Satisfied"
      }
    ],
    inquiries: [
      {
        company: "Wells Fargo Bank",
        date: "2023-12-15",
        type: "Hard Inquiry"
      },
      {
        company: "Credit Karma",
        date: "2023-11-20",
        type: "Soft Inquiry"
      }
    ],
    employmentHistory: [
      {
        employer: "Tech Solutions Inc.",
        position: "Software Engineer",
        dateRange: "2022-Present"
      },
      {
        employer: "Digital Marketing Co.",
        position: "Developer",
        dateRange: "2020-2022"
      }
    ],
    detectedIssues: [
      {
        id: "issue_001",
        type: "Payment History Error",
        severity: "High",
        description: "Chase Bank account shows 30-day late payment in November 2023, but payment records indicate it was made on time",
        recommendation: "Dispute the incorrect late payment with supporting documentation",
        affectedItem: "Chase Bank Credit Card (****1234)",
        confidence: 95,
        potentialImpact: "Could improve credit score by 15-25 points",
        disputeStrategy: "Provide bank statements showing on-time payment and request correction"
      },
      {
        id: "issue_002",
        type: "Public Record Error",
        severity: "High",
        description: "Tax lien from 2019 shows as active but was actually satisfied in 2021",
        recommendation: "Dispute with proof of satisfaction and request removal or status update",
        affectedItem: "Tax Lien (2019-07-10)",
        confidence: 90,
        potentialImpact: "Could improve credit score by 20-35 points",
        disputeStrategy: "Submit satisfaction documents and court records showing lien release"
      },
      {
        id: "issue_003",
        type: "Personal Info Error",
        severity: "Medium",
        description: "Old address still showing as current address",
        recommendation: "Update address information to reflect current residence",
        affectedItem: "456 Oak Avenue, Oldtown, CA 90211",
        confidence: 85,
        potentialImpact: "Improves report accuracy and prevents identity confusion",
        disputeStrategy: "Provide current utility bills or lease agreement as proof of address"
      }
    ],
    analysisMetadata: {
      processingTime: 2000,
      confidence: 92,
      totalIssues: 3,
      highPriorityIssues: 2
    }
  };

  return mockData;
}

// Sanitize sensitive information
function sanitizeData(data: ProcessedData): ProcessedData {
  // Remove or mask sensitive information
  const sanitized = { ...data };
  
  // Mask SSN
  if (sanitized.personalInfo.ssn && !sanitized.personalInfo.ssn.includes('*')) {
    sanitized.personalInfo.ssn = '***-**-' + sanitized.personalInfo.ssn.slice(-4);
  }
  
  // Mask account numbers
  sanitized.creditAccounts = sanitized.creditAccounts.map(account => ({
    ...account,
    accountNumber: account.accountNumber.includes('*') 
      ? account.accountNumber 
      : '****' + account.accountNumber.slice(-4)
  }));

  return sanitized;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get report_id from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const reportId = pathParts[pathParts.length - 1];

    if (!reportId) {
      return new Response(
        JSON.stringify({ error: 'Report ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get report from database
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('report_id', reportId)
      .eq('user_id', user.id)
      .single();

    if (reportError || !report) {
      return new Response(
        JSON.stringify({ error: 'Report not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (report.status !== 'uploaded') {
      return new Response(
        JSON.stringify({ error: 'Report has already been processed or is in processing' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update status to processing
    await supabase
      .from('reports')
      .update({ status: 'processing' })
      .eq('report_id', reportId);

    try {
      // Download PDF from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('reports')
        .download(report.pdf_url);

      if (downloadError || !fileData) {
        throw new Error('Failed to download PDF file');
      }

      // Convert to Uint8Array for processing
      const pdfContent = new Uint8Array(await fileData.arrayBuffer());

      // Process with AI (mock implementation)
      const processedData = await analyzeReport(pdfContent);
      
      // Sanitize sensitive information
      const sanitizedData = sanitizeData(processedData);

      // Save processed data
      const { error: saveError } = await supabase
        .from('report_data')
        .insert({
          report_id: reportId,
          processed_json: sanitizedData,
        });

      if (saveError) {
        throw new Error('Failed to save processed data');
      }

      // Update report status to processed
      await supabase
        .from('reports')
        .update({ status: 'processed' })
        .eq('report_id', reportId);

      return new Response(
        JSON.stringify({
          report_id: reportId,
          status: 'processed',
          issues_found: sanitizedData.detectedIssues.length,
          confidence: sanitizedData.analysisMetadata.confidence,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (processingError) {
      console.error('Processing error:', processingError);
      
      // Update status to error
      await supabase
        .from('reports')
        .update({ status: 'error' })
        .eq('report_id', reportId);

      return new Response(
        JSON.stringify({ error: 'Failed to process report' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: any) {
    console.error('Process function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});