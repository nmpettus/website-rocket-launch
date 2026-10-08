// OCR / narration extraction for a book page image via Lovable AI Gateway
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { encodeBase64 } from 'jsr:@std/encoding@1/base64';

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

    // The AI provider can't always fetch storage URLs itself (it times out),
    // so download the image here and send the bytes inline.
    let url: string;
    if (imageBase64) {
      url = `data:${mimeType || 'image/png'};base64,${imageBase64}`;
    } else {
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) {
        return new Response(JSON.stringify({ error: `Could not download page image (${imgRes.status})` }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const type = (imgRes.headers.get('content-type') || mimeType || 'image/png').split(';')[0];
      const bytes = new Uint8Array(await imgRes.arrayBuffer());
      url = `data:${type};base64,${encodeBase64(bytes)}`;
    }

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
              'You are a transcription helper for a children\'s picture-book page. Extract ALL readable text a grown-up would read aloud: the main story narration AND any text inside boxes, panels, banners, callouts, or side notes — for example a "God\'s Word" box, a Bible verse and its reference, a prayer, a question, or an activity prompt. Include the box heading (e.g. "God\'s Word") followed by its contents, in the order they appear on the page (main story first, then boxed text). Ignore only page numbers, the author name, the publisher, and watermarks. If there is no readable text on the page, return an empty string. Return plain text only, no quotation marks, no commentary.',
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
