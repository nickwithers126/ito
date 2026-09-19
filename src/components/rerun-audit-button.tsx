"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, LoaderCircle } from "lucide-react"
import { rerunAudit } from "@/lib/rerun-audit"

export function RerunAuditButton({ tripId }: { tripId: number }){
    const router = useRouter();
    const [isRerunning, setIsRerunning] = useState(false);

    async function handleRerun() {
        setIsRerunning(true);
        try {
            await rerunAudit(tripId);
        } catch (error) {
            console.error("Failed to rerun audit:", error);
        } finally {
            setIsRerunning(false);
        }
        router.refresh();
    }

    return (
        <Button variant="outline" className="hover:cursor-pointer" onClick={handleRerun} disabled={isRerunning}>
            {isRerunning ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {isRerunning ? "Rerunning" : "Rerun audit"}
        </Button>
    )
}