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

interface DisputeRequest {
  selectedIssues: string[];
  letterType: 'dispute' | 'validation' | 'goodwill';
  customizations?: {
    recipientName?: string;
    recipientAddress?: string;
    senderName?: string;
    senderAddress?: string;
  };
  outputFormat: 'text' | 'pdf';
}

interface DisputeResponse {
  report_id: string;
  letter_content: string;
  call_script: string;
  generated_at: string;
  download_url?: string; // For PDF format
}

// Generate dispute letter content using OpenAI
async function generateDisputeLetterWithAI(
  issues: any[],
  customizations: any = {},
  letterType: string = 'dispute'
): Promise<string> {
  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log("No OpenAI API key found. Using template-based generation.");
      return generateDisputeLetterFromTemplate(issues, customizations, letterType);
    }
    
    console.log("Generating dispute letter with OpenAI...");
    
    const defaults = {
      recipientName: 'Credit Bureau Consumer Assistance',
      recipientAddress: 'P.O. Box 4500, Allen, TX 75013',
      senderName: 'John Michael Smith',
      senderAddress: '123 Main Street, Anytown, CA 90210',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    const merged = { ...defaults, ...customizations };
    
    // Create a prompt for the letter generation
    const prompt = `
Generate a professional ${letterType} letter for credit report errors. Use the following information:

SENDER INFORMATION:
Name: ${merged.senderName}
Address: ${merged.senderAddress}
Date: ${merged.date}

RECIPIENT INFORMATION:
Name: ${merged.recipientName}
Address: ${merged.recipientAddress}

LETTER TYPE: ${letterType.toUpperCase()}

ISSUES TO DISPUTE:
${issues.map((issue, index) => `
${index + 1}. ${issue.type}
   Description: ${issue.description}
   Affected Item: ${issue.affectedItem}
   Recommendation: ${issue.recommendation}
   Confidence: ${issue.confidence}%
   Impact: ${issue.potentialImpact}
`).join('\n')}

REQUIREMENTS:
1. Follow FCRA (Fair Credit Reporting Act) guidelines
2. Be professional and concise
3. Include all necessary legal language
4. Format as a proper business letter
5. For dispute letters, cite the 30-day investigation requirement
6. For validation letters, request specific documentation
7. For goodwill letters, emphasize customer relationship and future business

Generate ONLY the letter content, no additional commentary.
`;

    const response = await openai.chat.completions.create({
      model: Deno.env.get('OPENAI_MODEL') || 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert in credit repair and FCRA regulations. You write professional, legally compliant dispute letters.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const letterContent = response.choices[0]?.message?.content || '';
    
    if (!letterContent) {
      throw new Error("OpenAI API did not return expected content");
    }
    
    return letterContent;
    
  } catch (error) {
    console.error("Error generating letter with OpenAI:", error);
    // Fallback to template-based generation
    return generateDisputeLetterFromTemplate(issues, customizations, letterType);
  }
}

// Generate dispute letter from template (fallback method)
function generateDisputeLetterFromTemplate(
  issues: any[],
  customizations: any = {},
  letterType: string = 'dispute'
): string {
  const defaults = {
    recipientName: 'Credit Bureau Consumer Assistance',
    recipientAddress: 'P.O. Box 4500, Allen, TX 75013',
    senderName: 'John Michael Smith',
    senderAddress: '123 Main Street, Anytown, CA 90210',
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };

  const merged = { ...defaults, ...customizations };

  let letterContent = `${merged.date}

${merged.recipientName}
${merged.recipientAddress}

Dear Sir or Madam,

`;

  switch (letterType) {
    case 'dispute':
      letterContent += `I am writing to dispute the following information in my credit file. The items listed below are inaccurate or incomplete, and I am requesting that they be removed or corrected.

DISPUTED ITEMS:

${issues.map((issue, index) => `${index + 1}. ${issue.description}
   Reason: ${issue.recommendation}
   Affected Item: ${issue.affectedItem}
   Confidence Level: ${issue.confidence}%
`).join('\n')}

I have enclosed copies of supporting documentation that verify the inaccuracies of these items. Please investigate these matters and remove or correct the inaccurate information as soon as possible.

Under the Fair Credit Reporting Act, you have 30 days to investigate and respond to this dispute. Please send me written confirmation of the results of your investigation.`;
      break;

    case 'validation':
      letterContent += `I am requesting validation of the following debts that appear on my credit report:

ITEMS REQUIRING VALIDATION:

${issues.map((issue, index) => `${index + 1}. ${issue.affectedItem}
   Description: ${issue.description}
   Reason for Validation Request: ${issue.recommendation}
`).join('\n')}

Under the Fair Debt Collection Practices Act and the Fair Credit Reporting Act, I have the right to request validation of these debts. Please provide:

1. Proof that you own or are authorized to collect on this debt
2. A copy of the original signed agreement or application
3. A complete payment history
4. Proof of your license to collect in my state

If you cannot validate these debts, they must be removed from my credit report immediately.`;
      break;

    case 'goodwill':
      letterContent += `I am writing to request your consideration in removing the following negative items from my credit report as a gesture of goodwill:

ITEMS FOR GOODWILL CONSIDERATION:

${issues.map((issue, index) => `${index + 1}. ${issue.affectedItem}
   Issue: ${issue.description}
   Impact: ${issue.potentialImpact}
`).join('\n')}

I have been a valued customer and have worked hard to improve my financial situation. These items are negatively impacting my credit score and my ability to secure favorable lending terms.

I would greatly appreciate your consideration in removing these items as a goodwill gesture. I am committed to maintaining a positive relationship and continuing to make timely payments.`;
      break;
  }

  letterContent += `

Sincerely,

${merged.senderName}
${merged.senderAddress}

Enclosures: Supporting documentation`;

  return letterContent;
}

// Generate phone script using OpenAI
async function generatePhoneScriptWithAI(issues: any[], bureau: string = 'Credit Bureau'): Promise<string> {
  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log("No OpenAI API key found. Using template-based script generation.");
      return generatePhoneScriptFromTemplate(issues, bureau);
    }
    
    console.log("Generating phone script with OpenAI...");
    
    // Create a prompt for the script generation
    const prompt = `
Generate a professional phone script for disputing credit report errors with ${bureau}. Use the following issues:

ISSUES TO DISPUTE:
${issues.map((issue, index) => `
${index + 1}. ${issue.type}
   Description: ${issue.description}
   Affected Item: ${issue.affectedItem}
   Recommendation: ${issue.recommendation}
   Confidence: ${issue.confidence}%
   Impact: ${issue.potentialImpact}
`).join('\n')}

REQUIREMENTS:
1. Include an introduction section
2. Create a separate section for each issue to dispute
3. Include a closing section with follow-up instructions
4. Add a section for handling common questions/objections
5. Include a checklist of items to have ready before the call
6. Format as a clear, easy-to-follow script with section headers
7. Use professional but conversational language
8. Include placeholders for personal information like [YOUR NAME]

Generate ONLY the phone script, no additional commentary.
`;

    const response = await openai.chat.completions.create({
      model: Deno.env.get('OPENAI_MODEL') || 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert in credit repair and FCRA regulations. You create effective scripts for disputing credit report errors by phone.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const scriptContent = response.choices[0]?.message?.content || '';
    
    if (!scriptContent) {
      throw new Error("OpenAI API did not return expected content");
    }
    
    return scriptContent;
    
  } catch (error) {
    console.error("Error generating phone script with OpenAI:", error);
    // Fallback to template-based generation
    return generatePhoneScriptFromTemplate(issues, bureau);
  }
}

// Generate phone script from template (fallback method)
function generatePhoneScriptFromTemplate(issues: any[], bureau: string = 'Credit Bureau'): string {
  return `PHONE DISPUTE SCRIPT - ${bureau.toUpperCase()}

PREPARATION CHECKLIST:
□ Have your credit report ready
□ Have supporting documents available
□ Pen and paper for notes
□ Reference number from any previous correspondence

INTRODUCTION:
"Hello, I'm calling to dispute some inaccurate information on my credit report. My name is [YOUR NAME] and my Social Security Number is [XXX-XX-XXXX]."

DISPUTED ITEMS:

${issues.map((issue, index) => `
Item ${index + 1} - ${issue.type}:
"I need to dispute ${issue.affectedItem}. ${issue.description}. ${issue.recommendation}."

Key Points to Mention:
- Confidence level: ${issue.confidence}%
- Potential impact: ${issue.potentialImpact}
- Strategy: ${issue.disputeStrategy}
`).join('')}

CLOSING:
"Can you please start an investigation into these items? I'd like to receive written confirmation of the dispute and the results once your investigation is complete. What's the reference number for this dispute?"

IMPORTANT NOTES:
- Take detailed notes including representative name and ID
- Get reference numbers for all disputes
- Ask for written confirmation
- Follow up in writing within 24 hours
- Keep records of all communications

FOLLOW-UP ACTIONS:
1. Send written dispute letter within 24 hours
2. Include copies of supporting documentation
3. Send via certified mail with return receipt
4. Keep copies of all correspondence
5. Follow up if no response within 30 days

SAMPLE RESPONSES TO COMMON QUESTIONS:

Q: "Why do you believe this information is incorrect?"
A: "I have documentation that proves [specific reason]. The information on my report does not match my records."

Q: "Do you have supporting documentation?"
A: "Yes, I will be sending copies of [list documents] via certified mail today."

Q: "This may take 30 days to investigate."
A: "I understand. Please provide me with a reference number and confirm that I will receive written notification of the results."`;
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

    // Parse request body
    const requestData: DisputeRequest = await req.json();

    if (!requestData.selectedIssues || requestData.selectedIssues.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one issue must be selected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get report and processed data
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

    if (report.status !== 'processed') {
      return new Response(
        JSON.stringify({ error: 'Report must be processed before generating disputes' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get processed data
    const { data: reportData, error: dataError } = await supabase
      .from('report_data')
      .select('*')
      .eq('report_id', reportId)
      .single();

    if (dataError || !reportData) {
      return new Response(
        JSON.stringify({ error: 'Processed data not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter selected issues
    const allIssues = reportData.processed_json.detectedIssues || [];
    const selectedIssueObjects = allIssues.filter((issue: any) => 
      requestData.selectedIssues.includes(issue.id)
    );

    if (selectedIssueObjects.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Selected issues not found in report data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate dispute letter using OpenAI if API key is available
    const letterContent = await generateDisputeLetterWithAI(
      selectedIssueObjects,
      requestData.customizations,
      requestData.letterType
    );

    // Generate phone script using OpenAI if API key is available
    const callScript = await generatePhoneScriptWithAI(
      selectedIssueObjects,
      requestData.customizations?.recipientName || 'Credit Bureau'
    );

    const response: DisputeResponse = {
      report_id: reportId,
      letter_content: letterContent,
      call_script: callScript,
      generated_at: new Date().toISOString(),
    };

    // If PDF format requested, you would generate PDF here
    // For now, we'll just return text format
    if (requestData.outputFormat === 'pdf') {
      // TODO: Implement PDF generation
      response.download_url = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/reports/generated/${reportId}_dispute.pdf`;
    }

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Generate dispute function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});