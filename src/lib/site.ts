// Central place for the business details shown across the site.
// Update these values (name, phone numbers) and the whole site follows.
export const BUSINESS = {
  name: "Brighter Homes Cleaning Co.",
  shortName: "Brighter Homes",
  tagline: "Move-in deep cleaning, carpets, upholstery & heavy textiles",
  // Placeholder numbers — replace with the real ones.
  phoneDisplay: "+254 712 345 678",
  phoneHref: "tel:+254712345678",
  whatsappNumber: "254712345678", // international format, no + or spaces
  hours: "Mon–Sat, 8:00 AM – 6:00 PM",
  area: "Nairobi & surrounding counties",
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
