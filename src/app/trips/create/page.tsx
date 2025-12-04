"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItineraryItem {
    id: string;
    time: string;
    activity: string;
    location: string;
}

interface DayPlan {
    id: string;
    date: string;
    items: ItineraryItem[];
}

export default function CreateTripPage() {
    const idCounter = useRef(1);
    const getNextId = () => `id-${++idCounter.current}`;

    const [days, setDays] = useState<DayPlan[]>([
        { id: "1", date: "", items: [] }
    ]);

    const addDay = () => {
        setDays([
            ...days,
            { id: getNextId(), date: "", items: [] }
        ]);
    };

    const addItem = (dayId: string) => {
        setDays(days.map(day => {
            if (day.id === dayId) {
                return {
                    ...day,
                    items: [
                        ...day.items,
                        {
                            id: getNextId(),
                            time: "",
                            activity: "",
                            location: ""
                        }
                    ]
                };
            }
            return day;
        }));
    };

    const updateItem = (dayId: string, itemId: string, field: keyof ItineraryItem, value: string) => {
        setDays(days.map(day => {
            if (day.id === dayId) {
                return {
                    ...day,
                    items: day.items.map(item => {
                        if (item.id === itemId) {
                            return { ...item, [field]: value };
                        }
                        return item;
                    })
                };
            }
            return day;
        }));
    };

    const removeItem = (dayId: string, itemId: string) => {
        setDays(days.map(day => {
            if (day.id === dayId) {
                return {
                    ...day,
                    items: day.items.filter(item => item.id !== itemId)
                };
            }
            return day;
        }));
    };

    return (
        <div className="container mx-auto max-w-4xl py-10 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Plan Your Trip</h1>
                <p className="text-muted-foreground">Create a detailed itinerary to share with potential companions.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Trip Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Destination</Label>
                                <Input placeholder="e.g. Tokyo, Japan" />
                            </div>
                            <div className="space-y-2">
                                <Label>Dates</Label>
                                <div className="flex gap-2">
                                    <Input type="date" />
                                    <span className="self-center">to</span>
                                    <Input type="date" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea placeholder="What's the vibe of this trip? (e.g. Foodie tour, Hiking adventure)" />
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Itinerary</h2>
                        <Button onClick={addDay} variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" /> Add Day
                        </Button>
                    </div>

                    {days.map((day, index) => (
                        <Card key={day.id} className="relative">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <Input
                                        type="date"
                                        className="w-auto"
                                        value={day.date}
                                        onChange={(e) => {
                                            const newDays = [...days];
                                            newDays[index].date = e.target.value;
                                            setDays(newDays);
                                        }}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {day.items.map((item) => (
                                    <div key={item.id} className="grid grid-cols-[100px_1fr_1fr_auto] gap-2 items-start group">
                                        <Input
                                            type="time"
                                            value={item.time}
                                            onChange={(e) => updateItem(day.id, item.id, "time", e.target.value)}
                                        />
                                        <Input
                                            placeholder="Activity"
                                            value={item.activity}
                                            onChange={(e) => updateItem(day.id, item.id, "activity", e.target.value)}
                                        />
                                        <div className="relative">
                                            <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                className="pl-8"
                                                placeholder="Location"
                                                value={item.location}
                                                onChange={(e) => updateItem(day.id, item.id, "location", e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeItem(day.id, item.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full border-dashed border-2"
                                    onClick={() => addItem(day.id)}
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add Activity
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline">Save Draft</Button>
                    <Button>Publish Trip</Button>
                </div>
            </div>
        </div>
    );
}
