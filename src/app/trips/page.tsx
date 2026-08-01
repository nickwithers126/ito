import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
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

export default function Trips() {

  const trips = [
    { id: "1", name: "Japan / Korea", destinations: ["Tokyo", "Kyoto", "Seoul"], startDate: "2026-11-10", endDate: "2026-11-21", updatedDate: "2026-08-01" },
    { id: "2", name: "London / Ireland", destinations: ["London", "Dublin", "Galway"], startDate: "2027-07-04", endDate: "2027-07-12", updatedDate: "2026-07-29" },
  ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
      {trips.map((trip) => (
        <Card key={trip.id} className="w-full max-w-lg gap-4">
          <CardContent className="flex flex-col gap-1">
            <CardTitle className="text-lg font-bold">{trip.name}</CardTitle>
            <p className="text-sm text-foreground/70">{formatDateRange(trip.startDate, trip.endDate)}</p>
            <p className="text-sm text-foreground/70">{trip.destinations.join(" • ")}</p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">{formatUpdated(trip.updatedDate)}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
