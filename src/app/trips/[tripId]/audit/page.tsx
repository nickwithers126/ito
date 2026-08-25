import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { generateAudit } from "@/lib/generate-audit";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AuditItemCard } from "@/components/audit-item-card";
import { RerunAuditButton } from "@/components/rerun-audit-button";

export const dynamic = "force-dynamic";

function getReadinessColor(readiness_score: number) {
    if (readiness_score >= 90) {
        return "text-green-600"
    } else if (readiness_score >= 75) {
        return "text-yellow-600"
    } else {
        return "text-red-600";
    }
}

export default async function Audit({ params }: { params: Promise<{ tripId: string }> }) {
    const { tripId } = await params;

    const supabase = await createClient();

    const auditResponse = await supabase.from("audits").select("*").eq("trip_id", Number(tripId)).maybeSingle();
    if (auditResponse.error) {
        console.error("Error fetching audit:", auditResponse.error.message, auditResponse.error.details, auditResponse.error.hint);
    }
    let audit = auditResponse.data;
    let auditItems: Database["public"]["Tables"]["audit_items"]["Row"][] = [];


    if (audit == null) {
        const newlyGeneratedAudit = await generateAudit(Number(tripId));
        audit = newlyGeneratedAudit?.audit ?? null;
        auditItems = newlyGeneratedAudit?.items?? [];
    } else {
        const auditItemsResponse = await supabase.from("audit_items").select("*").eq("audit_id", audit.id).eq("status", "open");
        if (auditItemsResponse.error) {
            console.error("Error fetching audit items:", auditItemsResponse.error.message, auditItemsResponse.error.details, auditItemsResponse.error.hint);
        }
        auditItems = auditItemsResponse.data ?? [];
    }

    const auditItemCount = auditItems.length;
    const criticalCount = auditItems.filter((item) => item.severity == "critical").length;
    const warningCount = auditItems.filter((item) => item.severity == "warning").length;
    const suggestionCount = auditItems.filter((item) => item.severity == "suggestion").length;

    return (
        <div className="flex flex-1 flex-col items-center gap-8 px-6 py-8">
            <div className="flex flex-row justify-between w-full max-w-2xl">
                <h1 className="text-2xl font-bold">ito found {auditItemCount} items to check.</h1>
                <RerunAuditButton tripId={Number(tripId)}/>
            </div>
            <div className="flex w-full max-w-2xl flex-row gap-4">
                <Card className="flex-1 gap-4">
                    <CardContent className="flex flex-col gap-1 items-center">
                        <CardTitle className="text-sm font-bold">
                            Readiness
                        </CardTitle>
                        <p className={`text-3xl ${getReadinessColor(audit?.readiness_score ?? 0)}`}>
                            {audit?.readiness_score}%
                       </p>
                    </CardContent>
                </Card>
                <Card className="flex-1 gap-4">
                    <CardContent className="flex flex-col gap-1 items-center">
                        <CardTitle className="text-sm font-bold">
                            Critical
                        </CardTitle>
                        <p className="text-3xl text-red-600">
                            {criticalCount}
                       </p>
                    </CardContent>
                </Card>
                <Card className="flex-1 gap-4">
                    <CardContent className="flex flex-col gap-1 items-center">
                        <CardTitle className="text-sm font-bold">
                            Warnings
                        </CardTitle>
                        <p className="text-3xl text-yellow-600">
                            {warningCount}
                       </p>
                    </CardContent>
                </Card>
                <Card className="flex-1 gap-4">
                    <CardContent className="flex flex-col gap-1 items-center">
                        <CardTitle className="text-sm font-bold">
                            Suggestions
                        </CardTitle>
                        <p className="text-3xl text-blue-600">
                            {suggestionCount}
                       </p>
                    </CardContent>
                </Card>
            </div>
            <div className="w-full max-w-2xl">
                <h2 className="text-lg font-bold">ito&apos;s read</h2>
                <p className="text-sm text-foreground/70">
                    {audit?.summary}
                </p>
            </div>
            {auditItems.map(item => (
                <AuditItemCard key={item.id} item={item} />
            ))}
        </div>
    )
}