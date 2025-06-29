import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
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
    const reportId = pathParts[pathParts.length - 2]; // /report/{id}/status or /report/{id}
    const action = pathParts[pathParts.length - 1]; // 'status' or report_id

    let actualReportId: string;
    let isStatusRequest = false;

    if (action === 'status') {
      actualReportId = reportId;
      isStatusRequest = true;
    } else {
      actualReportId = action;
      isStatusRequest = false;
    }

    if (!actualReportId) {
      return new Response(
        JSON.stringify({ error: 'Report ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get report from database
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('report_id', actualReportId)
      .eq('user_id', user.id)
      .single();

    if (reportError || !report) {
      return new Response(
        JSON.stringify({ error: 'Report not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If status request, return just the status
    if (isStatusRequest) {
      return new Response(
        JSON.stringify({
          report_id: report.report_id,
          status: report.status,
          created_at: report.created_at,
          updated_at: report.updated_at,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For full report request, check if processed
    if (report.status !== 'processed') {
      return new Response(
        JSON.stringify({
          report_id: report.report_id,
          status: report.status,
          message: 'Report is not yet processed',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get processed data
    const { data: reportData, error: dataError } = await supabase
      .from('report_data')
      .select('*')
      .eq('report_id', actualReportId)
      .single();

    if (dataError || !reportData) {
      return new Response(
        JSON.stringify({ error: 'Processed data not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return full report with processed data
    const response = {
      report_id: report.report_id,
      status: report.status,
      created_at: report.created_at,
      updated_at: report.updated_at,
      processed_at: reportData.processed_at,
      data: reportData.processed_json,
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Report function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});