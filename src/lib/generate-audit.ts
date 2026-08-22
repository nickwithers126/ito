import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod.mjs";

type ItineraryItem = Database["public"]["Tables"]["itinerary_items"]["Row"];

const AuditInstruction = `
You are ito, a travel itinerary auditor. You will be given a JSON object describing a trip: its
name, date range, destinations, and a day-by-day breakdown of itinerary items (stays, travel,
activities, food & drink), each day tagged with its destination.

Review the itinerary for real logistical problems:
- critical: something that will actively break the trip if not fixed. This includes: a night with
  no stay covering it; a day whose destination differs from the previous day's with no travel item
  accounting for that move; an arrival travel item (e.g. a flight) with no follow-up travel item to
  the first stay; a departing travel item with no travel item getting the user there; overlapping
  bookings.
- warning: something risky but not certain to fail (e.g. a very short connection window, a day with
  an unusually large number of activities or that jumps between distant locations, a lodging gap
  that might be intentional, an important stay or major travel item still marked \`idea\` or
  \`planned\` close to the trip).
- suggestion: a minor polish item (e.g. a day with nothing planned, no notes on a booking).

You may use general travel/geographic knowledge (typical distances, transit times, whether a
connection is realistic) to inform your assessment, and may use web search to verify specific facts
you're not confident about. When you do, don't invent precise prices or claim live availability —
phrase anything uncertain as something to verify (e.g. "verify opening hours before going") rather
than as fact. Do not invent details about the itinerary itself — bookings, times, or locations not
present in the data. If the itinerary looks solid, return few or no items rather than inventing
problems.

Keep the audit focused: aim for 3-8 items, and never return more than 12. If there are several
small, similar issues (e.g. multiple bookings missing confirmation notes), group them into one item
rather than listing each separately. Only split out issues that are important and date-specific.

Write in ito's voice: calm, concise, direct, not alarmist. Prefer "This day may be tight" over
"Warning: this day is overloaded!" and "Add a travel item so the route is accounted for" over
"You absolutely must add transportation immediately."

Also write:
- summary: a 2-3 sentence plain-English read of the trip's overall readiness.
- readiness_score: an integer 0-100 reflecting how ready the trip is to go, weighted mostly by
  critical and warning items. Roughly: 90-100 very complete, 75-89 mostly complete with a few things
  to check, 50-74 several important gaps, 25-49 major planning gaps, 0-24 too incomplete to rely on.
  Don't over-penalize for missing notes, missing confirmation numbers, or open-ended free time.
`.trim();

const AuditResult = z.object({
    summary: z.string(),
    readiness_score: z.int(),
    items: z.array(
        z.object({
            severity: z.enum(["critical", "warning", "suggestion"]),
            title: z.string(),
            description: z.string(),
            related_date: z.string().nullable(),
        })
    ),
});

function summarizeItem(item: ItineraryItem) {
    const base = { type: item.type, name: item.name, status: item.status, notes: item.notes };
    switch (item.type) {
        case "stay":
            return { ...base, location: item.location, checkInDate: item.check_in_date, checkInTime: item.check_in_time, checkOutDate: item.check_out_date, checkOutTime: item.check_out_time };
        case "travel":
            return { ...base, from: item.from, to: item.to, startTime: item.start_time, endTime: item.end_time, transportation: item.transportation };
        case "activity":
        case "food & drink":
            return { ...base, location: item.location, time: item.time };
        default:
            return base;
    }
}

export async function generateAudit(tripId: number) {

    const openAIclient = new OpenAI();
    const supabase = await createClient();

    const tripResponse = await supabase.from("trips").select("*").eq("id", tripId).single();
    if (tripResponse.error) {
        console.error("Error fetching trip:", tripResponse.error.message, tripResponse.error.details, tripResponse.error.hint);
        return;
    }
    const trip = tripResponse.data;

    const daysResponse = await supabase.from("itinerary_days").select("*").eq("trip_id", tripId).order("date", { ascending: true});
    if (daysResponse.error) {
        console.error("Error fetching itinerary days:", daysResponse.error.message, daysResponse.error.details, daysResponse.error.hint);
        return;
    }
    const days = daysResponse.data;

    const dayIds = days!.map((day) => day.id);
    const itemsResponse = await supabase.from("itinerary_items").select("*").in("day_id", dayIds)
    if (itemsResponse.error) {
        console.error("Error fetching itinerary items:", itemsResponse.error.message, itemsResponse.error.details, itemsResponse.error.hint);
        return;
    }
    const items = itemsResponse.data ?? [];

    const payload = {
        name: trip.name,
        startDate: trip.start_date,
        endDate: trip.end_date,
        destinations: trip.destinations,
        days: days!.map((day) => ({
            date: day.date,
            destination: day.destination,
            items: items.filter((item) => item.day_id === day.id).map(summarizeItem),
        })),
    };

    let response;
    try {
        response = await openAIclient.responses.parse({
            model: "gpt-5.6-terra",
            instructions: AuditInstruction,
            input: JSON.stringify(payload),
            text: {
                format: zodTextFormat(AuditResult, "audit")
            }
        })
    } catch (error) {
        console.error("OpenAI request failed:", error);
        return;
    }   

    const audit = response.output_parsed;
    if (!audit) {
        console.error("Audit generation failed");
        return;
    }

    const auditInsertResponse = await supabase.from("audits").insert({
        trip_id: tripId,
        summary: audit.summary,
        readiness_score: audit.readiness_score
    }).select().single();
    if (auditInsertResponse.error || !auditInsertResponse.data) {
        console.error("Error inserting audit:", auditInsertResponse.error);
        return;
    }

    const auditId = auditInsertResponse.data.id;
    const auditItemInserts = audit.items.map((item => ({
        audit_id: auditId,
        severity: item.severity,
        title: item.title,
        description: item.description,
        related_date: item.related_date,
    })));

    const auditItemInsertResponse = await supabase.from("audit_items").insert(auditItemInserts)
    if (auditItemInsertResponse.error) {
        console.error("Error inserting audit item:", auditItemInsertResponse.error);
        return;
    }
}