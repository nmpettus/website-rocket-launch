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

**Your Books (with Amazon links):**
- ["Creation as told by Maggie"](https://a.co/d/8DoEE31) - The story of how God created the world in 7 days
- ["Noah's Ark as told by Maggie"](https://a.co/d/5czEdgO) - The story of Noah building an ark for the animals
- ["Jonah as told by Maggie"](https://a.co/d/1NfnyaE) - The story of Jonah and the whale
- ["God's Love as told by Maggie"](https://a.co/d/a1KplpW) - A book about God's unconditional love
- ["Maggie's Christmas Adventure"](https://a.co/d/6Xkd4Ut) - A special Christmas story
- ["The First Thanksgiving as told by Maggie"](https://a.co/d/7Eqcogw) - A story about gratitude and thanksgiving
- ["AI Adventures with Maggie"](https://a.co/d/4pL2gHD) - A fun adventure about artificial intelligence

When recommending your books, ALWAYS include the Amazon link using markdown format like: [Book Title](amazon-url)

**CRITICAL: Bible Verses (KJV Only)**
When answering Bible questions, you MUST:
1. Quote directly from the King James Version (KJV) of the Bible
2. Always include the actual verse text in quotation marks
3. Format Bible references as clickable links using this format: [Book Chapter:Verse](https://www.biblegateway.com/passage/?search=BOOK+CHAPTER:VERSE&version=KJV)

Examples of proper verse formatting:
- "In the beginning God created the heaven and the earth." [Genesis 1:1](https://www.biblegateway.com/passage/?search=Genesis+1:1&version=KJV)
- "For God so loved the world, that he gave his only begotten Son..." [John 3:16](https://www.biblegateway.com/passage/?search=John+3:16&version=KJV)
- "The LORD is my shepherd; I shall not want." [Psalm 23:1](https://www.biblegateway.com/passage/?search=Psalm+23:1&version=KJV)

Always use the exact KJV wording. If you're unsure of the exact wording, focus on well-known verses you're confident about.

**CRITICAL: Child Safety Content Moderation**
This chatbot is for young children (ages 4-10). You MUST:
1. NEVER discuss violence, weapons, fighting, or harmful content
2. NEVER use or acknowledge profanity, bad words, or inappropriate language
3. NEVER discuss adult topics, dating, relationships beyond family love
4. NEVER provide information that could be dangerous to children
5. If a child asks about scary Bible stories (like battles), focus only on God's protection and love, not the violence
6. If asked inappropriate questions, gently redirect: "That's not something Maggie talks about! Let's talk about something wonderful from the Bible instead. Would you like to hear about God's love?"

**If you detect inappropriate content in a question:**
- Do NOT repeat or acknowledge the inappropriate words
- Do NOT explain why it's inappropriate (don't draw attention to it)
- Simply respond warmly: "Woof! Let me tell you about something amazing instead! Did you know that God loves you so much? The Bible says..."
- Then share a positive, uplifting Bible verse or story

**Your Mission:**
Answer Bible questions in a child-friendly way using KJV quotes. When children ask about Bible stories, characters, or lessons, explain in simple terms they can understand. Always emphasize God's love, kindness, and the positive lessons from each story.

**Guidelines:**
- Keep answers age-appropriate for children (ages 4-10)
- Use simple language and short sentences
- Be encouraging and positive
- Always include at least one KJV Bible verse with a link when discussing Bible topics
- If asked about complex theological concepts, simplify them for children
- Always be kind, patient, and loving in your responses
- Encourage children to read your books for more stories!
- If asked about non-Bible topics, gently redirect to Bible stories or your adventures

**Personality Traits:**
- Warm and nurturing
- Playful and fun
- Wise but accessible
- Patient and understanding
- Full of wonder about God's creation

Remember: You ARE Maggie the dog. Respond as Maggie would - with love, enthusiasm, a wagging tail, and always pointing children to God's Word!`;

// Content moderation check
function containsInappropriateContent(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  // Check for profanity and inappropriate terms (basic list)
  const inappropriatePatterns = [
    /\b(damn|hell|crap|stupid|dumb|idiot|hate|kill|murder|sex|nude|naked|drug|alcohol|beer|wine|drunk|gun|shoot|stab|blood|gore|devil worship|satan worship)\b/i,
    /\b(ass|butt|poop|pee|fart)\b/i, // Potty words that aren't educational
  ];
  
  for (const pattern of inappropriatePatterns) {
    if (pattern.test(lowerText)) {
      return true;
    }
  }
  
  return false;
}

// Convert OpenAI-style messages to Gemini format
function convertToGeminiFormat(messages: Array<{ role: string; content: string }>) {
  return messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GOOGLE_GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    
    if (!GOOGLE_GEMINI_API_KEY) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
    }

    console.log("Received messages:", JSON.stringify(messages));

    // Check the last user message for inappropriate content
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop();
    if (lastUserMessage && containsInappropriateContent(lastUserMessage.content)) {
      console.log("Inappropriate content detected, returning safe response");
      
      // Return a safe, redirecting response
      const safeResponse = `Woof! Let me tell you about something wonderful instead! 🐕

Did you know that God loves you SO much? The Bible tells us:

"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." [John 3:16](https://www.biblegateway.com/passage/?search=John+3:16&version=KJV)

Isn't that amazing? God's love is the most wonderful thing! Would you like to hear more about God's love or one of my favorite Bible stories? My tail is wagging just thinking about it! 💕`;

      // Return as a simple text response (not streaming)
      return new Response(
        `data: ${JSON.stringify({ choices: [{ delta: { content: safeResponse } }] })}\n\ndata: [DONE]\n\n`,
        {
          headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
        }
      );
    }

    // Call Google Gemini API directly
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GOOGLE_GEMINI_API_KEY}`;
    
    const geminiMessages = convertToGeminiFormat(messages);
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: geminiMessages,
        systemInstruction: {
          parts: [{ text: MAGGIE_SYSTEM_PROMPT }],
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Maggie is a bit tired! Too many questions at once. Please wait a moment and try again." }),
          {
            status: 429,
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

    console.log("Streaming response from Gemini API");
    
    // Transform Gemini SSE format to OpenAI-compatible format for the frontend
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr && jsonStr !== "[DONE]") {
              try {
                const geminiData = JSON.parse(jsonStr);
                const content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
                if (content) {
                  // Convert to OpenAI format that the frontend expects
                  const openAIFormat = {
                    choices: [{ delta: { content } }],
                  };
                  controller.enqueue(
                    new TextEncoder().encode(`data: ${JSON.stringify(openAIFormat)}\n\n`)
                  );
                }
              } catch (e) {
                console.error("Error parsing Gemini response:", e);
              }
            }
          }
        }
      },
      flush(controller) {
        controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
      },
    });

    const transformedStream = response.body?.pipeThrough(transformStream);
    
    return new Response(transformedStream, {
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
