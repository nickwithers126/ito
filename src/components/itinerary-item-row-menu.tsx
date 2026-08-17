"use client"

import { useState } from "react";
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
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";


export function ItineraryItemRowMenu({ itemId, itemName, status, notes } : { itemId: number; itemName: string; status: string; notes: string | null }) {
    const router = useRouter();
    const supabase = createClient();
    const statusOptions = ["booked", "planned", "idea"].filter((s) => s !== status);
    const [open, setOpen] = useState(false);

    async function handleDeleteItineraryItem()  {
        const response = await supabase.from("itinerary_items").delete().eq("id", itemId);
        if (response.error) {
            console.error("Failed to delete item:", response.error.message);
        }
        router.refresh();
    }

    async function handleChangeStatus(newStatus: string) {
        setOpen(false);
        const response = await supabase.from("itinerary_items").update({ status: newStatus }).eq("id", itemId);
        if (response.error) {
            console.error("Failed to update status:", response.error.message);
        }
        router.refresh();
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger render={<button type="button" className="hover:cursor-pointer" aria-label={`Options for ${itemName}`}><Ellipsis /></button>} />
            <PopoverContent align="end" className="w-auto p-3 gap-2">
                {statusOptions.map((option) => (
                    <Button key={option} type="button" variant="outline" onClick={() => handleChangeStatus(option)}>
                        Mark as {option}
                    </Button>
                ))}
                {notes && (
                    <Dialog>
                        <DialogTrigger render={<Button type="button" variant="outline">View notes</Button>} />
                        <DialogContent>
                            <p className="text-sm text-foreground/70">{notes}</p>
                        </DialogContent>
                    </Dialog>
                )}
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