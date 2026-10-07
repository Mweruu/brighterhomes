import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BUSINESS, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: `My account — ${BUSINESS.name}` },
      { name: "description", content: "View your cleaning bookings and update your details." },
      { property: "og:title", content: `My account — ${BUSINESS.name}` },
      { property: "og:description", content: "View your cleaning bookings and update your details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-accent text-accent-foreground",
  confirmed: "bg-primary text-primary-foreground",
  completed: "bg-secondary text-secondary-foreground",
  cancelled: "bg-muted text-muted-foreground",
};

function AccountPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const isAdmin = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      return !!data;
    },
  });

  const profile = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const bookings = useQuery({
    queryKey: ["my-bookings", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("id, service_type, property_size, preferred_date, preferred_time, status, notes, created_at")
        .eq("user_id", user.id)
        .order("preferred_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState({ full_name: "", phone: "", address: "" });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (profile.data)
      setForm({
        full_name: profile.data.full_name ?? "",
        phone: profile.data.phone ?? "",
        address: profile.data.address ?? "",
      });
  }, [profile.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: form.full_name.trim().slice(0, 100) || null,
        phone: form.phone.trim().slice(0, 30) || null,
        address: form.address.trim().slice(0, 300) || null,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      qc.invalidateQueries({ queryKey: ["profile", user.id] });
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    save.mutate();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">My account</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin.data && (
            <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1.5 text-sm font-medium text-primary">
              <ShieldCheck className="h-4 w-4" /> Staff dashboard
            </Link>
          )}
          <button onClick={signOut} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">My bookings</h2>
            <Link to="/booking" className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">New booking</Link>
          </div>
          {bookings.isLoading && <p className="mt-4 text-muted-foreground">Loading…</p>}
          {bookings.error && <p className="mt-4 text-destructive">Couldn't load your bookings.</p>}
          {bookings.data?.length === 0 && (
            <p className="mt-4 rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground">
              No bookings yet. Bookings you make while signed in will appear here.
            </p>
          )}
          <div className="mt-4 grid gap-3">
            {bookings.data?.map((b) => (
              <div key={b.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{b.service_type}</p>
                    {b.property_size && <p className="text-sm text-muted-foreground">{b.property_size}</p>}
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      {new Date(b.preferred_date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} · {b.preferred_time}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLE[b.status] ?? ""}`}>{b.status}</span>
                </div>
                {b.notes && <p className="mt-2 text-sm text-muted-foreground">{b.notes}</p>}
                <a href={whatsappLink(`Hello ${BUSINESS.shortName}, about my ${b.service_type} booking on ${b.preferred_date}: `)}
                  target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-primary underline">
                  Need to change it? Message us on WhatsApp
                </a>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">My details</h2>
          <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-5">
            <label className="block text-sm font-medium">Full name
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 font-normal" />
            </label>
            <label className="block text-sm font-medium">Phone
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 font-normal" />
            </label>
            <label className="block text-sm font-medium">Address / area
              <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 font-normal" />
            </label>
            {save.error && <p className="text-sm text-destructive">Couldn't save. Please try again.</p>}
            <button disabled={save.isPending} className="w-full rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60">
              {save.isPending ? "Saving…" : saved ? "Saved ✓" : "Save details"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
