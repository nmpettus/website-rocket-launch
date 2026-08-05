import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface MemberRow {
  user_id: string;
  email: string;
  subscription_id: string;
  status: string;
  price_id: string | null;
  environment: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  credit_balance: number;
}

const PLAN_LABELS: Record<string, string> = {
  reading_club_monthly: "Monthly $4.99",
  reading_club_yearly: "Yearly $49",
};

function planLabel(priceId: string | null) {
  if (!priceId) return "—";
  return PLAN_LABELS[priceId] ?? priceId;
}

function fmt(dt: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "active":
    case "trialing":
      return "bg-green-100 text-green-800 border-green-200";
    case "past_due":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "canceled":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export function MembersTab() {
  const [rows, setRows] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hideTest, setHideTest] = useState(true);
  const [adjusting, setAdjusting] = useState<Record<string, boolean>>({});
  const [adjustValues, setAdjustValues] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.rpc("admin_list_members");
    if (error) setError(error.message);
    else setRows((data ?? []) as MemberRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => hideTest ? rows.filter(r => !r.email.toLowerCase().endsWith("@example.com")) : rows,
    [rows, hideTest]
  );

  const counts = useMemo(() => {
    const c = { active: 0, trialing: 0, canceled: 0 };
    for (const r of filtered) {
      if (r.status === "active") c.active++;
      else if (r.status === "trialing") c.trialing++;
      else if (r.status === "canceled") c.canceled++;
    }
    return c;
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Active</p>
            <p className="text-2xl font-bold">{counts.active}</p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Trialing</p>
            <p className="text-2xl font-bold">{counts.trialing}</p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Canceled</p>
            <p className="text-2xl font-bold">{counts.canceled}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="hide-test" checked={hideTest} onCheckedChange={setHideTest} />
            <Label htmlFor="hide-test" className="text-sm">Hide @example.com test accounts</Label>
          </div>
          <Button size="sm" variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 p-6 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading members…
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm p-4">No members to display.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="px-3 py-2 font-semibold">Plan</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Env</th>
                <th className="px-3 py-2 font-semibold">Trial ends / Renews</th>
                <th className="px-3 py-2 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.subscription_id} className="border-t">
                  <td className="px-3 py-2 font-medium">{r.email}</td>
                  <td className="px-3 py-2">{planLabel(r.price_id)}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${statusBadgeClass(r.status)}`}>
                      {r.status}
                      {r.cancel_at_period_end && r.status !== "canceled" ? " (cancels)" : ""}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs uppercase text-muted-foreground">{r.environment}</td>
                  <td className="px-3 py-2">{fmt(r.current_period_end)}</td>
                  <td className="px-3 py-2 text-muted-foreground">{fmt(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
