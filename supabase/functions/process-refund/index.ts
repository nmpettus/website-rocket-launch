import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";
import { enforceSandboxIsAdmin } from "../_shared/adminGuard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { environment, subscriptionId } = await req.json();
    if (environment !== "sandbox" && environment !== "live") throw new Error("Invalid environment");

    await enforceSandboxIsAdmin(req, environment);

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("id, stripe_subscription_id, stripe_customer_id, price_id, current_period_end, status")
      .eq("id", subscriptionId)
      .eq("user_id", user.id)
      .eq("environment", environment)
      .maybeSingle();
    if (!sub?.stripe_subscription_id) throw new Error("Subscription not found");
    if (sub.price_id !== "reading_club_yearly") throw new Error("Refunds are only available for yearly plans");

    const { data: refundData, error: refundErr } = await supabase.rpc("get_refundable_amount", {
      _user_id: user.id,
      _environment: environment,
    });
    if (refundErr) throw refundErr;
    const info = refundData as { amount_cents: number; months_remaining: number } | null;
    if (!info || info.months_remaining <= 0 || info.amount_cents <= 0) {
      throw new Error("No refundable amount remaining");
    }

    const stripe = createStripeClient(environment as StripeEnv);

    // Cancel at period end so the user keeps access through the current month.
    const updated = await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Refund the most-recent paid invoice for the remaining whole months.
    const invoices = await stripe.invoices.list({
      subscription: sub.stripe_subscription_id,
      status: "paid",
      limit: 1,
    });
    const latestInvoice = invoices.data[0];
    if (!latestInvoice?.payment_intent) {
      throw new Error("Could not locate a refundable payment");
    }

    const refund = await stripe.refunds.create({
      payment_intent: typeof latestInvoice.payment_intent === "string"
        ? latestInvoice.payment_intent
        : latestInvoice.payment_intent.id,
      amount: info.amount_cents,
      reason: "requested_by_customer",
    });

    await supabase.from("refund_requests").insert({
      user_id: user.id,
      subscription_id: sub.id,
      amount_cents: info.amount_cents,
      months_remaining: info.months_remaining,
      status: "approved",
    });

    return new Response(
      JSON.stringify({
        refunded_cents: info.amount_cents,
        months_remaining: info.months_remaining,
        stripe_refund_id: refund.id,
        status: updated.status,
        cancel_at_period_end: updated.cancel_at_period_end,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("process-refund error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
