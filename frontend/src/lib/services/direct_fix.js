// Direct Fix for Supabase Service Functions
// This script contains direct fixes for the functions that are causing issues

import { supabase } from './supabaseClient';

/**
 * Direct fix for creating a subscriber
 * This function ensures the subscriber is created correctly
 */
export const directCreateSubscriber = async (subscriber) => {
  try {
    console.log("Creating subscriber with direct fix:", subscriber);
    
    // Use supabase client since adminSupabase is not working
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{
        ...subscriber,
        status: 'Active'
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating subscriber:", error);
      throw new Error(`Failed to create subscriber: ${error.message}`);
    }
    
    console.log("Subscriber created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in directCreateSubscriber:", error);
    throw new Error(`Failed to create subscriber: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Direct fix for creating a message
 * This function ensures the message is created correctly
 */
export const directCreateMessage = async (message) => {
  try {
    console.log("Creating message with direct fix:", message);
    
    // Use supabase client since adminSupabase is not working
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        ...message,
        status: 'New'
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating message:", error);
      throw new Error(`Failed to create message: ${error.message}`);
    }
    
    console.log("Message created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in directCreateMessage:", error);
    throw new Error(`Failed to create message: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Direct fix for updating a project
 * This function ensures the project is updated correctly
 */
export const directUpdateProject = async (id, project) => {
  try {
    console.log("Updating project with direct fix:", id, project);
    
    // Use supabase client since adminSupabase is not working
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...project,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating project:", error);
      throw new Error(`Failed to update project: ${error.message}`);
    }
    
    console.log("Project updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in directUpdateProject:", error);
    throw new Error(`Failed to update project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Direct fix for updating a project's featured status
 * This function ensures the featured status is updated correctly
 */
export const directToggleFeatured = async (id, featured) => {
  try {
    console.log("Toggling featured status with direct fix:", id, featured);
    
    // Use supabase client since adminSupabase is not working
    const { data, error } = await supabase
      .from('projects')
      .update({
        featured,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Error toggling featured status:", error);
      throw new Error(`Failed to update featured status: ${error.message}`);
    }
    
    console.log("Featured status updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in directToggleFeatured:", error);
    throw new Error(`Failed to update featured status: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};