/**
 * Test Database Connection
 * 
 * This script tests the connection to the Supabase database using different methods.
 * It will help identify which connection method works best for your environment.
 * 
 * Usage:
 * node test_connection.js
 */

import { config } from 'dotenv';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config();

const { Pool } = pg;

// Get connection details from environment variables
const SUPABASE_URL = process.env.VITE_NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const DIRECT_CONNECTION = process.env.VITE_DIRECT_CONNECTION;
const TRANSACTION_POOLER = process.env.VITE_TRANSACTION_POOLER;
const SESSION_POOLER = process.env.VITE_SESSION_POOLER;
const DB_PASSWORD = process.env.VITE_SUPABASE_DB_PASSWORD;

console.log('Testing database connection...');
console.log('Environment variables:');
console.log('- SUPABASE_URL:', SUPABASE_URL ? 'Set' : 'Not set');
console.log('- SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'Set' : 'Not set');
console.log('- SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? 'Set' : 'Not set');
console.log('- DIRECT_CONNECTION:', DIRECT_CONNECTION ? 'Set' : 'Not set');
console.log('- TRANSACTION_POOLER:', TRANSACTION_POOLER ? 'Set' : 'Not set');
console.log('- SESSION_POOLER:', SESSION_POOLER ? 'Set' : 'Not set');
console.log('- DB_PASSWORD:', DB_PASSWORD ? 'Set' : 'Not set');

// Test Supabase REST API connection
async function testSupabaseRestApi() {
  console.log('\nTesting Supabase REST API connection...');
  
  try {
    // Create a Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Test the connection
    const { data, error } = await supabase.from('settings').select('*').limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase REST API:', error);
      return false;
    }
    
    console.log('Successfully connected to Supabase REST API!');
    console.log('Data:', data);
    return true;
  } catch (error) {
    console.error('Exception when connecting to Supabase REST API:', error);
    return false;
  }
}

// Test Supabase REST API connection with service role key
async function testSupabaseRestApiWithServiceKey() {
  console.log('\nTesting Supabase REST API connection with service role key...');
  
  try {
    // Create a Supabase client with service role key
    const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    // Test the connection
    const { data, error } = await adminSupabase.from('settings').select('*').limit(1);
    
    if (error) {
      console.error('Error connecting to Supabase REST API with service role key:', error);
      return false;
    }
    
    console.log('Successfully connected to Supabase REST API with service role key!');
    console.log('Data:', data);
    return true;
  } catch (error) {
    console.error('Exception when connecting to Supabase REST API with service role key:', error);
    return false;
  }
}

// Test direct PostgreSQL connection
async function testDirectConnection() {
  console.log('\nTesting direct PostgreSQL connection...');
  
  try {
    // Create a PostgreSQL pool
    const pool = new Pool({
      connectionString: DIRECT_CONNECTION,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // Test the connection
    const result = await pool.query('SELECT COUNT(*) FROM settings');
    
    console.log('Successfully connected to PostgreSQL using direct connection!');
    console.log('Result:', result.rows[0]);
    
    // Close the pool
    await pool.end();
    
    return true;
  } catch (error) {
    console.error('Error connecting to PostgreSQL using direct connection:', error);
    return false;
  }
}

// Test transaction pooler connection
async function testTransactionPooler() {
  console.log('\nTesting transaction pooler connection...');
  
  try {
    // Create a PostgreSQL pool
    const pool = new Pool({
      connectionString: TRANSACTION_POOLER,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // Test the connection
    const result = await pool.query('SELECT COUNT(*) FROM settings');
    
    console.log('Successfully connected to PostgreSQL using transaction pooler!');
    console.log('Result:', result.rows[0]);
    
    // Close the pool
    await pool.end();
    
    return true;
  } catch (error) {
    console.error('Error connecting to PostgreSQL using transaction pooler:', error);
    return false;
  }
}

// Test session pooler connection
async function testSessionPooler() {
  console.log('\nTesting session pooler connection...');
  
  try {
    // Create a PostgreSQL pool
    const pool = new Pool({
      connectionString: SESSION_POOLER,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // Test the connection
    const result = await pool.query('SELECT COUNT(*) FROM settings');
    
    console.log('Successfully connected to PostgreSQL using session pooler!');
    console.log('Result:', result.rows[0]);
    
    // Close the pool
    await pool.end();
    
    return true;
  } catch (error) {
    console.error('Error connecting to PostgreSQL using session pooler:', error);
    return false;
  }
}

// Test all connection methods
async function testAllConnections() {
  const results = {
    supabaseRestApi: await testSupabaseRestApi(),
    supabaseRestApiWithServiceKey: await testSupabaseRestApiWithServiceKey(),
    directConnection: DIRECT_CONNECTION ? await testDirectConnection() : 'Not tested (connection string not provided)',
    transactionPooler: TRANSACTION_POOLER ? await testTransactionPooler() : 'Not tested (connection string not provided)',
    sessionPooler: SESSION_POOLER ? await testSessionPooler() : 'Not tested (connection string not provided)'
  };
  
  console.log('\nConnection Test Results:');
  console.log('- Supabase REST API:', results.supabaseRestApi ? 'Success' : 'Failed');
  console.log('- Supabase REST API with Service Key:', results.supabaseRestApiWithServiceKey ? 'Success' : 'Failed');
  console.log('- Direct PostgreSQL Connection:', typeof results.directConnection === 'boolean' ? (results.directConnection ? 'Success' : 'Failed') : results.directConnection);
  console.log('- Transaction Pooler Connection:', typeof results.transactionPooler === 'boolean' ? (results.transactionPooler ? 'Success' : 'Failed') : results.transactionPooler);
  console.log('- Session Pooler Connection:', typeof results.sessionPooler === 'boolean' ? (results.sessionPooler ? 'Success' : 'Failed') : results.sessionPooler);
  
  // Determine the best connection method
  let bestMethod = 'None';
  
  if (results.supabaseRestApi) {
    bestMethod = 'Supabase REST API';
  } else if (results.supabaseRestApiWithServiceKey) {
    bestMethod = 'Supabase REST API with Service Key';
  } else if (typeof results.directConnection === 'boolean' && results.directConnection) {
    bestMethod = 'Direct PostgreSQL Connection';
  } else if (typeof results.transactionPooler === 'boolean' && results.transactionPooler) {
    bestMethod = 'Transaction Pooler Connection';
  } else if (typeof results.sessionPooler === 'boolean' && results.sessionPooler) {
    bestMethod = 'Session Pooler Connection';
  }
  
  console.log('\nBest Connection Method:', bestMethod);
  
  if (bestMethod === 'None') {
    console.log('\nAll connection methods failed. Please check your database credentials and connection.');
    console.log('Make sure your IP address is allowed to connect to the database.');
    console.log('You might need to add your IP address to the allowlist in the Supabase dashboard.');
  } else {
    console.log('\nRecommendation: Use the', bestMethod, 'for your application.');
  }
}

// Run the tests
testAllConnections().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});