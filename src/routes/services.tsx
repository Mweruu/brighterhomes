import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Shirt,
  Home,
  Sofa,
  BedDouble,
  Hammer,
  Phone,
  MessageCircle,
  CalendarCheck,
  Check,
} from "lucide-react";
import carpetImage from "@/assets/carpet-textile-cleaning.jpg";
import { BUSINESS, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: `Services — ${BUSINESS.name}` },
      { name: "description", content: `Move-in deep cleaning, heavy textiles, carpets, upholstery, mattresses and post-renovation cleaning in ${BUSINESS.area}.` },
      { property: "og:title", content: `Services — ${BUSINESS.name}` },
      { property: "og:description", content: "Deep cleaning services for homes and offices: move-in cleans, carpets, upholstery and heavy textiles." },
    ],
  }),
  component: ServicesPage,
});


const services = [
  {
    icon: Home,
    title: "Move-in deep cleaning",
    blurb: "The full reset before your furniture arrives.",
    includes: [
      "Kitchen degreasing: hob, oven, extractor, inside cabinets",
      "Bathrooms descaled, disinfected and polished",
      "Windows, frames, tracks and door tops",
      "Inside wardrobes, cabinets and drawers",
      "Floors scrubbed and machine-deep cleaned",
    ],
  },
  {
    icon: Shirt,
    title: "Heavy textile cleaning",
    blurb: "Fabrics too bulky or delicate for a home wash.",
    includes: [
      "Curtains and drapes, on-site wherever possible",
      "Rugs, runners and throws",
      "Fabric-specific stain and odour treatment",
      "Collection & return service for off-site items",
      "Pressing and re-hanging included",
    ],
  },
  {
    icon: Sparkles,
    title: "Carpet & rug cleaning",
    blurb: "Hot-water extraction that lifts years of traffic.",
    includes: [
      "Deep vacuum and pre-spray of traffic lanes",
      "Hot-water extraction (steam) cleaning",
      "Stain treatment for tea, coffee, wine and mud",
      "Pet odour neutralising",
      "Fast-dry air movers on request",
    ],
  },
  {
    icon: Sofa,
    title: "Upholstery & sofa cleaning",
    blurb: "Sofas and chairs restored, not just wiped.",
    includes: [
      "Fabric and leather sofas, ottomans and dining chairs",
      "Cushion and seam-detail cleaning",
      "Deodorising and fabric-safe conditioning",
      "Colour-fastness tested before we start",
      "Quick-dry, low-moisture methods available",
    ],
  },
  {
    icon: BedDouble,
    title: "Mattress & curtain cleaning",
    blurb: "Sleep and breathe easier tonight.",
    includes: [
      "Steam sanitising of both mattress faces",
      "Dust-mite and allergen treatment",
      "Stain spot-treatment",
      "Curtains cleaned without full removal where possible",
      "Freshening deodoriser finish",
    ],
  },
  {
    icon: Hammer,
    title: "Post-renovation & move-out",
    blurb: "Builder dust gone. Deposit saved.",
    includes: [
      "Fine dust removal from every surface and vent",
      "Paint, adhesive and cement speck removal",
      "Window and glass polishing",
      "Full kitchen and bathroom reset",
      "Landlord / agent walkthrough standard",
    ],
  },
];

function ServicesPage() {
  return (
    <div>
      <section className="bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Our services</p>
          <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Every service, done to a walkthrough standard
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Pricing depends on the size of your space and its condition — reserve online or
            send us a WhatsApp photo of the job for a same-day quote.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <article key={s.title} className="flex flex-col rounded-3xl border border-border bg-card p-7">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <s.icon className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold">{s.title}</h2>
                  <p className="text-sm text-muted-foreground">{s.blurb}</p>
                </div>
              </div>
              <ul className="mt-5 flex-1 space-y-2.5">
                {s.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/booking"
                className="mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <CalendarCheck className="h-4 w-4" /> Reserve this service
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 grid items-center gap-8 overflow-hidden rounded-4xl border border-border bg-card lg:grid-cols-2">
          <img
            src={carpetImage}
            alt="Technician steam-cleaning a carpet"
            loading="lazy"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="p-8 lg:p-10">
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Not sure what your job needs?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Send us a photo on WhatsApp or call — we'll recommend the right service and
              give you a firm quote before anyone lifts a mop.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappLink(`Hello ${BUSINESS.shortName}! Here are photos of what I need cleaned.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <MessageCircle className="h-4.5 w-4.5" /> Send photos on WhatsApp
              </a>
              <a
                href={BUSINESS.phoneHref}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-primary/25 px-6 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                <Phone className="h-4.5 w-4.5" /> {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
