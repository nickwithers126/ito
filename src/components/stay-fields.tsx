"use client";

import * as React from "react"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectTrigger,
    SelectItem,
    SelectValue
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type StayData = {
  name: string;
  location: string;
  status: "booked" | "planned" | "idea" | null;
  checkInDate: Date | undefined;
  checkInTime: string;
  checkOutDate: Date | undefined;
  checkOutTime: string;
  notes: string;
};

export function StayFields({ data, onChange }: { data: StayData; onChange: (data: StayData) => void }) {
  const [checkInDateOpen, setCheckInDateOpen] = React.useState(false)
  const [checkOutDateOpen, setCheckOutDateOpen] = React.useState(false)
  const statusOptions = [
    { label: "Booked", value: "booked" },
    { label: "Planned", value: "planned" },
    { label: "Idea", value: "idea" }
  ]

  function handleStatusChange(value: "booked" | "planned" | "idea" | null) {
    onChange({ ...data, status: value ?? null });
  }

  function handleSelectCheckInDate(date: Date | undefined) {
    onChange({ ...data, checkInDate: date });
    setCheckInDateOpen(false);
  }

  function handleSelectCheckOutDate(date: Date | undefined) {
    onChange({ ...data, checkOutDate: date });
    setCheckOutDateOpen(false);
  }

    return (
        <div className="flex flex-col gap-4 p-4">
            <Field>
                <FieldLabel htmlFor="input-stay-name">Name</FieldLabel>
                <Input
                    id="input-stay-name"
                    type="text"
                    placeholder="e.g. Hotel in Kyoto"
                    value={data.name}
                    onChange={(e) => onChange({ ...data, name: e.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="input-stay-location">Location</FieldLabel>
                <Input
                    id="input-stay-location"
                    type="text"
                    placeholder="e.g. Gion, near the station"
                    value={data.location}
                    onChange={(e) => onChange({ ...data, location: e.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="input-check-in-date">Check-in date</FieldLabel>
                <Popover open={checkInDateOpen} onOpenChange={setCheckInDateOpen}>
                <PopoverTrigger
                    render={
                    <Button variant="outline" id="input-check-in-date" className="justify-start font-normal hover:cursor-pointer">
                        {data.checkInDate ? format(data.checkInDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                    </Button>
                    }
                />
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    mode="single"
                    selected={data.checkInDate}
                    onSelect={handleSelectCheckInDate}
                    defaultMonth={data.checkInDate}
                    />
                </PopoverContent>
                </Popover>
            </Field>
            <Field>
                <FieldLabel htmlFor="input-check-in-time">Check-in time</FieldLabel>
                <Input
                    id="input-check-in-time"
                    type="time"
                    value={data.checkInTime}
                    onChange={(e) => onChange({ ...data, checkInTime: e.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="input-check-out-date">Check-out date</FieldLabel>
                <Popover open={checkOutDateOpen} onOpenChange={setCheckOutDateOpen}>
                <PopoverTrigger
                    render={
                    <Button variant="outline" id="input-check-out-date" className="justify-start font-normal hover:cursor-pointer">
                        {data.checkOutDate ? format(data.checkOutDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                    </Button>
                    }
                />
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    mode="single"
                    selected={data.checkOutDate}
                    onSelect={handleSelectCheckOutDate}
                    defaultMonth={data.checkOutDate}
                    />
                </PopoverContent>
                </Popover>
            </Field>
            <Field>
                <FieldLabel htmlFor="input-check-out-time">Check-out time</FieldLabel>
                <Input
                    id="input-check-out-time"
                    type="time"
                    value={data.checkOutTime}
                    onChange={(e) => onChange({ ...data, checkOutTime: e.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="stay-notes">Notes</FieldLabel>
                <Textarea
                    id="stay-notes"
                    placeholder="e.g. confirmation number, late check-out arranged"
                    value={data.notes}
                    onChange={(e) => onChange({ ...data, notes: e.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="input-status">Status</FieldLabel>
                    <Select value={data.status} onValueChange={handleStatusChange} items={statusOptions}>
                        <SelectTrigger className="w-fit max-w-40" size="sm">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            {statusOptions.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
            </Field>
        </div>
    )
}