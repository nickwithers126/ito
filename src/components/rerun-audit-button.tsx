"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { rerunAudit } from "@/lib/rerun-audit"

export function RerunAuditButton({ tripId }: { tripId: number }){
    const router = useRouter();
    const [isRerunning, setIsRerunning] = useState(false);

    async function handleRerun() {
        setIsRerunning(true);
        await rerunAudit(tripId);
        setIsRerunning(false);
        router.refresh();
    }

    return (
        <Button variant="outline" className="hover:cursor-pointer" onClick={handleRerun} disabled={isRerunning}>
            <Sparkles className="size-4" />
            {isRerunning ? "Rerunning..." : "Rerun audit"}
        </Button>
    )
}