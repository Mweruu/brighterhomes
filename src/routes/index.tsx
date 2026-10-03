import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Home,
  Shirt,
  BedDouble,
  Sofa,
  Hammer,
  Phone,
  MessageCircle,
  CalendarCheck,
  ShieldCheck,
  Leaf,
  Users,
  BadgeCheck,
  Check,
} from "lucide-react";
import heroImage from "@/assets/hero-clean-living-room.jpg";
import carpetImage from "@/assets/carpet-textile-cleaning.jpg";
import { BUSINESS, SERVICE_TYPES, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BUSINESS.name} — Move-in deep cleaning, carpets & upholstery` },
      { name: "description", content: `Move-in deep cleaning, heavy textile, carpet and upholstery cleaning in ${BUSINESS.area}. Reserve online, call, or WhatsApp us.` },
      { property: "og:title", content: `${BUSINESS.name} — Move-in deep cleaning, carpets & upholstery` },
      { property: "og:description", content: "Move-in deep cleaning, carpet, upholstery and heavy textile cleaning. Reserve online, call, or WhatsApp." },
    ],
  }),
  component: Index,
});


const services = [
  {
    icon: Home,
    title: "Move-in deep cleaning",
    description:
      "Every corner scrubbed, degreased and disinfected before you unpack — kitchen, bathrooms, floors, windows and inside cabinets.",
  },
  {
    icon: Shirt,
    title: "Heavy textile cleaning",
    description:
      "Curtains, drapes, throws and rugs handled with the right method for each fabric, on-site or collected and returned pressed.",
  },
  {
    icon: Sparkles,
    title: "Carpet & rug cleaning",
    description:
      "Deep hot-water extraction that lifts dust, stains and odours from wall-to-wall carpets and loose rugs, wool included.",
  },
  {
    icon: Sofa,
    title: "Upholstery & sofa cleaning",
    description:
      "Fabric and leather sofas, dining chairs and ottomans gently deep-cleaned, deodorised and left quick-drying.",
  },
  {
    icon: BedDouble,
    title: "Mattress & curtain cleaning",
    description:
      "Steam sanitising for mattresses and on-site curtain cleaning — no need to take them down in most cases.",
  },
  {
    icon: Hammer,
    title: "Post-renovation & move-out",
    description:
      "Dust, paint specks and cement haze removed after builders leave — or hand your old home back spotless.",
  },
];


const steps = [
  {
    title: "Reserve your slot",
    body: "Fill in the short form, call us, or send a WhatsApp message — tell us the service, your space and when you'd like us.",
  },
  {
    title: "We confirm & quote",
    body: "We reply the same day with a clear quote and arrival window. No hidden charges.",
  },
  {
    title: "We clean, you inspect",
    body: "Our uniformed team arrives fully equipped. You walk through with the lead cleaner before we leave.",
  },
];

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Move-in & deep cleaning specialists
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Move into a home that's{" "}
              <span className="italic text-primary">already spotless.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Deep cleaning, carpets, upholstery and heavy textiles — done properly by a
              vetted, uniformed team. Reserve the day and time that suits you; we handle
              the rest.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/booking"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                <CalendarCheck className="h-4.5 w-4.5" /> Reserve your cleaning
              </Link>
              <a
                href={whatsappLink(`Hello ${BUSINESS.shortName}! I'd like to book a cleaning.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-primary/25 px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                <MessageCircle className="h-4.5 w-4.5" /> WhatsApp us
              </a>
              <a
                href={BUSINESS.phoneHref}
                className="inline-flex h-12 items-center gap-2 rounded-full px-3 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" /> {BUSINESS.phoneDisplay}
              </a>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
              {[
                ["Same-day", "quotes"],
                ["Vetted", "cleaning teams"],
                ["Eco-friendly", "products"],
              ].map(([top, bottom]) => (
                <div key={top}>
                  <dt className="font-display text-lg font-semibold text-primary">{top}</dt>
                  <dd className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{bottom}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -right-6 -top-6 hidden h-28 w-28 rounded-full bg-accent/60 blur-2xl lg:block" />
            <img
              src={heroImage}
              alt="Professional cleaner finishing a freshly deep-cleaned living room"
              width={1920}
              height={1280}
              className="relative w-full rounded-3xl object-cover shadow-xl ring-1 ring-black/5"
            />
            <div className="absolute -bottom-5 left-6 flex items-center gap-2.5 rounded-2xl bg-card px-4 py-3 shadow-lg ring-1 ring-black/5">
              <BadgeCheck className="h-5 w-5 text-primary" />
              <p className="text-xs font-semibold leading-tight">
                100% satisfaction guarantee
                <span className="block font-normal text-muted-foreground">or we come back — free</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">What we clean</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Services built around deep, heavy work
            </h2>
          </div>
          <Link to="/services" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
            See what's included →
          </Link>
        </div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
              <Link
                key={service.title}
                to="/booking"
                className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <service.icon className="h-5 w-5" />
                </span>

                <h3 className="mt-4 font-display text-xl font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Booked in minutes, spotless in hours
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-3xl border border-border bg-card p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-lg font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us + image */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-14">
        <img
          src={carpetImage}
          alt="Technician deep-cleaning a carpet with an extraction machine"
          loading="lazy"
          width={1920}
          height={1280}
          className="w-full rounded-3xl object-cover shadow-xl ring-1 ring-black/5"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Why Brighter Homes</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Serious equipment, gentle hands
          </h2>
          <ul className="mt-7 space-y-4">
            {[
              [ShieldCheck, "Insured & vetted team", "Background-checked cleaners, fully insured while in your home."],
              [Leaf, "Family-safe products", "Eco-friendly detergents that are safe for children and pets."],
              [Users, "Uniformed professionals", "The same trained crew standard on every job — no day labourers."],
            ].map(([Icon, title, body]) => {
              const IconComp = Icon as typeof ShieldCheck;
              return (
                <li key={title as string} className="flex gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <IconComp className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{title as string}</p>
                    <p className="text-sm text-muted-foreground">{body as string}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="overflow-hidden rounded-4xl bg-primary px-6 py-12 text-primary-foreground sm:px-12">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready for the cleanest day of your move?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
                Slots fill fast at month-end. Reserve now and we'll confirm your time the same day.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/booking"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                <CalendarCheck className="h-4.5 w-4.5" /> Reserve online
              </Link>
              <a
                href={BUSINESS.phoneHref}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-primary-foreground/30 px-6 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
              >
                <Phone className="h-4.5 w-4.5" /> Call {BUSINESS.phoneDisplay}
              </a>
              <a
                href={whatsappLink(`Hello ${BUSINESS.shortName}! I'd like a quote for a deep clean.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-primary-foreground/30 px-6 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
              >
                <MessageCircle className="h-4.5 w-4.5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick service checklist strip */}
      <section className="border-t border-border bg-secondary/50">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 text-sm sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {SERVICE_TYPES.slice(0, 4).map((s) => (
            <p key={s} className="flex items-center gap-2 font-medium text-foreground/85">
              <Check className="h-4 w-4 text-primary" /> {s}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
