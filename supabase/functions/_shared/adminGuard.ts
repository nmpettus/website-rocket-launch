import { createClient } from "npm:@supabase/supabase-js@2";

/**
 * Reject sandbox requests unless the caller is an authenticated admin.
 * Live requests pass through unchanged (public checkout must work signed-out).
 * Throws on any violation so callers can return 4xx via their catch block.
 */
const PRODUCTION_HOSTS = [
  "booksbymaggie.com",
  "www.booksbymaggie.com",
  "website-rocket-launch.lovable.app",
];

function isProductionOrigin(req: Request): boolean {
  const origin = req.headers.get("Origin") ?? req.headers.get("Referer") ?? "";
  try {
    return PRODUCTION_HOSTS.includes(new URL(origin).hostname);
  } catch {
    return false;
  }
}

export async function enforceSandboxIsAdmin(
  req: Request,
  environment: "sandbox" | "live",
): Promise<void> {
  if (environment !== "sandbox") return;
  // Preview/localhost run on the test token by design — only lock sandbox
  // mode down on the real production domains.
  if (!isProductionOrigin(req)) return;

  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("Sandbox mode requires admin authentication");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) throw new Error("Sandbox mode requires admin authentication");

  const { data: role } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!role) throw new Error("Sandbox mode is restricted to admin users");
}
