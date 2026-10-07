import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { PROPERTY_SIZES, SERVICE_TYPES, TIME_SLOTS } from "./site";

export interface ReservationInput {
  name: string;
  phone: string;
  email?: string | undefined;
  serviceType: string;
  propertySize: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string | undefined;
}


function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Validates and normalizes the reservation payload before it reaches the
// database. Throws a plain Error with a user-readable message on bad input.
function validateReservation(raw: unknown): ReservationInput {
  const input = (raw ?? {}) as Record<string, unknown>;
  const name = str(input["name"], 100);
  const phone = str(input["phone"], 30);
  const email = str(input["email"], 255);
  const serviceType = str(input["serviceType"], 100);
  const propertySize = str(input["propertySize"], 100);
  const preferredDate = str(input["preferredDate"], 10);
  const preferredTime = str(input["preferredTime"], 50);
  const notes = str(input["notes"], 1000);


  if (name.length < 2) throw new Error("Please enter your name.");
  if (phone.length < 7) throw new Error("Please enter a valid phone number.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Please enter a valid email address.");
  if (!SERVICE_TYPES.includes(serviceType as (typeof SERVICE_TYPES)[number]))
    throw new Error("Please choose a service.");
  if (!PROPERTY_SIZES.includes(propertySize as (typeof PROPERTY_SIZES)[number]))
    throw new Error("Please choose a property size.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate))
    throw new Error("Please choose a preferred date.");
  if (!TIME_SLOTS.includes(preferredTime as (typeof TIME_SLOTS)[number]))
    throw new Error("Please choose a preferred time.");

  return { name, phone, email: email || undefined, serviceType, propertySize, preferredDate, preferredTime, notes: notes || undefined };
}

export const submitReservation = createServerFn({ method: "POST" })
  .inputValidator(validateReservation)
  .handler(async ({ data }) => {
    const key: string = process.env["SUPABASE_PUBLISHABLE_KEY"] || import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
    const url: string = process.env["SUPABASE_URL"] || import.meta.env["VITE_SUPABASE_URL"];

    // If the visitor is signed in, the bearer token is attached automatically.
    // Validate it server-side and own the booking as that user (never trust client data).
    const { getRequest } = await import("@tanstack/react-start/server");
    const authHeader = getRequest()?.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    const userToken = token.split(".").length === 3 ? token : "";

    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (userToken) h.set("Authorization", `Bearer ${userToken}`);
          else if (h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    let userId: string | null = null;
    if (userToken) {
      const { data: claims } = await supabase.auth.getClaims(userToken);
      userId = (claims?.claims?.sub as string | undefined) ?? null;
    }

    const { error } = await supabase.from("reservations").insert({
      name: data.name,
      phone: data.phone,
      email: data.email ?? null,
      service_type: data.serviceType,
      property_size: data.propertySize,
      preferred_date: data.preferredDate,
      preferred_time: data.preferredTime,
      notes: data.notes ?? null,
      user_id: userId,
    });

    if (error) {
      console.error("Reservation insert failed:", error.message);
      throw new Error("We couldn't save your reservation. Please try again or reach us on WhatsApp.");
    }

    return { ok: true as const };
  });
