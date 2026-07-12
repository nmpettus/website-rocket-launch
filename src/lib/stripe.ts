import { loadStripe, Stripe } from "@stripe/stripe-js";
import { stripeClientToken, STRIPE_TEST_PUBLISHABLE_KEY } from "@/lib/publicConfig";

type StripeEnv = 'sandbox' | 'live';

const ADMIN_TEST_MODE_KEY = "admin_stripe_test_mode";

export function getAdminTestModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(ADMIN_TEST_MODE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAdminTestModeEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (enabled) window.localStorage.setItem(ADMIN_TEST_MODE_KEY, "true");
    else window.localStorage.removeItem(ADMIN_TEST_MODE_KEY);
  } catch {
    // ignore
  }
  // Reset cached Stripe.js instance so the next getStripe() picks the right key.
  stripePromise = null;
}

function buildTokenFromEnv(): string {
  if (getAdminTestModeEnabled()) return STRIPE_TEST_PUBLISHABLE_KEY;
  return stripeClientToken;
}

function paymentsEnvironment(): StripeEnv {
  const token = buildTokenFromEnv();
  if (token?.startsWith('pk_test_')) return 'sandbox';
  if (token?.startsWith('pk_live_')) return 'live';
  throw new Error(
    "Payments are not configured for this build. Complete go-live in your Lovable project to enable production checkout."
  );
}

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const token = buildTokenFromEnv();
    paymentsEnvironment();
    stripePromise = loadStripe(token);
  }
  return stripePromise;
}

export function getStripeEnvironment(): StripeEnv {
  return paymentsEnvironment();
}
