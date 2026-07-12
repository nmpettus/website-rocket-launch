import { useEffect, useState } from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { getAdminTestModeEnabled, setAdminTestModeEnabled } from "@/lib/stripe";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  /** When true, renders as a fixed floating pill (for pages like /join). */
  floating?: boolean;
}

export function AdminStripeModeToggle({ floating = false }: Props) {
  const { isAdmin, loading } = useIsAdmin();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(getAdminTestModeEnabled());
  }, []);

  if (loading || !isAdmin) return null;

  const handleToggle = (next: boolean) => {
    setEnabled(next);
    setAdminTestModeEnabled(next);
    // Reload so useSubscription, checkout, and portal all re-read env consistently.
    window.location.reload();
  };

  const inner = (
    <div className="flex items-center gap-3 rounded-full border bg-card px-4 py-2 shadow-md">
      <Label htmlFor="admin-stripe-test-mode" className="text-sm font-semibold cursor-pointer">
        Admin: Stripe test mode
      </Label>
      <Switch
        id="admin-stripe-test-mode"
        checked={enabled}
        onCheckedChange={handleToggle}
      />
      <span className={`text-xs font-medium ${enabled ? "text-orange-600" : "text-emerald-600"}`}>
        {enabled ? "TEST" : "LIVE"}
      </span>
    </div>
  );

  if (floating) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        {inner}
      </div>
    );
  }
  return <div className="mb-4">{inner}</div>;
}
