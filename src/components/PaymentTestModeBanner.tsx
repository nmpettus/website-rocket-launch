import { getStripeEnvironment } from "@/lib/stripe";

export function PaymentTestModeBanner() {
  let env: "sandbox" | "live";
  try {
    env = getStripeEnvironment();
  } catch {
    return (
      <div className="w-full bg-red-100 border-b border-red-300 px-4 py-2 text-center text-sm text-red-800">
        Payments are not configured yet.
      </div>
    );
  }
  if (env === "sandbox") {
    return (
      <div className="w-full bg-orange-100 border-b border-orange-300 px-4 py-2 text-center text-sm text-orange-800">
        Test mode — payments are not real charges. Use Stripe test cards only.
      </div>
    );
  }
  return null;
}
