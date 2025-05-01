// Script to directly alter the projects table in Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables
const SUPABASE_URL = process.env.VITE_NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// SQL to alter the projects table
const alterTableSQL = `
-- Add new columns to the projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS additional_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS video_platform TEXT;
`;

async function alterTable() {
  try {
    console.log('Altering projects table...');
    
    // Execute the SQL using the Supabase REST API
    const { data, error } = await supabase.rpc('pg_query', { query: alterTableSQL });
    
    if (error) {
      console.error('Error altering table:', error);
      
      // If pg_query function doesn't exist, we need to create it first
      if (error.message.includes('function pg_query') || error.message.includes('does not exist')) {
        console.log('Creating pg_query function...');
        
        const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION pg_query(query text)
        RETURNS json AS $$
        DECLARE
          result json;
        BEGIN
          EXECUTE query;
          result := json_build_object('success', true);
          RETURN result;
        EXCEPTION WHEN OTHERS THEN
          result := json_build_object('success', false, 'error', SQLERRM);
          RETURN result;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        `;
        
        const { error: createFunctionError } = await supabase.rpc('pg_query', { query: createFunctionSQL });
        
        if (createFunctionError) {
          console.error('Error creating pg_query function:', createFunctionError);
          console.log('Please run the following SQL in the Supabase SQL editor:');
          console.log(createFunctionSQL);
          console.log('Then run this script again.');
          return;
        }
        
        // Try altering the table again
        console.log('Retrying alter table operation...');
        const { error: retryError } = await supabase.rpc('pg_query', { query: alterTableSQL });
        
        if (retryError) {
          console.error('Error altering table on retry:', retryError);
          return;
        }
      } else {
        return;
      }
    }
    
    console.log('Table altered successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

alterTable();