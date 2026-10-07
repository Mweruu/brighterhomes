import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { BUSINESS } from "@/lib/site";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: `Sign in — ${BUSINESS.name}` },
      { name: "description", content: "Sign in to view your bookings and details." },
      { property: "og:title", content: `Sign in — ${BUSINESS.name}` },
      { property: "og:description", content: "Sign in to view your bookings and details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Signed-in users (including returning from Google) go straight to the dashboard.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) navigate({ to: "/account" }); });
    const { data } = supabase.auth.onAuthStateChange((event) => { if (event === "SIGNED_IN") navigate({ to: "/account" }); });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg(error.message);
      navigate({ to: "/account" });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      setBusy(false);
      if (error) return setMsg(error.message);
      if (data.session) navigate({ to: "/account" });
      else setMsg("Check your email to confirm your account, then sign in.");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">
        {mode === "signin" ? "Sign in" : "Create your account"}
      </h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2" />
        <input type="password" required minLength={6} placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2" />
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <button disabled={busy} className="w-full rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:opacity-60">
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
        </button>
        <button type="button" onClick={async () => {
            const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
            if (res?.error) setMsg(res.error.message ?? "Google sign-in failed.");
          }}
          className="w-full rounded-full border border-border bg-background px-5 py-2.5 font-semibold">
          Continue with Google
        </button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-sm text-muted-foreground underline">
          {mode === "signin" ? "No account yet? Sign up" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
