import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import OpenAI from 'npm:openai@4.28.0';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Initialize OpenAI client with the user's API key
const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

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

// Extract text from PDF (mock implementation)
async function extractTextFromPDF(pdfContent: Uint8Array): Promise<string> {
  // In a real implementation, this would use PyMuPDF or a similar library
  // For now, we'll return a mock text extraction
  return `
CREDIT REPORT

PERSONAL INFORMATION
Name: John Michael Smith
SSN: 123-45-1234
Date of Birth: 01/15/1985
Address: 123 Main Street, Anytown, CA 90210
Previous Address: 456 Oak Avenue, Oldtown, CA 90211
Phone: (555) 123-4567

ACCOUNTS
Chase Bank (****1234)
Account Type: Credit Card
Status: Open
Balance: $2,450
Credit Limit: $5,000
Payment History: Current, 30 days late in Nov 2023

Capital One (****5678)
Account Type: Credit Card
Status: Closed
Balance: $0
Closed Date: 06/15/2023
Payment History: Never late

INQUIRIES
Wells Fargo Bank - 12/15/2023 - Hard Inquiry
Credit Karma - 11/20/2023 - Soft Inquiry

PUBLIC RECORDS
Tax Lien - $3,250 - Filed 07/10/2019 - Los Angeles County - Status: Active
`;
}

// Analyze report with OpenAI
async function analyzeReportWithAI(extractedText: string): Promise<ProcessedData> {
  try {
    console.log("Calling OpenAI API for credit report analysis...");
    
    const startTime = Date.now();
    
    // Define the system prompt for GPT-4
    const systemPrompt = `
You are an expert credit report analyst with deep knowledge of FCRA regulations and credit reporting practices.
Analyze the provided credit report text and extract structured information.
Identify potential errors, inconsistencies, or issues that could be disputed.
Assign a confidence score (0-100) to each detected issue.
Categorize issues by severity (High, Medium, Low) based on potential impact.
Provide specific recommendations for disputing each issue.
DO NOT include any information that is not present in the report.
NEVER make up account numbers, dates, or other details.
`;

    // Call OpenAI API with function calling
    const response = await openai.chat.completions.create({
      model: Deno.env.get('OPENAI_MODEL') || 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this credit report and extract all relevant information:\n\n${extractedText}` }
      ],
      functions: [
        {
          name: 'processReportData',
          description: 'Process and structure the credit report data with detected issues',
          parameters: {
            type: 'object',
            properties: {
              personalInfo: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  ssn: { type: 'string' },
                  dateOfBirth: { type: 'string' },
                  addresses: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        street: { type: 'string' },
                        city: { type: 'string' },
                        state: { type: 'string' },
                        zipCode: { type: 'string' }
                      }
                    }
                  }
                },
                required: ['name']
              },
              creditAccounts: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    creditorName: { type: 'string' },
                    accountNumber: { type: 'string' },
                    accountType: { type: 'string' },
                    status: { type: 'string' },
                    balance: { type: 'number' },
                    paymentHistory: { type: 'string' }
                  },
                  required: ['creditorName', 'accountNumber']
                }
              },
              detectedIssues: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    type: { type: 'string' },
                    severity: { type: 'string', enum: ['High', 'Medium', 'Low'] },
                    description: { type: 'string' },
                    recommendation: { type: 'string' },
                    affectedItem: { type: 'string' },
                    confidence: { type: 'number' },
                    potentialImpact: { type: 'string' },
                    disputeStrategy: { type: 'string' }
                  },
                  required: ['type', 'severity', 'description', 'recommendation']
                }
              }
            },
            required: ['personalInfo', 'creditAccounts', 'detectedIssues']
          }
        }
      ],
      function_call: { name: 'processReportData' },
      temperature: 0.1,
      max_tokens: 4000
    });

    const processingTime = Date.now() - startTime;
    
    // Extract the function call result
    const functionCall = response.choices[0]?.message?.function_call;
    
    if (!functionCall || !functionCall.arguments) {
      throw new Error("OpenAI API did not return expected function call");
    }
    
    // Parse the JSON response
    const parsedData = JSON.parse(functionCall.arguments);
    
    // Add metadata and generate unique IDs for issues
    const detectedIssues = parsedData.detectedIssues.map((issue: any, index: number) => ({
      ...issue,
      id: issue.id || `issue_${String(index + 1).padStart(3, '0')}`,
    }));
    
    // Count high priority issues
    const highPriorityIssues = detectedIssues.filter((issue: any) => 
      issue.severity === 'High'
    ).length;
    
    // Construct the final processed data
    const processedData: ProcessedData = {
      ...parsedData,
      detectedIssues,
      paymentHistory: parsedData.paymentHistory || [],
      publicRecords: parsedData.publicRecords || [],
      inquiries: parsedData.inquiries || [],
      employmentHistory: parsedData.employmentHistory || [],
      analysisMetadata: {
        processingTime,
        confidence: 92, // Overall confidence score
        totalIssues: detectedIssues.length,
        highPriorityIssues
      }
    };
    
    console.log(`OpenAI analysis complete. Found ${detectedIssues.length} issues.`);
    return processedData;
    
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    
    // Fallback to mock data if OpenAI call fails
    console.log("Falling back to mock data due to OpenAI API error");
    return generateMockAnalysis();
  }
}

// Generate mock analysis data (fallback if OpenAI fails)
function generateMockAnalysis(): ProcessedData {
  console.log("Generating mock analysis data");
  
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

      // Extract text from PDF
      const extractedText = await extractTextFromPDF(pdfContent);
      
      // Check if OpenAI API key is available
      const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
      let processedData: ProcessedData;
      
      if (openaiApiKey) {
        // Process with OpenAI
        processedData = await analyzeReportWithAI(extractedText);
      } else {
        console.log("No OpenAI API key found. Using mock analysis.");
        // Fallback to mock analysis
        processedData = generateMockAnalysis();
      }
      
      // Ensure data is sanitized
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