import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export default async function Audit({ params }: { params: Promise<{ tripId: string }> }) {
    const { tripId } = await params;

    const supabase = await createClient();

    const auditResponse = await supabase.from("audits").select("*").eq("trip_id", Number(tripId)).maybeSingle();
    if (auditResponse.error) {
        console.error("Error fetching audit:", auditResponse.error.message, auditResponse.error.details, auditResponse.error.hint);
    }
    const audit = auditResponse.data;

    let auditItems: Database["public"]["Tables"]["audit_items"]["Row"][] = [];
    if (audit) {
        const auditItemsResponse = await supabase.from("audit_items").select("*").eq("audit_id", audit.id);
        if (auditItemsResponse.error) {
            console.error("Error fetching audit items:", auditItemsResponse.error.message, auditItemsResponse.error.details, auditItemsResponse.error.hint);
        }
        auditItems = auditItemsResponse.data ?? [];
    }

    return (
        <div>
            <h1>Audit</h1>
            <p>Summary: {audit?.summary}</p>
            <p>Readiness: {audit?.readiness_score}</p>
        </div>
    )
}