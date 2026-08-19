import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ClipboardCheck } from "lucide-react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { DayDestinationSelect } from "@/components/day-destination-select";
import { AddItemDrawer } from "@/components/add-item-drawer";
import { ItineraryItemRow } from "@/components/itinerary-item-row";
import Link from "next/link"

function formatDayLabel(date: string) {
  return parseISO(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function formatTripSummary(startDate: string, endDate: string, destinations: string[]) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const dayCount = differenceInCalendarDays(end, start) + 1;
  return `${startLabel} – ${endLabel} • ${dayCount} days • ${destinations.join(", ")}`;
}

function getSortTime(item: { type: string; time: string | null; check_in_time: string | null; start_time: string | null }) {
  switch (item.type) {
    case "food & drink":
      return item.time ?? "00:00"
    case "activity":
      return item.time ?? "00:00"
    case "stay":
      return item.check_in_time ?? "00:00"
    case "travel":
      return item.start_time ?? "00:00"
    default:
      return "00:00"
  }
}

export default async function TripDetail({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;

  const supabase = await createClient();
  const tripResponse = await supabase.from("trips").select("*").eq("id", Number(tripId)).single();
  const trip = tripResponse.data;
  if (!trip) {
    notFound();
  }

  const daysResponse = await supabase
    .from("itinerary_days")
    .select("*")
    .eq("trip_id", trip.id)
    .order("date", { ascending: true});
  const days = daysResponse.data; 

  const dayIds = days!.map((day) => day.id);
  const itemsResponse = await supabase.from("itinerary_items").select("*").in("day_id", dayIds)
  if (itemsResponse.error) {
    console.error("Error fetching items:", itemsResponse.error.message, itemsResponse.error.details, itemsResponse.error.hint);
  }
  const itineraryItems = itemsResponse.data ?? [];

  const destinationOptions: { label: string; value: string | null }[] = trip.destinations.map((destination: string) => ({
    label: destination,
    value: destination,
  }));
  destinationOptions.push({ label: "Destination", value: null });

  const auditResponse = await supabase.from("audits").select("*").eq("trip_id", Number(tripId)).maybeSingle();
  if (auditResponse.error) {
    console.error("Error fetching audit:", auditResponse.error.message, auditResponse.error.details, auditResponse.error.hint);
  }
  const hasAudit = auditResponse.data != null;

  return (
    <div className="flex flex-1 flex-col items-center gap-4 px-6 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{trip.name}</h1>
          <p className="text-sm text-foreground/70">
            {formatTripSummary(trip.start_date, trip.end_date, trip.destinations)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" nativeButton={false} render={<Link href={`/trips/${trip.id}/audit`} />}>
            {hasAudit ? <ClipboardCheck className="size-4" /> : <Sparkles className="size-4" />}
            {hasAudit ? "View audit" : "Run audit"}
          </Button>
        </div>
      </div>
      {days!.map((day, index) => {

        const dayItems = itineraryItems
          .filter((item) => item.day_id === day.id)
          .sort((a, b) => getSortTime(a).localeCompare(getSortTime(b)));
      
        return (
          <Card key={day.id} className="w-full max-w-2xl gap-5">
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  <CardTitle className="text-lg font-bold">Day {index + 1}</CardTitle>
                  <p className="text-sm text-foreground/70">{formatDayLabel(day.date)}</p>
                </div>
                <AddItemDrawer tripStartDate={trip.start_date} tripEndDate={trip.end_date} days={days!} dayId={day.id}/>
              </div>
              <DayDestinationSelect 
                dayId={day.id} 
                initialDestination={day.destination} 
                destinationOptions={destinationOptions} />
            </CardContent>
            <CardContent className="flex flex-col gap-5">
              {dayItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-5 text-sm">
                  <Separator />
                  <ItineraryItemRow item={item} />
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })} 
    </div>
  );
}