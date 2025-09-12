import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Fullscript lab catalog sync...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    
    const fullscriptApiKey = Deno.env.get('FULLSCRIPT_API_KEY');
    if (!fullscriptApiKey) {
      throw new Error('FULLSCRIPT_API_KEY not configured');
    }
    
    // Paginated fetch to get ALL labs
    let allLabs = []
    let page = 1
    let hasMore = true
    
    console.log('Fetching labs from Fullscript API...');
    
    while (hasMore) {
      const response = await fetch(
        `https://api.fullscript.com/v1/catalog/labs?page=${page}&per_page=100`, 
        {
          headers: {
            'Authorization': `Bearer ${fullscriptApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (!response.ok) {
        console.error(`Fullscript API error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Fullscript API error: ${response.status}`);
      }
      
      const data = await response.json()
      allLabs = [...allLabs, ...data.items]
      hasMore = data.has_more
      page++
      
      console.log(`Fetched page ${page - 1}, total labs so far: ${allLabs.length}`);
    }
    
    console.log(`Total labs fetched: ${allLabs.length}`);
    
    // Map to your schema with optimization tags
    const labsToInsert = allLabs.map(lab => ({
      fullscript_lab_id: lab.id,
      fullscript_sku: lab.sku,
      name: lab.name,
      description: lab.description,
      category: lab.category || categorizeByBiomarkers(lab),
      biomarkers: lab.biomarkers || lab.markers || [],
      base_price: lab.retail_price ? Math.round(lab.retail_price / 100) : 0, // cents to dollars
      practitioner_price: lab.wholesale_price || null,
      retail_price: lab.retail_price || 0,
      lab_provider: lab.laboratory || 'fullscript',
      sample_type: lab.collection_method || 'blood',
      turnaround_days: lab.turnaround_time || 3,
      fasting_required: lab.requires_fasting || false,
      is_active: lab.available !== false,
      optimization_tags: generateOptimizationTags(lab),
      suggested_service_fee: calculateServiceFee(lab),
      fee_justification: generateFeeJustification(lab),
      collection_instructions: lab.collection_instructions,
      preparation_instructions: lab.preparation_instructions,
      states_available: lab.states_available || [],
      age_minimum: lab.age_minimum || 18,
      draw_fee: lab.draw_fee || 10
    }))
    
    console.log('Upserting labs into database...');
    
    // Upsert in batches
    const batchSize = 50
    let processedCount = 0
    
    for (let i = 0; i < labsToInsert.length; i += batchSize) {
      const batch = labsToInsert.slice(i, i + batchSize)
      
      const { error } = await supabase
        .from('lab_panels')
        .upsert(batch, { 
          onConflict: 'fullscript_lab_id'
        })
      
      if (error) {
        console.error('Batch upsert error:', error);
        throw error;
      }
      
      processedCount += batch.length
      console.log(`Processed ${processedCount}/${labsToInsert.length} labs`);
    }
    
    console.log('Sync completed successfully');
    
    return new Response(JSON.stringify({ 
      success: true,
      synced: allLabs.length,
      processed: processedCount,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Error syncing Fullscript labs:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function categorizeByBiomarkers(lab: any): string {
  const name = lab.name?.toLowerCase() || ''
  
  if (name.includes('hormone') || name.includes('testosterone') || name.includes('estrogen')) return 'hormone'
  if (name.includes('metabolic') || name.includes('glucose') || name.includes('insulin')) return 'metabolic'
  if (name.includes('thyroid') || name.includes('tsh') || name.includes('t3') || name.includes('t4')) return 'thyroid'
  if (name.includes('vitamin') || name.includes('nutrient') || name.includes('b12') || name.includes('d3')) return 'nutrient'
  if (name.includes('cardiac') || name.includes('lipid') || name.includes('cholesterol')) return 'cardiac'
  if (name.includes('inflammation') || name.includes('crp') || name.includes('esr')) return 'inflammation'
  if (name.includes('liver') || name.includes('hepatic') || name.includes('alt') || name.includes('ast')) return 'liver'
  if (name.includes('kidney') || name.includes('renal') || name.includes('creatinine')) return 'kidney'
  if (name.includes('immune') || name.includes('antibody') || name.includes('allergy')) return 'immune'
  
  return 'general'
}

function generateOptimizationTags(lab: any): string[] {
  const tags: string[] = []
  const name = lab.name?.toLowerCase() || ''
  const description = lab.description?.toLowerCase() || ''
  const searchText = `${name} ${description}`
  
  if (searchText.includes('testosterone') || searchText.includes('hormone')) {
    tags.push('hormones', 'performance', 'energy')
  }
  if (searchText.includes('thyroid') || searchText.includes('tsh')) {
    tags.push('energy', 'metabolism', 'weight')
  }
  if (searchText.includes('vitamin') || searchText.includes('nutrient')) {
    tags.push('nutrition', 'wellness', 'longevity')
  }
  if (searchText.includes('cortisol') || searchText.includes('stress')) {
    tags.push('stress', 'recovery', 'sleep')
  }
  if (searchText.includes('metabolic') || searchText.includes('glucose') || searchText.includes('insulin')) {
    tags.push('weight', 'metabolism', 'energy')
  }
  if (searchText.includes('lipid') || searchText.includes('cholesterol')) {
    tags.push('heart', 'longevity', 'wellness')
  }
  if (searchText.includes('inflammation') || searchText.includes('crp')) {
    tags.push('recovery', 'wellness', 'longevity')
  }
  if (searchText.includes('cognitive') || searchText.includes('brain')) {
    tags.push('brain', 'focus', 'memory')
  }
  if (searchText.includes('athletic') || searchText.includes('performance')) {
    tags.push('performance', 'recovery', 'energy')
  }
  
  return [...new Set(tags)] // Remove duplicates
}

function calculateServiceFee(lab: any): number {
  const markerCount = lab.biomarkers?.length || lab.markers?.length || 0
  const price = lab.retail_price || 0
  
  // Base fee calculation on complexity and value
  if (markerCount > 50 || price > 50000) return 150 // $1.50
  if (markerCount > 20 || price > 20000) return 100 // $1.00
  if (markerCount > 10 || price > 10000) return 75  // $0.75
  
  return 50 // $0.50 minimum
}

function generateFeeJustification(lab: any): string {
  const markerCount = lab.biomarkers?.length || lab.markers?.length || 0
  
  if (markerCount > 50) {
    return 'Comprehensive AI analysis with full optimization protocol and personalized supplement recommendations'
  }
  if (markerCount > 20) {
    return 'Advanced functional interpretation with detailed supplement protocol and lifestyle recommendations'
  }
  if (markerCount > 10) {
    return 'AI-powered analysis with personalized recommendations and optimization insights'
  }
  
  return 'Functional analysis with AI-powered insights and basic recommendations'
}