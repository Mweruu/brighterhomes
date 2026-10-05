import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Phone, MessageCircle, Mail, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BUSINESS } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: `Reservations dashboard — ${BUSINESS.name}` },
      { name: "description", content: "Review and manage incoming cleaning reservations." },
      { property: "og:title", content: `Reservations dashboard — ${BUSINESS.name}` },
      { property: "og:description", content: "Review and manage incoming cleaning reservations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
const STATUS_STYLE: Record<string, string> = {
  pending: "bg-accent text-accent-foreground",
  confirmed: "bg-primary text-primary-foreground",
  completed: "bg-secondary text-secondary-foreground",
  cancelled: "bg-muted text-muted-foreground line-through",
};

function waNumber(phone: string) {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("0")) d = "254" + d.slice(1);
  return d;
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const access = useQuery({
    queryKey: ["admin-access"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("claim_first_admin");
      if (error) throw error;
      return data as boolean;
    },
  });

  const list = useQuery({
    queryKey: ["reservations"],
    enabled: access.data === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("preferred_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reservations"] }),
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (access.isLoading) return <p className="p-10 text-center text-muted-foreground">Loading…</p>;
  if (!access.data)
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h1 className="font-display text-2xl font-semibold">No admin access</h1>
        <p className="mt-2 text-muted-foreground">This account isn't an administrator.</p>
        <button onClick={signOut} className="mt-4 underline">Sign out</button>
      </div>
    );

  const rows = (list.data ?? []).filter((r) => filter === "all" || r.status === filter);
  const counts = Object.fromEntries(STATUSES.map((s) => [s, (list.data ?? []).filter((r) => r.status === s).length]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold">Reservations</h1>
        <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-sm capitalize ${filter === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
            {s} {s !== "all" && `(${counts[s]})`}
          </button>
        ))}
      </div>

      {list.isLoading && <p className="mt-8 text-muted-foreground">Loading reservations…</p>}
      {list.error && <p className="mt-8 text-destructive">Couldn't load reservations.</p>}
      {!list.isLoading && rows.length === 0 && <p className="mt-8 text-muted-foreground">No reservations here yet.</p>}

      <div className="mt-6 grid gap-4">
        {rows.map((r) => {
          const date = new Date(r.preferred_date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
          const msg = `Hello ${r.name}, this is ${BUSINESS.name} about your ${r.service_type} booking on ${date} (${r.preferred_time}). `;
          return (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold">{r.name}</p>
                  <p className="text-sm text-muted-foreground">{r.service_type}{r.property_size ? ` · ${r.property_size}` : ""}</p>
                  <p className="mt-1 text-sm font-medium">{date} · {r.preferred_time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLE[r.status] ?? ""}`}>{r.status}</span>
                  <select value={r.status} disabled={update.isPending}
                    onChange={(e) => update.mutate({ id: r.id, status: e.target.value })}
                    className="rounded-lg border border-input bg-background px-2 py-1 text-sm capitalize">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              {r.notes && <p className="mt-3 rounded-lg bg-muted p-3 text-sm">{r.notes}</p>}
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5"><Phone className="h-4 w-4" />{r.phone}</a>
                <a href={`https://wa.me/${waNumber(r.phone)}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-primary-foreground"><MessageCircle className="h-4 w-4" />WhatsApp</a>
                {r.email && (
                  <a href={`mailto:${r.email}?subject=${encodeURIComponent(`Your ${BUSINESS.shortName} booking`)}&body=${encodeURIComponent(msg)}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5"><Mail className="h-4 w-4" />{r.email}</a>
                )}
                <span className="ml-auto self-center text-xs text-muted-foreground">Received {new Date(r.created_at).toLocaleString("en-GB")}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
