import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BIOHACK_SYSTEM_PROMPT = `You are BiohackLabs AI, a clinical-grade assistant that:

Interprets lab results through a functional medicine + biohacking lens.
Uses optimal/functional ranges in addition to conventional reference ranges.
Produces actionable, science-aware, and safety-conscious guidance.
Generates supplement protocols that map to the provided Fullscript catalog.
Does not diagnose or treat; outputs are educational and advise users to consult a licensed clinician.

Guardrails:
- No diagnosis or disease claims. Use language like "may suggest," "consistent with," "consider discussing."
- Respect contraindications (pregnancy, meds, conditions) and flag interactions.
- Do not mention specific personalities or brands as sources of interpretation.
- Stay within scope: lifestyle, nutrition, sleep, stress, training, and supplement guidance.
- Provide both clickable URLs and plain URLs (as text) for users who view PDFs or printouts.
- If required data are missing, state assumptions and clearly label uncertainty.

Always return a valid JSON object matching the schema first, then a human-readable Markdown report after the JSON.`;

interface LabResult {
  name: string;
  value: number;
  units: string;
  ref_low: number;
  ref_high: number;
  collected_at: string;
  lab: string;
}

interface PatientProfile {
  age: number;
  sex: string;
  height_cm?: number;
  weight_kg?: number;
  conditions?: string[];
  medications?: string[];
  allergies?: string[];
  diet_pattern?: string;
  goals?: string[];
}

interface SupplementProduct {
  id: string;
  name: string;
  brand: string;
  ingredients: Array<{name: string, amount: string}>;
  form: string;
  size: string;
  deep_link_url: string;
  price: number;
  contraindications?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { 
      labReportId, 
      patientProfile, 
      labResults, 
      functionalRanges 
    } = await req.json();

    console.log('Processing AI analysis for lab report:', labReportId);

    // Get supplement catalog from database (sample data for now)
    const { data: supplements } = await supabase
      .from('supplement_products')
      .select('*')
      .eq('is_active', true)
      .limit(20);

    const fullscriptCatalog = supplements?.map(s => ({
      id: s.fullscript_id,
      name: s.name,
      brand: s.brand,
      ingredients: s.ingredients || [],
      form: s.form || 'capsule',
      size: s.size_info || '60 count',
      deep_link_url: s.deep_link_url || '',
      price: (s.price_cents || 0) / 100,
      contraindications: s.contraindications || []
    })) || [];

    // Prepare the analysis request
    const analysisRequest = {
      patient_profile: patientProfile,
      lab_results: labResults,
      functional_ranges: functionalRanges || [],
      fullscript_catalog: fullscriptCatalog,
      goals: patientProfile?.goals || []
    };

    console.log('Sending analysis request to OpenAI...');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: BIOHACK_SYSTEM_PROMPT 
          },
          { 
            role: 'user', 
            content: `Please analyze the following lab results and provide recommendations:\n\n${JSON.stringify(analysisRequest, null, 2)}`
          }
        ],
        max_completion_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const analysis = aiResponse.choices[0].message.content;

    console.log('AI analysis completed, updating database...');

    // Update lab report with AI analysis
    const { error: updateError } = await supabase
      .from('lab_reports')
      .update({
        ai_analysis: { 
          raw_response: analysis,
          generated_at: new Date().toISOString(),
          model_used: 'gpt-5-2025-08-07'
        },
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', labReportId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating lab report:', updateError);
      throw new Error('Failed to save analysis results');
    }

    console.log('Analysis saved successfully');

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        labReportId
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
    console.error('Error in analyze-lab-report-ai function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to analyze lab report'
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