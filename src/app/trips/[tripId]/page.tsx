import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Play } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { Separator } from "@/components/ui/separator";

function formatDayLabel(date: string) {
  return new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function formatTripSummary(startDate: string, endDate: string, destinations: string[]) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const dayCount = differenceInCalendarDays(end, start) + 1;
  return `${startLabel} – ${endLabel} • ${dayCount} days • ${destinations.join(", ")}`;
}

export default async function TripDetail({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const supabase = await createClient();
  const tripResponse = await supabase.from("trips").select("*").eq("id", tripId).single();
  const trip = tripResponse.data;

  if (!trip) {
    notFound();
  }

  const days = [
    { id: "1", date: "2026-11-10", destination: "Tokyo" },
    { id: "2", date: "2026-11-11", destination: "Tokyo" },
    { id: "3", date: "2026-11-12", destination: "Kyoto" },
  ];

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
            <Plus className="size-4" />
            Add item
          </Button>
          <Button variant="outline">
            <Play className="size-4" />
            Run audit
          </Button>
        </div>
      </div>
      {days.map((day, index) => (
        <Card key={day.id} className="w-full max-w-2xl gap-3">
          <CardContent className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-lg font-bold">Day {index + 1}</CardTitle>
                <p className="text-sm text-foreground/70">{formatDayLabel(day.date)}</p>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="size-4" />
                Add item
              </Button>
            </div>
            <p className="text-sm text-foreground/70">{day.destination}</p>
          </CardContent>
          <Separator />
          <CardContent>
            {/* Items for this day will render here */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}