import { supabase } from '@/integrations/supabase/client';

export async function processAndReplaceCatalog(textContent: string) {
  try {
    console.log('Processing full catalog text with AI...');
    
    // Process the entire text with AI
    const { data, error } = await supabase.functions.invoke('catalog-extract-ai', {
      body: { 
        text: textContent,
        source: 'fullscript_lab_catalog_text.txt'
      }
    });

    if (error) {
      throw new Error(`AI extraction failed: ${error.message}`);
    }

    if (!data || !data.panels) {
      throw new Error('No panels extracted from text');
    }

    console.log(`Extracted ${data.panels.length} lab panels from text`);
    
    // Create new catalog structure with ONLY extracted data
    const newCatalog = {
      providers: data.providers || [
        "Quest Diagnostics",
        "Access Labcorp Draw", 
        "Access Medical Labs",
        "Precision Analytical (DUTCH)",
        "Diagnostic Solutions Laboratory",
        "Mosaic Diagnostics",
        "Doctor's Data"
      ],
      panels: data.panels
    };

    return {
      success: true,
      catalog: newCatalog,
      message: `Successfully extracted ${data.panels.length} lab panels from your text file`
    };

  } catch (error) {
    console.error('Error processing catalog:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      catalog: null
    };
  }
}