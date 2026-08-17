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

export function ItineraryItemRowMenu({ itemId, itemName } : { itemId: number; itemName: string }) {
    const router = useRouter();
    const supabase = createClient();

    async function handleDeleteItineraryItem()  {
        await supabase.from("itinerary_items").delete().eq("id", itemId)
        router.refresh();
    }

    return (
        <Popover>
            <PopoverTrigger render={<button type="button" className="hover:cursor-pointer" aria-label={`Options for ${itemName}`}><Ellipsis /></button>} />
            <PopoverContent align="end" className="w-auto p-3">
                <AlertDialog>
                    <AlertDialogTrigger render={
                        <Button type="button" className="hover:cursor-pointer" variant="destructive" aria-label={`Delete ${itemName}`}>
                            Delete item
                        </Button>} />
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete &quot;{itemName}&quot;?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this item from your itinerary.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel type="button" className="hover:cursor-pointer">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              type="button"
                              className="hover:cursor-pointer"
                              aria-label={`Confirm delete ${itemName}`}
                              onClick={handleDeleteItineraryItem}
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