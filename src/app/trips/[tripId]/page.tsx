import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function TripDetail({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const supabase = await createClient();
  const tripResponse = await supabase.from("trips").select("*").eq("id", tripId).single();
  const trip = tripResponse.data;

  if (!trip) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-4 px-6 py-8">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold">{trip.name}</h1>
        <p className="text-sm text-foreground/70">{trip.destinations.join(" • ")}</p>
      </div>
    </div>
  );
}