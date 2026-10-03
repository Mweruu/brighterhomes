import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarCheck,
  Phone,
  MessageCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { submitReservation } from "@/lib/reservations.functions";
import { BUSINESS, PROPERTY_SIZES, SERVICE_TYPES, TIME_SLOTS, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: `Reserve a cleaning — ${BUSINESS.name}` },
      { name: "description", content: "Reserve move-in deep cleaning, carpet, upholstery or textile cleaning. Pick your service, property size, date and time — we confirm the same day." },
      { property: "og:title", content: `Reserve a cleaning — ${BUSINESS.name}` },
      { property: "og:description", content: "Pick your service, date and time. We confirm the same day." },
    ],
  }),
  component: BookingPage,
});

const inputClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30";

function BookingPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    serviceType: "",
    propertySize: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<typeof form | null>(null);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");
    try {
      await submitReservation({ data: { ...form, email: form.email || undefined, notes: form.notes || undefined } });
      setConfirmed(form);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "success" && confirmed) {
    const summary = `Hello ${BUSINESS.shortName}! I just reserved ${confirmed.serviceType} for ${confirmed.preferredDate} (${confirmed.preferredTime}). Name: ${confirmed.name}.`;
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="rounded-4xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
            Reservation received!
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Thank you, {confirmed.name.split(" ")[0]}. We've booked your request for{" "}
            <strong className="text-foreground">{confirmed.serviceType}</strong> on{" "}
            <strong className="text-foreground">{confirmed.preferredDate}</strong>,{" "}
            {confirmed.preferredTime.toLowerCase()}. We'll call {confirmed.phone} shortly to
            confirm and give you a quote.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink(summary)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <MessageCircle className="h-4.5 w-4.5" /> Confirm faster on WhatsApp
            </a>
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-primary/25 px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              <Phone className="h-4.5 w-4.5" /> Call us now
            </a>
          </div>
          <button
            onClick={() => {
              setStatus("idle");
              setConfirmed(null);
              setForm({
                name: "", phone: "", email: "", serviceType: "",
                propertySize: "", preferredDate: "", preferredTime: "", notes: "",
              });
            }}
            className="mt-6 text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            Make another reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Reserve your slot</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Book your cleaning in two minutes
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Tell us what needs cleaning and when. We reply the same day with a quote and confirm
        your arrival window.
      </p>

      <form onSubmit={handleSubmit} className="mt-9 space-y-6 rounded-4xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {/* Contact details */}
        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-semibold">Contact details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Full name *</span>
              <input required value={form.name} onChange={(e) => set("name")(e.target.value)} placeholder="Jane Wanjiku" className={inputClass} maxLength={100} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Phone number *</span>
              <input required type="tel" value={form.phone} onChange={(e) => set("phone")(e.target.value)} placeholder="+254 7XX XXX XXX" className={inputClass} maxLength={30} />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Email <span className="font-normal text-muted-foreground">(optional)</span></span>
            <input type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} placeholder="you@example.com" className={inputClass} maxLength={255} />
          </label>
        </fieldset>

        {/* Service details */}
        <fieldset className="space-y-4 border-t border-border pt-6">
          <legend className="font-display text-lg font-semibold">What do you need cleaned?</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Service *</span>
              <select required value={form.serviceType} onChange={(e) => set("serviceType")(e.target.value)} className={inputClass}>
                <option value="" disabled>Choose a service…</option>
                {SERVICE_TYPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Property size *</span>
              <select required value={form.propertySize} onChange={(e) => set("propertySize")(e.target.value)} className={inputClass}>
                <option value="" disabled>Choose a size…</option>
                {PROPERTY_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>

        {/* Schedule */}
        <fieldset className="space-y-4 border-t border-border pt-6">
          <legend className="font-display text-lg font-semibold">When would you like us?</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Preferred date *</span>
              <input required type="date" value={form.preferredDate} onChange={(e) => set("preferredDate")(e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Preferred time *</span>
              <select required value={form.preferredTime} onChange={(e) => set("preferredTime")(e.target.value)} className={inputClass}>
                <option value="" disabled>Choose a time…</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              Anything else we should know? <span className="font-normal text-muted-foreground">(stains, pets, parking, gate codes…)</span>
            </span>
            <textarea value={form.notes} onChange={(e) => set("notes")(e.target.value)} rows={3} maxLength={1000} placeholder="e.g. Two large cream sofas, red wine stain on the lounge carpet, dog at home (friendly)." className="w-full rounded-xl border border-input bg-background px-3.5 py-3 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30" />
          </label>
        </fieldset>

        {error && (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" /> Sending reservation…
            </>
          ) : (
            <>
              <CalendarCheck className="h-4.5 w-4.5" /> Reserve my cleaning
            </>
          )}
        </button>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Prefer to talk? Call{" "}
          <a href={BUSINESS.phoneHref} className="font-semibold text-primary underline-offset-2 hover:underline">
            {BUSINESS.phoneDisplay}
          </a>{" "}
          or{" "}
          <a
            href={whatsappLink(`Hello ${BUSINESS.shortName}! I'd like to reserve a cleaning.`)}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            message us on WhatsApp
          </a>{" "}
          — {BUSINESS.hours}.
        </p>
      </form>
    </div>
  );
}
