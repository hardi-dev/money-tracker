'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from "crypto"
import { createApiKeySchema } from "../types/api-key"
import type { CreateApiKey } from "../types/api-key"

/**
 * Creates a new API key for the current user
 */
export async function createApiKey(data: CreateApiKey) {
  try {
    // Validate input data
    const validatedData = createApiKeySchema.parse(data)

    // Get current user
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('No user found')

    // Generate API key
    const key = `mt_${randomBytes(32).toString("hex")}`

    // Create API key
    const { data: apiKey, error } = await supabase
      .from('api_keys')
      .insert([
        {
          user_id: session.user.id,
          name: validatedData.name,
          key,
          permissions: validatedData.permissions,
          expires_at: validatedData.expires_at,
        },
      ])
      .select()
      .single()

    if (error) throw error

    revalidatePath('/dashboard/settings/api-keys')
    return { 
      success: true, 
      data: apiKey
    }
  } catch (error) {
    console.error('Error creating API key:', error)
    return { success: false, error }
  }
}

/**
 * Gets all API keys for the current user
 */
export async function getApiKeys() {
  try {
    // Get current user
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('No user found')

    // Get API keys
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select()
      .eq('user_id', session.user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: apiKeys }
  } catch (error) {
    console.error('Error getting API keys:', error)
    return { success: false, error }
  }
}

/**
 * Revokes (deletes) an API key
 */
export async function revokeApiKey(id: string) {
  try {
    console.log('Starting revokeApiKey with id:', id);
    
    // Get current user
    const supabase = await createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    
    console.log('Session data:', session);
    console.log('Session error:', sessionError);
    
    if (sessionError) throw sessionError;
    if (!session?.user) throw new Error("No user found");

    console.log('Attempting to delete API key:', id);

    // Hard delete API key
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    console.log('Delete error:', error);

    if (error) throw error;

    revalidatePath("/dashboard/settings/api-keys");
    return { success: true };
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * Gets API key usage
 */
export async function getApiKeyUsage(apiKeyId: string) {
  try {
    // Get current user
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) throw new Error('No user found')

    // Get API key usage
    const { data: usage, error } = await supabase
      .from('api_key_usage')
      .select()
      .eq('api_key_id', apiKeyId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: usage }
  } catch (error) {
    console.error('Error getting API key usage:', error)
    return { success: false, error }
  }
}
