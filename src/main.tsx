import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import AppErrorBoundary from "./components/AppErrorBoundary.tsx";
import { supabase } from "@/integrations/supabase/client";
import "./index.css";

// Handle Supabase password-recovery links BEFORE HashRouter mounts.
// Supabase redirects to `/?reset-password=1#access_token=...&type=recovery&...`,
// but HashRouter will rewrite the hash and drop the tokens. Extract them first.
(function handleRecoveryHash() {
  try {
    const rawHash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    if (!rawHash || !rawHash.includes("access_token=")) return;
    const params = new URLSearchParams(rawHash);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const type = params.get("type");
    if (!access_token || !refresh_token) return;

    // Normalize URL: route to /reset-password via HashRouter, keep flag as query.
    const search = new URLSearchParams(window.location.search);
    search.set("reset-password", "1");
    const newUrl = `${window.location.pathname}?${search.toString()}#/reset-password`;
    window.history.replaceState(null, "", newUrl);

    // Hydrate the session so ResetPassword can call updateUser().
    supabase.auth.setSession({ access_token, refresh_token }).catch(() => {});
    if (type === "recovery") {
      // Mark so downstream can know this is a recovery flow if needed.
      (window as any).__passwordRecovery = true;
    }
  } catch {
    /* noop */
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>
);

document.documentElement.dataset.appLoaded = "true";
