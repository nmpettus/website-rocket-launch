import { useEffect, useMemo, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  priceId: string;
  customerEmail?: string;
  userId?: string;
  returnUrl: string;
}

export function StripeEmbeddedCheckout({ priceId, customerEmail, userId, returnUrl }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const createCheckoutSession = async () => {
      setClientSecret(null);
      setErrorMessage(null);

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;

        if (!accessToken) {
          throw new Error("Please sign in before starting checkout.");
        }

        const { data, error } = await supabase.functions.invoke("create-checkout", {
          headers: { Authorization: `Bearer ${accessToken}` },
          body: { priceId, customerEmail, userId, returnUrl, environment: getStripeEnvironment() },
        });

        if (error) {
          let message = error.message || "Failed to create checkout session";
          const response = (error as { context?: Response }).context;
          if (response) {
            try {
              const payload = await response.clone().json();
              if (payload?.error) message = payload.error;
            } catch {
              // Keep the original error message when the response is not JSON.
            }
          }
          throw new Error(message);
        }

        if (!data?.clientSecret) {
          throw new Error("Failed to create checkout session");
        }

        if (isMounted) setClientSecret(data.clientSecret);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Failed to create checkout session");
        }
      }
    };

    createCheckoutSession();

    return () => {
      isMounted = false;
    };
  }, [priceId, customerEmail, userId, returnUrl]);

  const checkoutOptions = useMemo(() => (
    clientSecret ? { clientSecret } : undefined
  ), [clientSecret]);

  if (errorMessage) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-base font-semibold text-destructive">
        {errorMessage}
      </div>
    );
  }

  if (!checkoutOptions) {
    return (
      <div className="rounded-lg border border-border bg-muted/40 p-4 text-base font-semibold text-foreground">
        Loading secure checkout…
      </div>
    );
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={checkoutOptions}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
