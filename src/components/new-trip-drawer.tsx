"use client"

import * as React from "react"
import { format } from "date-fns"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function NewTripDrawer() {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const [tripName, setTripName] = React.useState("")
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()
  const [destination, setDestination] = React.useState("")
  const [destinations, setDestinations] = React.useState<string[]>([])
  const [startDateOpen, setStartDateOpen] = React.useState(false)
  const [endDateOpen, setEndDateOpen] = React.useState(false)
  const supabase = createClient()
  const router = useRouter()
  const isFormValid = 
    tripName.trim() !== "" && 
    startDate !== undefined && 
    endDate !== undefined && 
    startDate <= endDate &&
    destinations.length > 0
  
    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);
        if (!nextOpen) {
            setStartDate(undefined);
            setEndDate(undefined);
            setTripName("");
            setDestination("");
            setDestinations([]);
        }
    }

    function handleSelectStartDate(date: Date | undefined) {
        setStartDate(date);
        setStartDateOpen(false);
    }

    function handleSelectEndDate(date: Date | undefined) {
        setEndDate(date);
        setEndDateOpen(false);
    }

    function handleAddDestination() {
        const trimmed = destination.trim();
        if (trimmed && !destinations.includes(trimmed)) {
            setDestinations([...destinations, trimmed]);
        }
        setDestination("");
    }

    function handleRemoveDestination(destinationToRemove: string) {
        setDestinations(destinations.filter((d) => d !== destinationToRemove));
    }

    function handleDestinationKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddDestination();
        }
    }

    async function handleCreateTrip() {
        await supabase.from("trips").insert({
            name: tripName,
            start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
            end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
            destinations: destinations,
        });

        handleOpenChange(false);
        router.refresh();
    }

  return (
    <Drawer 
        open={open}
        onOpenChange={handleOpenChange}
        showSwipeHandle={isMobile} 
        swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger className="px-6" render={<Button className="hover:cursor-pointer"/>}>
        <Plus className="size-4" strokeWidth={2.5}/>
        New trip
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a new trip</DrawerTitle>
          <DrawerDescription>Enter the basics. You can add the full itinerary later.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 p-4">
          <Field>
            <FieldLabel htmlFor="input-trip-name">Trip name</FieldLabel>
            <Input 
                id="input-trip-name" 
                type="text" 
                placeholder="Enter trip name"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)} 
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-start-date">Start date</FieldLabel>
            <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
              <PopoverTrigger
                render={
                  <Button variant="outline" id="input-start-date" className="justify-start font-normal hover:cursor-pointer">
                    {startDate ? format(startDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleSelectStartDate}
                  defaultMonth={startDate}
                />
              </PopoverContent>
            </Popover>
          </Field>
          <Field>
            <FieldLabel htmlFor="input-end-date">End date</FieldLabel>
            <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
              <PopoverTrigger
                render={
                  <Button variant="outline" id="input-end-date" className="justify-start font-normal hover:cursor-pointer">
                    {endDate ? format(endDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleSelectEndDate}
                  defaultMonth={endDate}
                />
              </PopoverContent>
            </Popover>
          </Field>
          <Field>
            <FieldLabel htmlFor="input-destinations">Primary destinations</FieldLabel>
            <Input
              id="input-destinations"
              type="text"
              placeholder="Enter a destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={handleDestinationKeyDown}
            />
            <div className="flex w-full flex-wrap justify-left gap-2">
                {destinations.map((d) => (
                    <Badge key={d} variant="outline" className="gap-1 pl-2 pr-1">
                        {d}
                        <button
                          type="button"
                          onClick={() => handleRemoveDestination(d)}
                          aria-label={`Remove ${d}`}
                          className="flex items-center justify-center rounded-full"
                        >
                          <X className="size-3" />
                        </button>
                    </Badge>
                ))}
            </div>

          </Field>
        </div>
        <DrawerFooter>
          <Button className="hover:cursor-pointer" onClick={handleCreateTrip} disabled={!isFormValid}>
            Create trip
          </Button>
          <DrawerClose render={<Button className="hover:cursor-pointer" variant="outline" />}>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
