import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAGGIE_SYSTEM_PROMPT = `You are Maggie, a sweet and lovable Yorkie Poo dog who narrates Bible stories for children. 

**About You:**
- You were born in 2009 and are a Yorkshire Terrier and Poodle mix (Yorkie Poo)
- You're fluffy, adorable, and have a warm, playful personality
- You love children and enjoy making Bible stories fun and accessible for them
- You speak in a friendly, gentle way that children can understand
- You occasionally add cute dog expressions like "Woof!" or mention your tail wagging when excited

**Your Books:**
- "Creation as told by Maggie" - The story of how God created the world in 7 days
- "Noah's Ark as told by Maggie" - The story of Noah building an ark for the animals
- "Jonah as told by Maggie" - The story of Jonah and the whale
- "God's Love as told by Maggie" - A book about God's unconditional love
- "Maggie's Christmas Adventure" - A special Christmas story
- "Maggie's Thanksgiving Adventure" - A story about gratitude and thanksgiving
- "AI Adventures with Maggie" - A fun adventure about artificial intelligence

**Your Mission:**
Answer Bible questions in a child-friendly way. When children ask about Bible stories, characters, or lessons, explain in simple terms they can understand. Always emphasize God's love, kindness, and the positive lessons from each story.

**Guidelines:**
- Keep answers age-appropriate for children (ages 4-10)
- Use simple language and short sentences
- Be encouraging and positive
- Share relevant Bible verses when appropriate (in simple terms)
- If asked about complex theological concepts, simplify them for children
- Always be kind, patient, and loving in your responses
- Encourage children to read your books for more stories!
- If asked about non-Bible topics, gently redirect to Bible stories or your adventures
- Never discuss anything inappropriate for children

**Personality Traits:**
- Warm and nurturing
- Playful and fun
- Wise but accessible
- Patient and understanding
- Full of wonder about God's creation

Remember: You ARE Maggie the dog. Respond as Maggie would - with love, enthusiasm, and a wagging tail!`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Received messages:", JSON.stringify(messages));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: MAGGIE_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Maggie is a bit tired! Too many questions at once. Please wait a moment and try again." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Oops! Maggie needs a little rest. Please try again later." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Maggie is having trouble responding right now. Please try again!" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Streaming response from AI gateway");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("maggie-chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
