// Custom password-reset email sender.
// Generates a Supabase recovery link and hands it off to the Hostinger
// PHP mailer (api/password-reset.php) so the email can use branded HTML
// with a clearly visible button.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PHP_ENDPOINT = "https://booksbymaggie.com/api/password-reset.php";
const REDIRECT_TO = "https://booksbymaggie.com/?reset-password=1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return json({ success: false, error: "Email is required" }, 400);
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SHARED_SECRET = Deno.env.get("PASSWORD_RESET_API_SECRET") ?? "";

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Generate a recovery link. Do NOT reveal to the caller whether the
    // email exists — always respond with success below.
    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: REDIRECT_TO },
    });

    if (error || !data?.properties?.action_link) {
      console.log("generateLink result:", { error, email });
      // Still respond success so we don't leak account existence.
      return json({ success: true });
    }

    const resetLink = data.properties.action_link;
    const userName =
      (data.user?.user_metadata as Record<string, unknown> | undefined)
        ?.full_name as string | undefined;

    const phpResp = await fetch(PHP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Reset-Secret": SHARED_SECRET,
      },
      body: JSON.stringify({
        recipient_email: email,
        reset_link: resetLink,
        user_name: userName ?? "",
      }),
    });

    const phpText = await phpResp.text();
    console.log("PHP mailer response:", phpResp.status, phpText);

    if (!phpResp.ok) {
      return json(
        { success: false, error: "Mailer failed", detail: phpText },
        502,
      );
    }

    return json({ success: true });
  } catch (err) {
    console.error("send-password-reset error:", err);
    return json({ success: false, error: String(err) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
