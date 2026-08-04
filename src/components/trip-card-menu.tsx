"use client"

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Ellipsis } from "lucide-react";

export function TripCardMenu({ tripId, tripName } : { tripId: string; tripName: string }) {
    const router = useRouter();
    const supabase = createClient();

    async function handleDeleteTrip()  {
        await supabase.from("trips").delete().eq("id", tripId)
        router.refresh();
    }

    return (
        <Popover>
            <PopoverTrigger render={<button type="button" className="hover:cursor-pointer" aria-label={`Options for ${tripName}`}><Ellipsis /></button>} />
            <PopoverContent align="end" className="w-auto p-3">
                <AlertDialog>
                    <AlertDialogTrigger render={
                        <Button type="button" className="hover:cursor-pointer" variant="destructive" aria-label={`Delete ${tripName}`}>
                            Delete trip
                        </Button>} />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete &quot;{tripName}&quot;?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the trip and all associated data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button" className="hover:cursor-pointer">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              type="button"
                              className="hover:cursor-pointer"
                              aria-label={`Confirm delete ${tripName}`}
                              onClick={handleDeleteTrip}
                            >
                              Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </PopoverContent>
        </Popover>
    )
}