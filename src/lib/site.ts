// Central place for the business details shown across the site.
// Update these values (name, phone numbers) and the whole site follows.
export const BUSINESS = {
  name: "Brighter Homes Cleaning Co.",
  shortName: "Brighter Homes",
  tagline: "Move-in deep cleaning, carpets, upholstery & heavy textiles",
  // Placeholder numbers — replace with the real ones.
  phoneDisplay: "+254 710559980",
  phoneHref: "tel:+254710559980",
  whatsappNumber: "254710559980", // international format, no + or spaces
  hours: "Mon–Sat, 8:00 AM – 6:00 PM",
  area: "Nairobi & surrounding counties",
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const SERVICE_TYPES = [
  "Move-in deep cleaning",
  "Heavy textile cleaning",
  "Carpet & rug cleaning",
  "Upholstery & sofa cleaning",
  "Mattress & curtain cleaning",
  "Post-renovation / move-out cleaning",
  "Something else",
] as const;

export const PROPERTY_SIZES = [
  "Single items (sofa, carpets…)",
  "Studio",
  "1 bedroom",
  "2 bedrooms",
  "3 bedrooms",
  "4+ bedrooms",
  "Office / commercial space",
] as const;

export const TIME_SLOTS = [
  "Morning (8 AM – 12 PM)",
  "Afternoon (12 PM – 4 PM)",
  "Late afternoon (4 PM – 7 PM)",
] as const;
