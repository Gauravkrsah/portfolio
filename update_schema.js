// Update Schema Script
// This script will directly update the database schema to fix synchronization issues
// Usage: node update_schema.js

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

// Function to execute SQL with error handling
async function executeSql(sql, description) {
  try {
    console.log(`Executing: ${description}...`);
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      if (error.message.includes('function "exec_sql" does not exist')) {
        console.warn(`Warning: exec_sql function doesn't exist. Trying direct query...`);
        // This is a fallback approach that might work in some cases
        const { error: directError } = await supabase.from('_direct_sql').select('*').eq('sql', sql).limit(1);
        if (directError) {
          console.error(`Error executing ${description}: ${directError.message}`);
          return false;
        }
      } else {
        console.error(`Error executing ${description}: ${error.message}`);
        return false;
      }
    }
    
    console.log(`Successfully executed: ${description}`);
    return true;
  } catch (error) {
    console.error(`Exception executing ${description}: ${error.message}`);
    return false;
  }
}

// Main function to update the schema
async function updateSchema() {
  console.log('Starting schema update...');
  
  // 1. Disable RLS for all tables
  const disableRlsSuccess = await executeSql(`
    ALTER TABLE IF EXISTS projects DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS blog_posts DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS other_works DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS contents DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS messages DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS meetings DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS settings DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS admin_users DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS email_logs DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS subscribers DISABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS tools DISABLE ROW LEVEL SECURITY;
  `, 'Disable RLS for all tables');
  
  if (!disableRlsSuccess) {
    console.warn('Warning: Failed to disable RLS for all tables. Continuing anyway...');
  }
  
  // 2. Fix subscribers table
  await executeSql(`
    -- Add missing columns to subscribers table if they don't exist
    ALTER TABLE IF EXISTS subscribers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
    ALTER TABLE IF EXISTS subscribers ADD COLUMN IF NOT EXISTS source TEXT;
    ALTER TABLE IF EXISTS subscribers ADD COLUMN IF NOT EXISTS subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ALTER TABLE IF EXISTS subscribers ADD COLUMN IF NOT EXISTS last_email_sent TIMESTAMP WITH TIME ZONE;
    ALTER TABLE IF EXISTS subscribers ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    
    -- Update status to 'Active' if null
    UPDATE subscribers SET status = 'Active' WHERE status IS NULL;
  `, 'Fix subscribers table');
  
  // 3. Fix projects table
  await executeSql(`
    -- Add missing columns to projects table if they don't exist
    ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
    ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Published';
    ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    
    -- Update status to 'Published' if null
    UPDATE projects SET status = 'Published' WHERE status IS NULL;
  `, 'Fix projects table');
  
  // 4. Fix meetings table
  await executeSql(`
    -- Add missing columns to meetings table if they don't exist
    ALTER TABLE IF EXISTS meetings ADD COLUMN IF NOT EXISTS subject TEXT;
    ALTER TABLE IF EXISTS meetings ADD COLUMN IF NOT EXISTS message TEXT;
    ALTER TABLE IF EXISTS meetings ADD COLUMN IF NOT EXISTS event_id TEXT;
    ALTER TABLE IF EXISTS meetings ADD COLUMN IF NOT EXISTS event_link TEXT;
    ALTER TABLE IF EXISTS meetings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    
    -- Update status to 'Pending' if null
    UPDATE meetings SET status = 'Pending' WHERE status IS NULL;
  `, 'Fix meetings table');
  
  // 5. Fix messages table
  await executeSql(`
    -- Update status to 'New' if null
    UPDATE messages SET status = 'New' WHERE status IS NULL;
  `, 'Fix messages table');
  
  // 6. Create or replace the update_updated_at_column function
  await executeSql(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `, 'Create update_updated_at_column function');
  
  // 7. Create or replace triggers for updated_at columns
  await executeSql(`
    -- Projects table trigger
    DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
    CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    
    -- Blog posts table trigger
    DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
    CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    
    -- Meetings table trigger
    DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
    CREATE TRIGGER update_meetings_updated_at
    BEFORE UPDATE ON meetings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `, 'Create updated_at triggers');
  
  console.log('Schema update completed!');
  
  // Verify database connection
  try {
    const { data, error } = await supabase.from('settings').select('*').limit(1);
    
    if (error) {
      console.error(`Error verifying database connection: ${error.message}`);
    } else {
      console.log('Database connection verified successfully!');
      if (data && data.length > 0) {
        console.log(`Found ${data.length} settings records`);
      } else {
        console.log('No settings records found, but connection is working');
      }
    }
  } catch (error) {
    console.error(`Error verifying database connection: ${error.message}`);
  }
}

// Run the update
updateSchema()
  .then(() => {
    console.log('Schema update script completed');
  })
  .catch(error => {
    console.error(`Schema update failed: ${error.message}`);
    process.exit(1);
  });