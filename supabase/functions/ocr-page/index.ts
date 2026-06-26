// OCR / narration extraction for a book page image via Lovable AI Gateway
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { imageUrl, imageBase64, mimeType } = await req.json();
    if (!imageUrl && !imageBase64) {
      return new Response(JSON.stringify({ error: 'imageUrl or imageBase64 required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const key = Deno.env.get('LOVABLE_API_KEY');
    if (!key) {
      return new Response(JSON.stringify({ error: 'Missing LOVABLE_API_KEY' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = imageUrl
      ? imageUrl
      : `data:${mimeType || 'image/png'};base64,${imageBase64}`;

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': key,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content:
              'You are a transcription helper for a children\'s picture-book page. Extract ONLY the story text that appears on the page (the narration the reader would read aloud). Ignore page numbers, the author name, the publisher, watermarks, and decorative text. If there is no readable story text on the page, return an empty string. Return plain text only, no quotation marks, no commentary.',
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extract the story narration text from this page.' },
              { type: 'image_url', image_url: { url } },
            ],
          },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      return new Response(JSON.stringify({ error: 'AI gateway error', detail: errText }), {
        status: aiRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await aiRes.json();
    const text = (data?.choices?.[0]?.message?.content ?? '').toString().trim();

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
