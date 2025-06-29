import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// This function should be called via cron job to clean up expired reports
Deno.serve(async (req) => {
  try {
    console.log('Starting cleanup of expired reports...');

    // Find reports older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: expiredReports, error: queryError } = await supabase
      .from('reports')
      .select('report_id, pdf_url')
      .lt('created_at', thirtyDaysAgo.toISOString());

    if (queryError) {
      console.error('Error querying expired reports:', queryError);
      return new Response(
        JSON.stringify({ error: 'Failed to query expired reports' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!expiredReports || expiredReports.length === 0) {
      console.log('No expired reports found');
      return new Response(
        JSON.stringify({ message: 'No expired reports found', deleted_count: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${expiredReports.length} expired reports`);

    let deletedCount = 0;
    let errors: string[] = [];

    // Delete each expired report
    for (const report of expiredReports) {
      try {
        // Delete PDF file from storage
        const { error: storageError } = await supabase.storage
          .from('reports')
          .remove([report.pdf_url]);

        if (storageError) {
          console.error(`Storage deletion error for ${report.report_id}:`, storageError);
          errors.push(`Storage deletion failed for ${report.report_id}: ${storageError.message}`);
        }

        // Delete report from database (cascades to report_data)
        const { error: dbError } = await supabase
          .from('reports')
          .delete()
          .eq('report_id', report.report_id);

        if (dbError) {
          console.error(`Database deletion error for ${report.report_id}:`, dbError);
          errors.push(`Database deletion failed for ${report.report_id}: ${dbError.message}`);
        } else {
          deletedCount++;
          console.log(`Successfully deleted report ${report.report_id}`);
        }

      } catch (error: any) {
        console.error(`Error deleting report ${report.report_id}:`, error);
        errors.push(`Unexpected error for ${report.report_id}: ${error.message}`);
      }
    }

    const response = {
      message: `Cleanup completed. Deleted ${deletedCount} of ${expiredReports.length} expired reports.`,
      deleted_count: deletedCount,
      total_expired: expiredReports.length,
      errors: errors.length > 0 ? errors : undefined,
    };

    console.log('Cleanup completed:', response);

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Cleanup function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error during cleanup' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});