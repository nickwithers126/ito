"use client";

import * as React from "react"
import { format, parseISO } from "date-fns"
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
import { 
    Select, 
    SelectContent, 
    SelectGroup, 
    SelectLabel, 
    SelectTrigger, 
    SelectItem, 
    SelectValue 
} from "@/components/ui/select";

import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { StayFields, type StayData } from "./stay-fields";
import { ActivityFields, type ActivityData } from "./activity-fields";
import { FoodDrinkFields, type FoodDrinkData } from "./food-drink-fields";
import { TravelFields, type TravelData } from "./travel-fields";

export function AddItemDrawer({ 
    tripStartDate, 
    tripEndDate, 
    days,
    dayId 
}: { 
    tripStartDate: string; 
    tripEndDate: string; 
    days: { id: number; date: string}[];
    dayId: number;
 }) {
    const startDate = parseISO(tripStartDate);
    const endDate = parseISO(tripEndDate);
    const isMobile = useIsMobile()
    const supabase = createClient()
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [itemType, setItemType] = React.useState<"stay" | "travel" | "activity" | "food & drink" | null>(null)
    const [stayData, setStayData] = React.useState<StayData>({
        name: "",
        status: null as "booked" | "planned" | "idea" | null,
        checkInDate: undefined as Date | undefined,
        checkInTime: "",
        checkOutDate: undefined as Date | undefined,
        checkOutTime: "",
        location: "",
        notes: "",
    })
    const [activityData, setActivityData] = React.useState<ActivityData>({
        name: "",
        status: null as "booked" | "planned" | "idea" | null,
        time: "",
        location: "",
        notes: "",
    })
    const [foodDrinkData, setFoodDrinkData] = React.useState<FoodDrinkData>({
        name: "",
        status: null as "booked" | "planned" | "idea" | null,
        time: "",
        location: "",
        notes: "",
    })
    const [travelData, setTravelData] = React.useState<TravelData>({
        name: "",
        status: null as "booked" | "planned" | "idea" | null,
        from: "",
        to: "",
        startTime: "",
        endTime: "",
        transportation: null as "flight" | "train" | "car" | "bus" | "ferry" | "walk" | "other" | null,
        notes: "",
    })
    const itemTypeOptions = [
        { label: "Stay", value: "stay" },
        { label: "Travel", value: "travel" },
        { label: "Activity", value: "activity" },
        { label: "Food & drink", value: "food & drink" }
    ]
    const isFormValid =
        (itemType === "stay" &&
            stayData.name.trim() !== "" &&
            stayData.location.trim() !== "" &&
            stayData.status !== null &&
            stayData.checkInDate !== undefined &&
            stayData.checkInTime.trim() !== "" &&
            stayData.checkOutDate !== undefined &&
            stayData.checkOutTime.trim() !== "" &&
            stayData.checkInDate < stayData.checkOutDate &&
            stayData.checkInDate >= startDate &&
            stayData.checkOutDate <= endDate) ||
        (itemType === "activity" &&
            activityData.name.trim() !== "" &&
            activityData.location.trim() !== "" &&
            activityData.status !== null &&
            activityData.time.trim() !== "") ||
        (itemType === "food & drink" &&
            foodDrinkData.name.trim() !== "" &&
            foodDrinkData.location.trim() !== "" &&
            foodDrinkData.status !== null &&
            foodDrinkData.time.trim() !== "") ||
        (itemType === "travel" &&
            travelData.name.trim() !== "" &&
            travelData.transportation !== null &&
            travelData.from.trim() !== "" &&
            travelData.to.trim() !== "" &&
            travelData.status !== null &&
            travelData.startTime.trim() !== ""
        )


    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);
        if (!nextOpen) {
            setItemType(null);
            setStayData({
                name: "",
                status: null,
                checkInDate: undefined,
                checkInTime: "",
                checkOutDate: undefined,
                checkOutTime: "",
                location: "",
                notes: "",
            });
            setActivityData({
                name: "",
                status: null,
                time: "",
                location: "",
                notes: "",
            });
            setFoodDrinkData({
                name: "",
                status: null,
                time: "",
                location: "",
                notes: "",
            });
            setTravelData({
                name: "",
                status: null,
                transportation: null,
                from: "",
                to: "",
                startTime: "",
                endTime: "",
                notes: "",
            });
        }
    }

    function handleItemTypeChange(value: "stay" | "travel" | "activity" | "food & drink" | null) {
        setItemType(value ?? null);
    }   

    async function handleAddItem() {
        if (itemType === "stay") {

            const checkInDay = days.find((day) => day.date === format(stayData.checkInDate!, "yyyy-MM-dd"))

            if (!checkInDay) {
                console.error("No matching day found for check-in date");
                return;
            }

            const addItemResponse = await supabase.from("itinerary_items").insert({
                name: stayData.name,
                day_id: checkInDay.id,
                type: itemType,
                status: stayData.status,
                notes: stayData.notes,
                location: stayData.location,
                check_in_date: format(stayData.checkInDate!, "yyyy-MM-dd"),
                check_out_date: format(stayData.checkOutDate!, "yyyy-MM-dd"),
                check_in_time: stayData.checkInTime,
                check_out_time: stayData.checkOutTime
            }).select().single();

            if (addItemResponse.error) {
                console.error("Error adding item:", addItemResponse.error);
                return;
            }

            handleOpenChange(false);
            router.refresh();
        }

        if (itemType === "activity") {
            const addItemResponse = await supabase.from("itinerary_items").insert({
                name: activityData.name,
                day_id: dayId,
                type: itemType,
                status: activityData.status,
                notes: activityData.notes,
                location: activityData.location,
                time: activityData.time,
            }).select().single();

            if (addItemResponse.error) {
                console.error("Error adding item:", addItemResponse.error);
                return;
            }

            handleOpenChange(false);
            router.refresh();
        }

        if (itemType === "food & drink") {
            const addItemResponse = await supabase.from("itinerary_items").insert({
                name: foodDrinkData.name,
                day_id: dayId,
                type: itemType,
                status: foodDrinkData.status,
                notes: foodDrinkData.notes,
                location: foodDrinkData.location,
                time: foodDrinkData.time,
            }).select().single();

            if (addItemResponse.error) {
                console.error("Error adding item:", addItemResponse.error);
                return;
            }

            handleOpenChange(false);
            router.refresh();
        }

        if (itemType === "travel") {
            const addItemResponse = await supabase.from("itinerary_items").insert({
                name: travelData.name,
                day_id: dayId,
                type: itemType,
                status: travelData.status,
                notes: travelData.notes,
                transportation: travelData.transportation,
                from: travelData.from,
                to: travelData.to,
                start_time: travelData.startTime,
                end_time: travelData.endTime || null,
            }).select().single();

            if (addItemResponse.error) {
                console.error("Error adding item:", addItemResponse.error);
                return;
            }

            handleOpenChange(false);
            router.refresh();
        }
    }

    return (
        <Drawer 
            open={open}
            onOpenChange={handleOpenChange}
            showSwipeHandle={isMobile} 
            swipeDirection={isMobile ? "down" : "right"}
        >
        <DrawerTrigger className="px-6" render={<Button variant="outline" size="sm" className="hover:cursor-pointer"/>}>
            <Plus className="size-4" strokeWidth={2.5}/>
            Add item
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Add an itinerary item</DrawerTitle>
                <DrawerDescription>Choose a type, then fill in the details</DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 min-h-24 overflow-y-auto">
                <Field className="p-4 pb-0">
                    <FieldLabel htmlFor="input-trip-name">Item type</FieldLabel>
                        <Select value={itemType} onValueChange={handleItemTypeChange} items={itemTypeOptions}>
                            <SelectTrigger className="w-fit max-w-40" size="sm">
                                <SelectValue placeholder="Item type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Item type</SelectLabel>
                                {itemTypeOptions.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>  
                </Field>
                {itemType == "stay" && <StayFields data={stayData} onChange={setStayData}/> }
                {itemType == "travel" && <TravelFields data={travelData} onChange={setTravelData}/> }
                {itemType == "activity" && <ActivityFields data={activityData} onChange={setActivityData}/> }
                {itemType == "food & drink" && <FoodDrinkFields data={foodDrinkData} onChange={setFoodDrinkData}/> }
            </div>
            <DrawerFooter>
                <Button className="hover:cursor-pointer" onClick={handleAddItem} disabled={!isFormValid}>
                    Add item
                </Button>
                <DrawerClose render={<Button className="hover:cursor-pointer" variant="outline" />}>Cancel</DrawerClose>
            </DrawerFooter>
        </DrawerContent>
        </Drawer>
    );
}