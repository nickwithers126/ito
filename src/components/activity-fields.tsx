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

export type ActivityData = {
  name: string;
  location: string;
  status: "booked" | "planned" | "idea" | null;
  time: string;
  notes: string;
};

export function ActivityFields({ data, onChange }: { data: ActivityData; onChange: (data: ActivityData) => void }) {
  const statusOptions = [
    { label: "Booked", value: "booked" },
    { label: "Planned", value: "planned" },
    { label: "Idea", value: "idea" }
  ]

    function handleStatusChange(value: "booked" | "planned" | "idea" | null) {
    onChange({ ...data, status: value ?? null });
  }

  return (
        <div className="flex flex-col gap-4 p-4">
            <Field>
                <FieldLabel htmlFor="input-activity-name">Name</FieldLabel>
                <Input
                    id="input-activity-name"
                    type="text"
                    placeholder="e.g. Fushimi Inari hike"
                    value={data.name}
                    onChange={(e) => onChange({ ...data, name: e.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="input-activity-location">Location</FieldLabel>
                <Input
                    id="input-activity-location"
                    type="text"
                    placeholder="e.g. Fushimi Inari Taisha"
                    value={data.location}
                    onChange={(e) => onChange({ ...data, location: e.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="input-activity-time">Time</FieldLabel>
                <Input
                    id="input-activity-time"
                    type="time"
                    value={data.time}
                    onChange={(e) => onChange({ ...data, time: e.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="activity-notes">Notes</FieldLabel>
                <Textarea
                    id="activity-notes"
                    placeholder="e.g. what to bring, meeting point details"
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
