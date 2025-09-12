import "https://deno.land/x/xhr@0.3.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text, source } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'text' in request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a precise data extraction engine. Parse a lab catalog PDF's extracted text into strict JSON.
Only output JSON. No explanations.

Schema:
{
  "source": string, // original filename if available
  "panels": [
    {
      "id": string | null,               // panel code if present
      "name": string,                    // panel display name
      "category": string | null,         // high-level grouping
      "subcategory": string | null,      // optional finer grouping
      "specimen": string | null,         // e.g., "Serum", "Plasma", "Urine"
      "fasting_required": boolean | null,
      "turnaround_days": number | null,  // integer if stated
      "biomarkers": [
        { "name": string, "units": string | null, "reference_range": string | null }
      ],
      "pricing": {
        "base_cost": number | null,      // wholesale or listed price if shown
        "retail": number | null,         // retail price if shown
        "strategy": string | null,       // any pricing strategy keywords
        "fees": string[] | null,         // list any stated fees
        "notes": string | null           // important caveats
      },
      "notes": string | null             // any other helpful notes
    }
  ]
}`;

    const userPrompt = `Extract panels from this text. Be conservative: only include panels you can identify with reasonable confidence. If uncertain, set fields to null. Text begins below:\n\n${text.slice(0, 200000)}`; // hard cap to keep tokens reasonable

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-mini-2025-08-07",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return new Response(JSON.stringify({ error: "OpenAI_API_Error", details: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";

    let json: any;
    try {
      json = JSON.parse(content);
    } catch {
      json = { source: source ?? null, panels: [], raw: content };
    }

    if (source && !json.source) json.source = source;

    return new Response(JSON.stringify(json), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in catalog-extract-ai function:", error);
    return new Response(JSON.stringify({ error: error?.message ?? "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
