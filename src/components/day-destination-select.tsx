"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select";

export function DayDestinationSelect({ 
    dayId, 
    initialDestination, 
    destinationOptions 
}: { 
    dayId: number; 
    initialDestination: string | null; 
    destinationOptions: { label: string; value: string | null }[] 
}) {
    const [destination, setDestination] = useState(initialDestination);
    const supabase = createClient();
    const router = useRouter();

    async function handleDestinationChange(value: string | null) {
        setDestination(value);
        const response = await supabase.from("itinerary_days").update({ destination: value}).eq("id", dayId);
        if (response.error) {
            console.error("Failed to update destination:", response.error.message);
        }
        router.refresh();
    }   

    return (
        <Select items={destinationOptions} value={destination} onValueChange={handleDestinationChange}>
            <SelectTrigger className="-ml-1 w-fit max-w-40" size="sm">
                <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                  <SelectLabel>Destination</SelectLabel>
                  {destinationOptions.map((destination) => (
                    <SelectItem key={destination.value} value={destination.value}>
                        {destination.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
            </SelectContent>
        </Select>        
    )
}