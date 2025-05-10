// Run Migration Script
// This script will execute the SQL migration against your Supabase database
// Usage: node run_migration.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
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

// Read the SQL file
const sqlFilePath = path.join(__dirname, 'complete_database_setup_fixed.sql');
let sqlContent;

try {
  sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  console.log(`Successfully read SQL file: ${sqlFilePath}`);
} catch (error) {
  console.error(`Error reading SQL file: ${error.message}`);
  process.exit(1);
}

// Execute the SQL
async function runMigration() {
  console.log('Starting database migration...');
  
  try {
    // First, disable RLS to ensure we have full access
    const { error: rlsError } = await supabase.rpc('disable_rls');
    if (rlsError) {
      console.warn(`Warning: Could not disable RLS: ${rlsError.message}`);
      console.warn('Continuing with migration anyway...');
    } else {
      console.log('Successfully disabled RLS');
    }
    
    // Execute the SQL script
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error(`Error executing SQL: ${error.message}`);
      
      // If the exec_sql function doesn't exist, we'll need to split the SQL and run it in chunks
      if (error.message.includes('function "exec_sql" does not exist')) {
        console.log('The exec_sql function does not exist. Running SQL in chunks...');
        await runSqlInChunks();
      } else {
        process.exit(1);
      }
    } else {
      console.log('SQL migration completed successfully!');
    }
    
    // Verify database connection
    const { data, error: testError } = await supabase.from('settings').select('*').limit(1);
    
    if (testError) {
      console.error(`Error verifying database connection: ${testError.message}`);
    } else {
      console.log('Database connection verified successfully!');
      if (data && data.length > 0) {
        console.log(`Found ${data.length} settings records`);
      } else {
        console.log('No settings records found, but connection is working');
      }
    }
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  }
}

// Function to run SQL in chunks if the exec_sql function doesn't exist
async function runSqlInChunks() {
  // Split the SQL into individual statements (this is a simple approach and might not work for all SQL)
  const statements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);
  
  console.log(`Running ${statements.length} SQL statements individually...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      // Skip DO blocks and other complex statements that can't be run directly
      if (stmt.toUpperCase().startsWith('DO ') || 
          stmt.includes('$$') || 
          stmt.toUpperCase().startsWith('CREATE OR REPLACE FUNCTION')) {
        console.log(`Skipping complex statement #${i+1} (starts with: ${stmt.substring(0, 30)}...)`);
        continue;
      }
      
      const { error } = await supabase.rpc('exec_direct_sql', { sql: stmt + ';' });
      
      if (error) {
        console.error(`Error executing statement #${i+1}: ${error.message}`);
        console.error(`Statement: ${stmt.substring(0, 100)}...`);
        errorCount++;
      } else {
        successCount++;
      }
    } catch (error) {
      console.error(`Exception executing statement #${i+1}: ${error.message}`);
      errorCount++;
    }
  }
  
  console.log(`Completed running SQL in chunks. Success: ${successCount}, Errors: ${errorCount}`);
}

// Run the migration
runMigration()
  .then(() => {
    console.log('Migration script completed');
  })
  .catch(error => {
    console.error(`Migration failed: ${error.message}`);
    process.exit(1);
  });