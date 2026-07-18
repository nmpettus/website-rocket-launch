import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";
import { enforceSandboxIsAdmin } from "../_shared/adminGuard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId?: string },
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    if (found.data.length) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (options.userId && customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    ...(options.userId && { metadata: { userId: options.userId } }),
  });
  return created.id;
}

const READING_CLUB_PRICES: Record<string, { amount: number; interval: "month" | "year" }> = {
  reading_club_monthly: { amount: 499, interval: "month" },
  reading_club_yearly: { amount: 4900, interval: "year" },
};

async function getOrCreateReadingClubPrice(
  stripe: ReturnType<typeof createStripeClient>,
  priceId: string,
) {
  const prices = await stripe.prices.list({ lookup_keys: [priceId], active: true, limit: 1 });
  if (prices.data.length) return prices.data[0];

  const priceConfig = READING_CLUB_PRICES[priceId];
  if (!priceConfig) throw new Error("Price not found");

  console.warn(`Price lookup_key ${priceId} missing; creating managed Reading Club price.`);
  const product = await stripe.products.create({
    name: "Maggie's Reading Club",
    description: "Unlimited online access to Maggie's library with narration",
    tax_code: "txcd_10103001",
    metadata: {
      lovable_external_id: "reading_club",
      lovable_managed: "true",
    },
  });

  const createdPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: priceConfig.amount,
    currency: "usd",
    recurring: { interval: priceConfig.interval },
    lookup_key: priceId,
    metadata: {
      lovable_external_id: priceId,
      lovable_managed: "true",
    },
  });

  return createdPrice;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const { priceId, customerEmail, userId, returnUrl, environment } = await req.json();
    console.log("create-checkout request", {
      priceId,
      environment,
      hasUserId: Boolean(userId),
      hasCustomerEmail: Boolean(customerEmail),
    });
    if (!priceId || !/^[a-zA-Z0-9_-]+$/.test(priceId)) throw new Error("Invalid priceId");
    if (environment !== "sandbox" && environment !== "live") throw new Error("Invalid environment");

    await enforceSandboxIsAdmin(req, environment);

    const stripe = createStripeClient(environment as StripeEnv);
    const stripePrice = await getOrCreateReadingClubPrice(stripe, priceId);

    const customerId = await resolveOrCreateCustomer(stripe, { email: customerEmail, userId });

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "subscription",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      customer: customerId,
      subscription_data: {
        trial_period_days: 7,
        ...(userId && { metadata: { userId } }),
      },
      ...(userId && { metadata: { userId } }),
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-checkout error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
