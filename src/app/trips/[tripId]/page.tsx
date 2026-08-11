import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { DayDestinationSelect } from "@/components/day-destination-select";
import { AddItemDrawer } from "@/components/add-item-drawer";

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

  const destinationOptions: { label: string; value: string | null }[] = trip.destinations.map((destination: string) => ({
    label: destination,
    value: destination,
  }));
  destinationOptions.push({ label: "Destination", value: null });

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
          <Button variant="outline">
            <Sparkles className="size-4" />
            Run audit
          </Button>
        </div>
      </div>
      {days!.map((day, index) => (
        <Card key={day.id} className="w-full max-w-2xl gap-3">
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
          {/* <Separator /> */}
          {/* <CardContent> */}
            {/* Items for this day will render here */}
          {/* </CardContent> */}
        </Card>
      ))}
    </div>
  );
}