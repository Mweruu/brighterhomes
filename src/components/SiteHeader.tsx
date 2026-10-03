import { Link } from "@tanstack/react-router";
import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { BUSINESS, whatsappLink } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CalendarCheck className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="font-display text-lg font-semibold leading-tight tracking-tight">
            {BUSINESS.shortName}
            <span className="block text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Cleaning Co.
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/" activeProps={{ className: "text-primary" }} className="text-foreground/80 transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/services" activeProps={{ className: "text-primary" }} className="text-foreground/80 transition-colors hover:text-primary">
            Services
          </Link>
          <a href={BUSINESS.phoneHref} className="inline-flex items-center gap-1.5 text-foreground/80 transition-colors hover:text-primary">
            <Phone className="h-4 w-4" /> {BUSINESS.phoneDisplay}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappLink(`Hello ${BUSINESS.shortName}! I'd like to ask about your cleaning services.`)}
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center gap-1.5 rounded-full border border-primary/25 px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <Link
            to="/booking"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Reserve now
          </Link>
        </div>
      </div>
    </header>
  );
}
