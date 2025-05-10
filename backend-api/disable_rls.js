// Disable RLS Script
// This script will disable Row Level Security for all tables in your Supabase database
// Usage: node disable_rls.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client with service role key (admin access)
const supabaseUrl = process.env.VITE_NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials in environment variables');
  console.error('Make sure VITE_NEXT_PUBLIC_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

// List of tables to disable RLS for
const tables = [
  'projects',
  'blog_posts',
  'other_works',
  'contents',
  'messages',
  'meetings',
  'settings',
  'admin_users',
  'email_logs',
  'subscribers',
  'tools'
];

async function disableRLS() {
  console.log('Starting to disable RLS for all tables...');
  
  // First try to use the disable_rls function if it exists
  try {
    const { error } = await supabase.rpc('disable_rls');
    
    if (!error) {
      console.log('Successfully disabled RLS using the disable_rls function');
      return true;
    } else {
      console.warn(`Warning: Could not use disable_rls function: ${error.message}`);
      console.log('Falling back to disabling RLS for each table individually...');
    }
  } catch (error) {
    console.warn(`Warning: Error calling disable_rls function: ${error.message}`);
    console.log('Falling back to disabling RLS for each table individually...');
  }
  
  // If the function approach failed, disable RLS for each table individually
  let successCount = 0;
  let errorCount = 0;
  
  for (const table of tables) {
    try {
      // SQL to disable RLS for a specific table
      const sql = `ALTER TABLE IF EXISTS ${table} DISABLE ROW LEVEL SECURITY;`;
      
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        // If exec_sql doesn't exist, try direct SQL execution
        if (error.message.includes('function "exec_sql" does not exist')) {
          // This is a fallback but might not work in all Supabase instances
          const { error: directError } = await supabase.from('_exec_sql').select('*').eq('sql', sql).limit(1);
          
          if (directError) {
            console.error(`Error disabling RLS for table ${table}: ${directError.message}`);
            errorCount++;
            continue;
          }
        } else {
          console.error(`Error disabling RLS for table ${table}: ${error.message}`);
          errorCount++;
          continue;
        }
      }
      
      console.log(`Successfully disabled RLS for table: ${table}`);
      successCount++;
    } catch (error) {
      console.error(`Exception disabling RLS for table ${table}: ${error.message}`);
      errorCount++;
    }
  }
  
  console.log(`Completed disabling RLS. Success: ${successCount}, Errors: ${errorCount}`);
  return successCount > 0;
}

// Run the function
disableRLS()
  .then(success => {
    if (success) {
      console.log('RLS has been disabled for tables in your database');
      
      // Verify by trying to access a table
      return supabase.from('settings').select('*').limit(1);
    } else {
      console.error('Failed to disable RLS for any tables');
      process.exit(1);
    }
  })
  .then(({ data, error }) => {
    if (error) {
      console.error(`Error verifying database access: ${error.message}`);
    } else {
      console.log('Database access verified successfully!');
      if (data && data.length > 0) {
        console.log(`Found ${data.length} settings records`);
      } else {
        console.log('No settings records found, but connection is working');
      }
    }
  })
  .catch(error => {
    console.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  });