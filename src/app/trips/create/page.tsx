"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, MapPin } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DayPlan, ItineraryItem, TripStatus } from "@/lib/types";

const newId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

export default function CreateTripPage() {
  const router = useRouter();
  const { createTrip } = useApp();
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(4);
  const [error, setError] = useState("");
  const [days, setDays] = useState<DayPlan[]>([{ id: "day-1", date: "", items: [] }]);

  const addDay = () => setDays((current) => [...current, { id: newId("day"), date: "", items: [] }]);
  const updateDayDate = (dayId: string, date: string) => setDays((current) => current.map((day) => day.id === dayId ? { ...day, date } : day));
  const addItem = (dayId: string) => setDays((current) => current.map((day) => day.id === dayId
    ? { ...day, items: [...day.items, { id: newId("item"), time: "", activity: "", location: "", openToCompanions: false }] }
    : day));
  const updateItem = (dayId: string, itemId: string, field: keyof ItineraryItem, value: string | boolean) => setDays((current) => current.map((day) => day.id === dayId
    ? { ...day, items: day.items.map((item) => item.id === itemId ? { ...item, [field]: value } : item) }
    : day));
  const removeItem = (dayId: string, itemId: string) => setDays((current) => current.map((day) => day.id === dayId
    ? { ...day, items: day.items.filter((item) => item.id !== itemId) }
    : day));

  const save = (status: TripStatus) => {
    if (!title.trim() || !destination.trim() || !startDate || !endDate) {
      setError("Add a title, destination, start date, and end date.");
      return;
    }
    if (endDate < startDate) {
      setError("End date must be on or after the start date.");
      return;
    }
    const id = createTrip({ title: title.trim(), destination: destination.trim(), startDate, endDate, description: description.trim(), maxParticipants, status, itinerary: days });
    router.push(`/trips/${id}`);
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div><h1 className="text-3xl font-bold">Plan your trip</h1><p className="text-muted-foreground">Build it for yourself first, then open any activity to companions.</p></div>
      <Card>
        <CardHeader><CardTitle>Trip details</CardTitle></CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="title">Trip title</Label><Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Tokyo autumn food trip" /></div>
            <div className="space-y-2"><Label htmlFor="destination">Destination</Label><Input id="destination" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Tokyo, Japan" /></div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label htmlFor="start">Start</Label><Input id="start" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="end">End</Label><Input id="end" type="date" value={endDate} min={startDate} onChange={(event) => setEndDate(event.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="capacity">Maximum travelers</Label><Input id="capacity" type="number" min={1} max={12} value={maxParticipants} onChange={(event) => setMaxParticipants(Number(event.target.value))} /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What pace, budget, and experiences do you have in mind?" /></div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Itinerary</h2><Button onClick={addDay} variant="outline" size="sm"><Plus className="mr-2 h-4 w-4" />Add day</Button></div>
        {days.map((day, index) => (
          <Card key={day.id}>
            <CardHeader><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">{index + 1}</span><Input aria-label={`Day ${index + 1} date`} type="date" className="w-auto" value={day.date} onChange={(event) => updateDayDate(day.id, event.target.value)} /></div></CardHeader>
            <CardContent className="space-y-3">
              {day.items.map((item) => (
                <div key={item.id} className="grid gap-2 rounded-lg border p-3 md:grid-cols-[100px_1fr_1fr_auto]">
                  <Input aria-label="Activity time" type="time" value={item.time} onChange={(event) => updateItem(day.id, item.id, "time", event.target.value)} />
                  <Input aria-label="Activity" placeholder="Activity" value={item.activity} onChange={(event) => updateItem(day.id, item.id, "activity", event.target.value)} />
                  <div className="relative"><MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Location" className="pl-8" placeholder="Location" value={item.location} onChange={(event) => updateItem(day.id, item.id, "location", event.target.value)} /></div>
                  <Button aria-label="Remove activity" variant="ghost" size="icon" onClick={() => removeItem(day.id, item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  <label className="flex items-center gap-2 text-sm md:col-span-4"><input type="checkbox" checked={item.openToCompanions} onChange={(event) => updateItem(day.id, item.id, "openToCompanions", event.target.checked)} />Welcome companions for this activity</label>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full border-2 border-dashed" onClick={() => addItem(day.id)}><Plus className="mr-2 h-4 w-4" />Add activity</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => save("draft")}>Save draft</Button><Button onClick={() => save("recruiting")}>Publish trip</Button></div>
    </div>
  );
}
