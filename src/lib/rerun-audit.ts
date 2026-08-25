"use server"

import { createClient } from "@/lib/supabase/server"
import { generateAudit } from "./generate-audit"

export async function rerunAudit(tripId: number) {
    const supabase = await createClient();
    const response = await supabase.from("audits").delete().eq("trip_id", tripId);
    if (response.error) {
        console.error("Failed to delete audit:", response.error.message);
    }
    await generateAudit(tripId);
}