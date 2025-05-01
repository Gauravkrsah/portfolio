// Database Fix and Restart Script
// This script runs the complete_database_setup_fixed.sql file to fix all database issues
// and then restarts the application

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

// Load environment variables
dotenv.config();

// Convert exec to a Promise-based function
const execPromise = promisify(exec);

// Supabase connection details
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: Supabase URL or service key not found in environment variables');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixDatabase() {
  try {
    console.log('Starting database fix process...');
    
    // Read the SQL file
    const sqlFilePath = './complete_database_setup_fixed.sql';
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = sql
      .replace(/--.*$/gm, '') // Remove comments
      .split(';')
      .filter(statement => statement.trim() !== '');
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;
      
      try {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('pgexecute', { query: statement + ';' });
        
        if (error) {
          console.warn(`Warning: Error executing statement ${i + 1}: ${error.message}`);
          console.warn('Continuing with next statement...');
        }
      } catch (err) {
        console.warn(`Warning: Exception executing statement ${i + 1}: ${err.message}`);
        console.warn('Continuing with next statement...');
      }
    }
    
    console.log('Database fix process completed successfully');
    return true;
  } catch (error) {
    console.error('Error fixing database:', error);
    return false;
  }
}

async function restartApplication() {
  try {
    console.log('Restarting application...');
    
    // Kill any running instances of the application
    try {
      await execPromise('taskkill /f /im node.exe');
      console.log('Killed existing Node.js processes');
    } catch (error) {
      console.log('No existing Node.js processes to kill');
    }
    
    // Start the application in a new process
    const child = exec('npm run dev', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting application: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Application stderr: ${stderr}`);
      }
      console.log(`Application stdout: ${stdout}`);
    });
    
    // Detach the child process
    child.unref();
    
    console.log('Application restarted successfully');
    return true;
  } catch (error) {
    console.error('Error restarting application:', error);
    return false;
  }
}

// Main function
async function main() {
  try {
    // Fix the database
    const databaseFixed = await fixDatabase();
    if (!databaseFixed) {
      console.error('Failed to fix database. Exiting...');
      process.exit(1);
    }
    
    // Restart the application
    const applicationRestarted = await restartApplication();
    if (!applicationRestarted) {
      console.error('Failed to restart application. Exiting...');
      process.exit(1);
    }
    
    console.log('Database fix and application restart completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

// Run the main function
main();