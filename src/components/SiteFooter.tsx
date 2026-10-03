import { Link } from "@tanstack/react-router";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { BUSINESS, whatsappLink } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold">{BUSINESS.shortName}</p>
          <p className="mt-1 text-sm uppercase tracking-[0.14em] text-primary-foreground/70">
            Cleaning Co.
          </p>
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/80">{BUSINESS.tagline}.</p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-display text-lg font-semibold">Talk to us</p>
          <a href={BUSINESS.phoneHref} className="flex items-center gap-2.5 text-primary-foreground/85 transition-colors hover:text-primary-foreground">
            <Phone className="h-4 w-4" /> {BUSINESS.phoneDisplay}
          </a>
          <a
            href={whatsappLink(`Hello ${BUSINESS.shortName}! I'd like to book a cleaning.`)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 text-primary-foreground/85 transition-colors hover:text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp us
          </a>
          <Link to="/booking" className="flex items-center gap-2.5 text-primary-foreground/85 transition-colors hover:text-primary-foreground">
            <CalendarGlyph /> Reserve a cleaning online
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-display text-lg font-semibold">Hours & area</p>
          <p className="flex items-center gap-2.5 text-primary-foreground/85">
            <Clock className="h-4 w-4" /> {BUSINESS.hours}
          </p>
          <p className="flex items-center gap-2.5 text-primary-foreground/85">
            <MapPin className="h-4 w-4" /> {BUSINESS.area}
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
      </div>
    </footer>
  );
}

function CalendarGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
