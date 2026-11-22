"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { resolveMeetingTime } from "@/lib/invite-time.mjs";
import type { Invite, ItineraryItem } from "@/lib/types";

export default function CreateInvitePage() {
  return <Suspense fallback={<p className="p-8">Loading selected activity…</p>}><SelectedActivity /></Suspense>;
}
function SelectedActivity() {
  const params = useSearchParams();
  const {ready,trips,profile,invites} = useApp();
  if (!ready) return <p className="p-8">Loading your private plans…</p>;
  const tripId = params.get("trip"), activityId = params.get("activity");
  const trip = tripId ? trips.find(t=>t.id===tripId && t.organizer===profile.nickname) : undefined;
  const day = trip?.itinerary.find(d=>d.items.some(i=>i.id===activityId));
  const item = day?.items.find(i=>i.id===activityId);
  const replacement = invites.find(i=>i.id===params.get("replace"));
  if (tripId && !item) return <p className="p-8">This private activity is not available in this browser. <Link href="/trips" className="underline">Return to your plans</Link></p>;
  return <InviteForm key={(item?.id || replacement?.id || "new")} item={item} date={day?.date} replacement={replacement} />;
}
function InviteForm({item,date,replacement}:{item?:ItineraryItem;date?:string;replacement?:Invite}) {
  const {createInvite,inviteMode} = useApp();
  const router=useRouter();
  const [type,setType]=useState<Invite["type"]>(replacement?.type || "activity");
  const [title,setTitle]=useState(item?.activity || replacement?.title || "");
  const [location,setLocation]=useState(item?.location || replacement?.location || "");
  const [wallTime,setWallTime]=useState(item && date && item.time ? date+"T"+item.time : replacement?.scheduledTime || "");
  const [timeZone,setTimeZone]=useState("");
  const [confirmed,setConfirmed]=useState(false);
  const [occurrence,setOccurrence]=useState("");
  const [capacity,setCapacity]=useState(1);
  const [note,setNote]=useState("");
  const [located,setLocated]=useState(!!item?.coordinates);
  const [busy,setBusy]=useState(false),[error,setError]=useState("");
  async function submit(event:React.FormEvent) {
    event.preventDefault(); setError("");
    try {
      if (!title.trim() || !location.trim()) throw new Error("Add a title and a meeting place.");
      if (!confirmed) throw new Error("Confirm the meeting place's IANA time zone.");
      if (!Number.isInteger(capacity) || capacity<1 || capacity>12) throw new Error("Choose 1–12 companion places.");
      const zone=timeZone.trim();
      const startsAt=resolveMeetingTime(wallTime,zone,occurrence);
      if (Date.parse(startsAt)<=Date.now()) throw new Error("Choose a future meeting time.");
      setBusy(true);
      const id=await createInvite({type,title:title.trim(),location:location.trim(),scheduledTime:wallTime,startsAt,timeZone:zone,capacity,note:note.trim(),...(located&&item?.coordinates?{coordinates:item.coordinates}:{})});
      router.push("/invites/"+id+"?saved=1");
    } catch(error) {setError(error instanceof Error?error.message:"Invite could not be saved.");setBusy(false);}
  }
  return <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
    <Link className="text-sm underline" href="/invites">My invites</Link>
    <h1 className="text-3xl font-bold">{item?"Invite company for this activity":"Create an activity invite"}</h1>
    <p className="text-sm leading-6 text-muted-foreground">Only this activity&apos;s title, meeting place, confirmed time, companion places and your note below are included. The rest of your itinerary stays private.</p>
    {replacement&&<p className="rounded border p-3 text-sm">Create a new confirmed invite. The original legacy record is retained without guessing its time zone.</p>}
    <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-white p-5">
      <div className="grid grid-cols-2 gap-3"><Button type="button" variant={type==="meal"?"default":"outline"} onClick={()=>setType("meal")}>Meal</Button><Button type="button" variant={type==="activity"?"default":"outline"} onClick={()=>setType("activity")}>Activity</Button></div>
      <div className="space-y-2"><Label htmlFor="invite-title">Title</Label><Input id="invite-title" required maxLength={160} value={title} onChange={e=>setTitle(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="invite-location">Meeting place</Label><Input id="invite-location" required maxLength={300} value={location} onChange={e=>{setLocation(e.target.value);setLocated(false);setConfirmed(false);}} /><p className="text-xs text-muted-foreground">{located?"Map position comes only from the selected activity.":"Not located · shown in the list only. No guessed map pin."}</p>{item?.coordinates&&location===item.location&&<label className="flex gap-2 text-sm"><input type="checkbox" checked={located} onChange={e=>setLocated(e.target.checked)} />Use this activity&apos;s confirmed map position</label>}</div>
      <div className="space-y-2"><Label htmlFor="invite-time">Meeting date and time at the meeting place</Label><Input id="invite-time" type="datetime-local" required value={wallTime} onChange={e=>setWallTime(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="invite-zone">Meeting time zone (IANA)</Label><Input id="invite-zone" required list="meeting-zones" placeholder="e.g. Asia/Shanghai" value={timeZone} onChange={e=>{setTimeZone(e.target.value);setConfirmed(false);}} /><datalist id="meeting-zones">{["Asia/Shanghai","Asia/Tokyo","Asia/Seoul","Asia/Bangkok","Asia/Singapore","Europe/London","Europe/Paris","Europe/Zurich","America/New_York","America/Los_Angeles","Australia/Sydney","UTC"].map(z=><option key={z} value={z}/>)}</datalist><label className="flex items-start gap-2 text-sm"><input className="mt-1" type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} />I confirm this time zone belongs to the meeting place.</label></div>
      <details className="text-sm"><summary>When clocks move back</summary><label className="mt-2 block" htmlFor="overlap">If the local time occurs twice</label><select id="overlap" className="mt-2 w-full rounded border p-2" value={occurrence} onChange={e=>setOccurrence(e.target.value)}><option value="">Ask me to choose if ambiguous</option><option value="earlier">First occurrence</option><option value="later">Second occurrence</option></select></details>
      <div className="space-y-2"><Label htmlFor="invite-capacity">Companion places (excluding you)</Label><Input id="invite-capacity" required type="number" min={1} max={12} value={capacity} onChange={e=>setCapacity(Number(e.target.value))}/></div>
      <div className="space-y-2"><Label htmlFor="invite-note">Public activity note</Label><Textarea id="invite-note" maxLength={1000} value={note} onChange={e=>setNote(e.target.value)} placeholder="Add only what guests need for this activity." /></div>
      {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button className="w-full" disabled={busy||!["browser","shared"].includes(inviteMode)} type="submit">{busy?"Saving…":inviteMode==="shared"?"Save to local shared test":"Save browser demo invite"}</Button>
    </form>
  </div>;
}
