import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const key = Deno.env.get('AZURE_SPEECH_KEY');
    const region = Deno.env.get('AZURE_SPEECH_REGION');
    if (!key || !region) {
      return new Response(JSON.stringify({ error: 'Azure Speech not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { text, voice = 'en-US-SaraNeural', rate = '0%', pitch = '0%' } = await req.json();
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'text is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const ssml = `<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis'>
<voice name='${voice}'><prosody rate='${rate}' pitch='${pitch}'>${escaped}</prosody></voice>
</speak>`;

    const synth = () => fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'BooksByMaggie',
      },
      body: ssml,
    });

    let resp = await synth();
    // Azure throttles bursts (429). Retry with exponential backoff before failing.
    for (let attempt = 0; attempt < 4 && (resp.status === 429 || resp.status >= 500); attempt++) {
      const retryAfter = Number(resp.headers.get('Retry-After')) || 0;
      const waitMs = retryAfter > 0 ? retryAfter * 1000 : Math.min(500 * 2 ** attempt, 4000);
      await resp.body?.cancel();
      await new Promise((r) => setTimeout(r, waitMs));
      resp = await synth();
    }

    if (!resp.ok) {
      const errText = await resp.text();
      const throttled = resp.status === 429;
      return new Response(
        JSON.stringify({
          error: throttled
            ? 'Voice service is busy right now. Please wait a moment and try again.'
            : `Azure TTS failed: ${resp.status} ${errText}`,
          retryable: throttled,
        }),
        { status: throttled ? 429 : 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }



    return new Response(resp.body, {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
