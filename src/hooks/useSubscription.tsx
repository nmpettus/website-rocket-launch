import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { getStripeEnvironment } from "@/lib/stripe";

export interface SubscriptionRow {
  id: string;
  status: string;
  price_id: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_customer_id: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSub = async () => {
    if (!user) { setSubscription(null); setLoading(false); return; }
    let env: 'sandbox' | 'live' = 'sandbox';
    try { env = getStripeEnvironment(); } catch { /* leave default */ }
    const { data } = await supabase
      .from("subscriptions")
      .select("id,status,price_id,current_period_end,cancel_at_period_end,stripe_customer_id")
      .eq("user_id", user.id)
      .eq("environment", env)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setSubscription(data as SubscriptionRow | null);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchSub();
    if (!user) return;
    const channel = supabase
      .channel(`sub-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${user.id}` }, fetchSub)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const isActive = !!subscription && (() => {
    const end = subscription.current_period_end ? new Date(subscription.current_period_end).getTime() : null;
    const future = end === null || end > Date.now();
    if (["active", "trialing", "past_due"].includes(subscription.status) && future) return true;
    if (subscription.status === "canceled" && end && end > Date.now()) return true;
    return false;
  })();

  return { subscription, loading, isActive, refetch: fetchSub };
}
