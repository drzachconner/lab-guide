import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FullscriptAccountRequest {
  userId: string;
  email: string;
  fullName: string;
  accountType: 'analysis' | 'dispensary';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { userId, email, fullName, accountType }: FullscriptAccountRequest = await req.json();

    // Verify the user ID matches the authenticated user
    if (userId !== user.id) {
      throw new Error('User ID mismatch');
    }

    console.log('Creating Fullscript account for:', { userId, email, accountType });

    // TODO: Replace with actual Fullscript API integration
    // For now, we'll simulate the account creation and store the access info
    
    // Simulate Fullscript API call
    const fullscriptAccountId = `fs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const dispensaryUrl = `https://supplements.labpilot.com/patient/${fullscriptAccountId}`;
    
    // Store the Fullscript account info in the user's profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        fullscript_account_id: fullscriptAccountId,
        dispensary_url: dispensaryUrl,
        account_type: accountType,
        dispensary_access: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw new Error('Failed to update user profile');
    }

    // Log the account creation for tracking
    console.log(`Fullscript account created successfully for user ${userId}:`, {
      accountId: fullscriptAccountId,
      dispensaryUrl,
      accountType
    });

    return new Response(
      JSON.stringify({
        success: true,
        fullscriptAccountId,
        dispensaryUrl,
        message: 'Fullscript account created successfully'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in create-fullscript-account function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to create Fullscript account'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);