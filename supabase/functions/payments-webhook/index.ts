import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
  }
  return _supabase;
}

async function handleSubscriptionCreated(subscription: any, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) { console.error("No userId in sub metadata"); return; }

  const item = subscription.items?.data?.[0];
  const priceId = item?.price?.lookup_key || item?.price?.metadata?.lovable_external_id || item?.price?.id;
  const productId = item?.price?.product;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;

  await getSupabase().from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      product_id: productId,
      price_id: priceId,
      status: subscription.status,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );
}

async function handleSubscriptionUpdated(subscription: any, env: StripeEnv) {
  const item = subscription.items?.data?.[0];
  const priceId = item?.price?.lookup_key || item?.price?.metadata?.lovable_external_id || item?.price?.id;
  const productId = item?.price?.product;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;

  await getSupabase().from("subscriptions").update({
    status: subscription.status,
    product_id: productId,
    price_id: priceId,
    current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    cancel_at_period_end: subscription.cancel_at_period_end || false,
    updated_at: new Date().toISOString(),
  }).eq("stripe_subscription_id", subscription.id).eq("environment", env);
}

async function handleSubscriptionDeleted(subscription: any, env: StripeEnv) {
  await getSupabase().from("subscriptions").update({
    status: "canceled",
    updated_at: new Date().toISOString(),
  }).eq("stripe_subscription_id", subscription.id).eq("environment", env);
}

async function grantCreditsForInvoice(invoice: any, env: StripeEnv) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const { data: sub } = await getSupabase()
    .from("subscriptions")
    .select("id, user_id, price_id, current_period_start")
    .eq("stripe_subscription_id", subscriptionId)
    .eq("environment", env)
    .maybeSingle();
  if (!sub?.user_id || !sub?.price_id) return;

  const periodStart = invoice.period_start
    ? new Date(invoice.period_start * 1000).toISOString().split("T")[0]
    : (sub.current_period_start ? new Date(sub.current_period_start).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
  const sourceRef = `invoice:${invoice.id}:${periodStart}`;

  await getSupabase().rpc("grant_monthly_credits", {
    _user_id: sub.user_id,
    _price_id: sub.price_id,
    _period_start: periodStart,
    _source_ref: sourceRef,
    _environment: env,
  });
}

async function grantCreditsForSubscription(subscription: any, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  const item = subscription.items?.data?.[0];
  const priceId = item?.price?.lookup_key || item?.price?.metadata?.lovable_external_id || item?.price?.id;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  if (!userId || !priceId) return;

  const date = periodStart ? new Date(periodStart * 1000).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
  const sourceRef = `subscription:${subscription.id}:${date}`;

  await getSupabase().rpc("grant_monthly_credits", {
    _user_id: userId,
    _price_id: priceId,
    _period_start: date,
    _source_ref: sourceRef,
    _environment: env,
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), { status: 200 });
  }
  const env: StripeEnv = rawEnv;
  try {
    const event = await verifyWebhook(req, env);
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object, env);
        await grantCreditsForSubscription(event.data.object, env);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object, env); break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object, env); break;
      case "invoice.paid":
        await grantCreditsForInvoice(event.data.object, env); break;
      default:
        console.log("Unhandled event:", event.type);
    }
    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});
