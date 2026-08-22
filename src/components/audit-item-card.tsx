"use client";

import type { Database } from "@/lib/supabase/database.types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleAlert, TriangleAlert, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type AuditItem = Database["public"]["Tables"]["audit_items"]["Row"];

function getSeverityIcon(severity: string) {
    if (severity == "critical") {
        return (
            <div className="flex flex-row gap-2 text-red-600 items-center">
                <CircleAlert className="size-5"/>
                Critical
            </div>
        )
    } else if (severity == "warning") {
        return (
            <div className="flex flex-row gap-2 text-yellow-600 items-center">
                <TriangleAlert className="size-5"/>
                Warning
            </div>
    )
    } else {
        return (
            <div className="flex flex-row gap-2 text-blue-600 items-center">
                <Info className="size-5"/>
                Suggestion
            </div>
        )
    }
}

export function AuditItemCard({ item }: {item: AuditItem}) {

    const supabase = createClient();
    const router = useRouter();

    async function changeAuditItemStatus(itemId: number, newStatus: string) {
        const statusResponse = await supabase.from("audit_items").update({status: newStatus}).eq("id", itemId)
        if (statusResponse.error) {
            console.error("Failed to update status if itinerary item", statusResponse.error);
            return
        }
        router.refresh();
    }

    return (
        <div className="flex flex-col w-full max-w-2xl gap-2">
            {getSeverityIcon(item.severity)}
            <Card>
                <CardContent className="flex flex-col gap-1">
                    <CardTitle className="text-lg font-bold">
                        {item.title}
                    </CardTitle>
                    <p className="text-sm text-foreground/70">
                        {item.description}
                    </p>
                    {item.related_date && (
                        <p className="text-xs text-foreground/50">
                            Related: {item.related_date}
                        </p>
                    )}
                    <div className="flex flex-row gap-3 justify-end">
                        <Button variant="outline" className="hover:cursor-pointer" onClick={() => changeAuditItemStatus(item.id, "handled")}>Mark handled</Button>
                        <Button variant="outline" className="hover:cursor-pointer" onClick={() => changeAuditItemStatus(item.id, "dismissed")}>Dismiss</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}