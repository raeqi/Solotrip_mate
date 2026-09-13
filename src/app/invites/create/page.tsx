"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Invite } from "@/lib/types";

export default function CreateInvitePage() {
  const { createInvite } = useApp(); const router = useRouter();
  const [type, setType] = useState<Invite["type"]>("meal"); const [title, setTitle] = useState(""); const [location, setLocation] = useState(""); const [scheduledTime, setScheduledTime] = useState(""); const [note, setNote] = useState(""); const [error, setError] = useState("");
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!title.trim() || !location.trim() || !scheduledTime) { setError("Complete the title, location, and time."); return; } createInvite({ type, title: title.trim(), location: location.trim(), scheduledTime, note: note.trim() }); router.push("/dashboard"); };
  return <div className="container mx-auto max-w-xl px-4 py-10"><Card><CardHeader><CardTitle>Create a nearby invite</CardTitle></CardHeader><CardContent><form className="space-y-5" onSubmit={submit}><div className="grid grid-cols-2 gap-3"><Button type="button" variant={type === "meal" ? "default" : "outline"} onClick={() => setType("meal")}>Meal</Button><Button type="button" variant={type === "activity" ? "default" : "outline"} onClick={() => setType("activity")}>Activity</Button></div><div className="space-y-2"><Label htmlFor="invite-title">Title</Label><Input id="invite-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Dinner at a local izakaya" /></div><div className="space-y-2"><Label htmlFor="invite-location">Meeting place</Label><Input id="invite-location" value={location} onChange={(event) => setLocation(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="invite-time">Time</Label><Input id="invite-time" type="datetime-local" value={scheduledTime} onChange={(event) => setScheduledTime(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="invite-note">Note</Label><Textarea id="invite-note" value={note} onChange={(event) => setNote(event.target.value)} /></div>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="w-full" type="submit">Post invite</Button></form></CardContent></Card></div>;
}
