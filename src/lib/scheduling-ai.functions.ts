import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

interface DraftInput {
  reservationId: string;
  availability: string;
  channel: "whatsapp" | "email";
  extra?: string | undefined;
}

function friendlyError(err: unknown): string {
  const status = (err as { statusCode?: number })?.statusCode;
  if (status === 429) return "The AI is busy right now. Please wait a moment and try again.";
  if (status === 402) return "AI credits have run out. Add credits in your workspace billing settings to keep drafting.";
  if (status === 403) return "AI drafting isn't available for this workspace right now.";
  return "Couldn't draft a message right now. Please try again.";
}

export const draftSchedulingMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: DraftInput) => {
    const availability = String(raw?.availability ?? "").trim().slice(0, 1500);
    if (!raw?.reservationId) throw new Error("Missing reservation.");
    if (availability.length < 3) throw new Error("Please enter your available time slots.");
    return {
      reservationId: String(raw.reservationId),
      availability,
      channel: raw.channel === "email" ? ("email" as const) : ("whatsapp" as const),
      extra: String(raw.extra ?? "").trim().slice(0, 500),
    };
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { data: r, error } = await context.supabase
      .from("reservations")
      .select("*")
      .eq("id", data.reservationId)
      .single();
    if (error || !r) throw new Error("Reservation not found.");

    const { BUSINESS } = await import("./site");
    const { generateDraft } = await import("./ai-gateway.server");

    const system = `You write short, warm, professional scheduling messages for ${BUSINESS.name}, a cleaning company in ${BUSINESS.area}.
Rules: greet the customer by first name; reference their service and requested date/time; offer 2–4 concrete appointment options chosen ONLY from the admin's availability, preferring those closest to the customer's request; ask them to reply with their choice; sign off as the ${BUSINESS.shortName} team.
${data.channel === "whatsapp" ? "Format for WhatsApp: under 120 words, plain text, options as a numbered list, no subject line." : "Format as an email: first line 'Subject: ...', then the body, under 180 words."}
Never invent prices or availability. Output only the message.`;

    const prompt = `Reservation:
- Customer: ${r.name}
- Service: ${r.service_type}
- Property size: ${r.property_size ?? "not given"}
- Requested date: ${r.preferred_date}
- Requested time: ${r.preferred_time}
- Customer notes: ${r.notes ?? "none"}

My available time slots:
${data.availability}
${data.extra ? `\nExtra instructions: ${data.extra}` : ""}`;

    try {
      return { message: await generateDraft(system, prompt) };
    } catch (err) {
      console.error("AI draft failed:", err);
      return { error: friendlyError(err) };
    }
  });
