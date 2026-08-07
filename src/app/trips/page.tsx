import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { NewTripDrawer } from "@/components/new-trip-drawer";
import { TripCardMenu } from "@/components/trip-card-menu";
import Link from "next/link";
import { parseISO } from "date-fns";

function formatDateRange(startDate: string, endDate: string) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${startLabel} – ${endLabel}`;
}

function formatUpdated(updatedDate: string) {
  const updated = new Date(updatedDate);
  const now = new Date();

  const updatedDay = new Date(updated.getFullYear(), updated.getMonth(), updated.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((today.getTime() - updatedDay.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Updated today";
  if (diffDays === 1) return "Updated yesterday";
  if (diffDays <= 3) return `Updated ${diffDays} days ago`;
  return `Updated ${updated.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export default async function Trips() {

  const supabase = await createClient();
  const tripsResponse = await supabase.from("trips").select("*");
  const trips = tripsResponse.data;


  return (
    <div className="flex flex-1 flex-col items-center gap-4 px-6 py-8">
      <div className="flex flex-row justify-between w-full max-w-lg">
        <h1 className="text-2xl font-bold">Your trips</h1>
        <NewTripDrawer />
      </div>
      {trips?.map((trip) => (
        <Card key={trip.id} className="w-full max-w-lg gap-4">
          <CardContent className="flex flex-col gap-1">
            <CardTitle className="text-lg font-bold">
                <div className="flex flex-row justify-between items-center">
                  <Link href={`/trips/${trip.id}`} className="hover:underline">
                    {trip.name}
                  </Link>
                  <TripCardMenu tripId={String(trip.id)} tripName={trip.name} />
                </div>
            </CardTitle>
            <p className="text-sm text-foreground/70">{formatDateRange(trip.start_date, trip.end_date)}</p>
            <p className="text-sm text-foreground/70">{trip.destinations.join(" • ")}</p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">{formatUpdated(trip.updated_at)}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
