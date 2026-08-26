"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

const MESSAGES = [
    "waddling through your itinerary, day by day",
    "connecting the dots between your flights",
    "huddling up to make sure every night's got a bed",
    "pecking around for gaps in your plans",
    "shuffling through your timing one more time",
    "diving into the miles between your stops",
    "keeping a beady eye out for anything missed",
    "figuring out your readiness score",
];

export default function AuditLoading() {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((current) => (current + 1) % MESSAGES.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8">
            <LoaderCircle className="size-12 animate-spin text-muted-foreground" />
            <p className="text-lg text-foreground/70">{MESSAGES[messageIndex]}</p>
        </div>
    );
}