"use client"

import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectTrigger,
    SelectItem,
    SelectValue
} from "@/components/ui/select"

export type TravelData = {
  name: string;
  from: string;
  to: string;
  status: "booked" | "planned" | "idea" | null;
  startTime: string;
  endTime: string;
  transportation: "flight" | "train" | "car" | "bus" | "ferry" | "walk" | "other" | null;
  notes: string;
};

export function TravelFields({ data, onChange }: { data: TravelData; onChange: (data: TravelData) => void }) {
  const statusOptions = [
    { label: "Booked", value: "booked" },
    { label: "Planned", value: "planned" },
    { label: "Idea", value: "idea" }
  ]

  const transportationOptions = [
    { label: "Flight", value: "flight" },
    { label: "Train", value: "train" },
    { label: "Car", value: "car" },
    { label: "Bus", value: "bus" },
    { label: "Ferry", value: "ferry" },
    { label: "Walk", value: "walk" },
    { label: "Other", value: "other" },
  ]

  function handleStatusChange(value: "booked" | "planned" | "idea" | null) {
    onChange({ ...data, status: value ?? null });
  }

  function handleTransportationChange(value: "flight" | "train" | "car" | "bus" | "ferry" | "walk" | "other" | null) {
    onChange({ ...data, transportation: value ?? null });
  }


  return (
        <div className="flex flex-col gap-4 p-4">
            <Field>
                <FieldLabel htmlFor="input-travel-name">Name</FieldLabel>
                <Input
                    id="input-travel-name"
                    type="text"
                    placeholder="e.g. Flight to Tokyo"
                    value={data.name}
                    onChange={(e) => onChange({ ...data, name: e.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="input-transportation">Transportation</FieldLabel>
                    <Select value={data.transportation} onValueChange={handleTransportationChange} items={transportationOptions}>
                        <SelectTrigger className="w-fit max-w-40" size="sm">
                            <SelectValue placeholder="Transportation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Transportation</SelectLabel>
                            {transportationOptions.map((method) => (
                                <SelectItem key={method.value} value={method.value}>
                                    {method.label}
                                </SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
            </Field>
            <Field>
                <FieldLabel htmlFor="input-travel-from-location">From</FieldLabel>
                <Input
                    id="input-travel-from-location"
                    type="text"
                    placeholder="e.g. San Francisco Airport"
                    value={data.from}
                    onChange={(e) => onChange({ ...data, from: e.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="input-travel-to-location">To</FieldLabel>
                <Input
                    id="input-travel-to-location"
                    type="text"
                    placeholder="e.g. Narita International Airport"
                    value={data.to}
                    onChange={(e) => onChange({ ...data, to: e.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="input-travel-start-time">Start time</FieldLabel>
                <Input
                    id="input-travel-start-time"
                    type="time"
                    value={data.startTime}
                    onChange={(e) => onChange({ ...data, startTime: e.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="input-travel-end-time">End time <span className="text-muted-foreground">(optional)</span></FieldLabel>
                <Input
                    id="input-travel-end-time"
                    type="time"
                    value={data.endTime}
                    onChange={(e) => onChange({ ...data, endTime: e.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="travel-notes">Notes <span className="text-muted-foreground">(optional)</span></FieldLabel>
                <Textarea
                    id="travel-notes"
                    placeholder="e.g. confirmation number, seat assignment, gate info"
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
