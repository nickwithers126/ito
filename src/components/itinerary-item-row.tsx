import type { Database } from "@/lib/supabase/database.types";
import { Plane, Utensils, Bed, Compass } from "lucide-react";

type ItineraryItem = Database["public"]["Tables"]["itinerary_items"]["Row"];

function formatTime(time: string | null) {
    return time?.slice(0, 5) ?? "";
}

function getStatusColor(status: string) {
    if (status === "booked") {
        return "text-green-600"
    } else if (status === "planned") {
        return "text-blue-600"
    } else if (status === "idea") {
        return "text-muted-foreground";
    }
}

export function ItineraryItemRow({ item }: { item: ItineraryItem }) {
  switch (item.type) {
    case "food & drink":
      return (
        <div className="grid w-full grid-cols-[3.5rem_1.25rem_1fr_4rem] items-center gap-3 py-1">
          <p className="text-sm text-foreground/70">{formatTime(item.time)}</p>
          <Utensils className="size-5" />
          <div className="flex flex-col gap-0.5 ml-4">
            <p className="text-xs text-muted-foreground">Food & drink</p>
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-sm text-foreground/70">{item.location}</p>
          </div>
          <p className={`text-sm text-right font-semibold ${getStatusColor(item.status)}`}>{item.status}</p>
        </div>
      )
    case "activity":
      return (
        <div className="grid w-full grid-cols-[3.5rem_1.25rem_1fr_4rem] items-center gap-3 py-1">
          <p className="text-sm text-foreground/70">{formatTime(item.time)}</p>
          <Compass className="size-5" />
          <div className="flex flex-col gap-0.5 ml-4">
            <p className="text-xs text-muted-foreground">Activity</p>
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-sm text-foreground/70">{item.location}</p>
          </div>
          <p className={`text-sm text-right font-semibold ${getStatusColor(item.status)}`}>{item.status}</p>
        </div>
      )
    case "stay":
      return (
        <div className="grid w-full grid-cols-[3.5rem_1.25rem_1fr_4rem] items-center gap-3 py-1">
          <p className="text-sm text-foreground/70">{formatTime(item.check_in_time)}</p>
          <Bed className="size-5" />
          <div className="flex flex-col gap-0.5 ml-4">
            <p className="text-xs text-muted-foreground">Stay</p>
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-sm text-foreground/70">{item.location}</p>
          </div>
          <p className={`text-sm text-right font-semibold ${getStatusColor(item.status)}`}>{item.status}</p>
        </div>
      )
    case "travel":
      return (
        <div className="grid w-full grid-cols-[3.5rem_1.25rem_1fr_4rem] items-center gap-3 py-1">
          <p className="text-sm text-foreground/70">{formatTime(item.start_time)}</p>
          <Plane className="size-5" />
          <div className="flex flex-col gap-0.5 ml-4">
            <p className="text-xs text-muted-foreground">Travel</p>
            <p className="text-sm font-medium">{item.name}</p>
            <p className="text-sm text-foreground/70">{item.from} → {item.to}</p>
          </div>
          <p className={`text-sm text-right font-semibold ${getStatusColor(item.status)}`}>{item.status}</p>
        </div>
      )
    default:
      return null;
  }
}