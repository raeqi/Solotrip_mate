"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, MapPin, MessageCircle, Receipt, Route, Users } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDestinationImage } from "@/lib/travel-images";

const Map = dynamic(() => import("@/components/map/Map"), { ssr: false, loading: () => <div className="flex h-full min-h-[520px] items-center justify-center bg-muted/30">Loading route…</div> });
const dayColors = ["#0f766e", "#0284c7", "#ea580c", "#16a34a", "#d97706", "#0e7490"];
const formatDate = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${value}T00:00:00`));

export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { ready, trips, travelers, profile, requestToJoin } = useApp();
  const trip = trips.find((item) => item.id === id);
  if (!ready) return <p className="p-8">Loading your private journey…</p>;
  if (!trip) return <div className="container mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">Trip not found</h1><Link href="/trips"><Button className="mt-6">Back to trips</Button></Link></div>;

  const joined = trip.participants.includes(profile.nickname);
  const full = trip.participants.length >= trip.maxParticipants;
  const organizer = travelers.find((person) => person.nickname === trip.organizer);
  const base = trip.coordinates;
  let order = 0;
  const mappedDays = trip.itinerary.map((day, dayIndex) => ({
    ...day,
    color: dayColors[dayIndex % dayColors.length],
    items: day.items.map((item) => ({
      ...item,
      order: ++order,
      mapPosition: item.coordinates,
    })),
  }));
  const markers = mappedDays.flatMap(day => day.items.flatMap(item => item.mapPosition ? [{id:item.id,position:item.mapPosition,title:item.activity || "Untitled activity",description:(item.time || "Anytime")+" · "+item.location,order:item.order,color:day.color}] : []));
  const routes = mappedDays.map(day => ({positions:day.items.flatMap(item=>item.mapPosition?[item.mapPosition]:[]),color:day.color}));

  return (
    <div className="mx-auto max-w-[1450px] px-4 py-8">
      <div className="relative mb-8 min-h-[430px] overflow-hidden rounded-[1.75rem] bg-slate-900 shadow-[0_24px_70px_rgba(15,61,67,0.16)]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${getDestinationImage(trip.destination)})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/10" />
        <div className="relative flex min-h-[430px] flex-col justify-between p-7 text-white sm:p-10 lg:p-12">
          <div className="flex items-center gap-2"><Badge className="bg-white/90 text-slate-900 hover:bg-white">{trip.status}</Badge><span className="text-xs font-semibold uppercase tracking-widest text-white/65">Private browser plan</span></div>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div><p className="mb-3 text-sm font-semibold text-orange-200">{trip.destination}</p><h1 className="font-display max-w-3xl text-5xl leading-[0.95] sm:text-6xl">{trip.title}</h1><div className="mt-6 flex flex-wrap gap-5 text-sm text-white/75"><span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span><span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{trip.participants.length}/{trip.maxParticipants} travelers</span></div></div>
            <div className="min-w-64">{trip.organizer===profile.nickname&&<Link className="mb-3 block text-center text-sm underline" href={"/trips/create?edit="+encodeURIComponent(trip.id)}>Edit private plan</Link>}<Button className="w-full bg-white text-slate-950 shadow-none hover:bg-white/90" disabled={joined || full} onClick={() => requestToJoin(trip.id)}>{joined ? "You’re in this trip" : full ? "Trip is full" : "Join this trip"}</Button>{joined ? <div className="mt-2 grid grid-cols-2 gap-2"><Link href={`/trips/${trip.id}/chat`}><Button variant="outline" className="w-full border-white/25 bg-black/15 text-white hover:bg-white/15 hover:text-white"><MessageCircle className="mr-2 h-4 w-4" />Chat</Button></Link><Link href={`/trips/${trip.id}/expenses`}><Button variant="outline" className="w-full border-white/25 bg-black/15 text-white hover:bg-white/15 hover:text-white"><Receipt className="mr-2 h-4 w-4" />Costs</Button></Link></div> : <p className="mt-3 text-center text-xs text-white/60">Join to unlock chat and shared expenses</p>}</div>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,620px)_1fr]">
        <div className="space-y-5">
          <div className="border-b pb-7"><p className="text-lg leading-8 text-slate-700">{trip.description || "No description yet."}</p>{organizer && <Link href={`/users/${organizer.id}`} className="mt-6 inline-flex items-center gap-3"><Avatar><AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${organizer.avatarSeed}`} /><AvatarFallback>{organizer.nickname[0]}</AvatarFallback></Avatar><div><p className="text-[11px] uppercase tracking-widest text-muted-foreground">Curated by</p><p className="font-semibold">{organizer.nickname} · {organizer.rating} ★</p></div></Link>}</div>
          <div className="flex items-end justify-between pt-3"><div><p className="eyebrow">Day by day</p><h2 className="font-display mt-2 text-4xl">The route</h2></div><span className="flex items-center gap-2 text-sm text-muted-foreground"><Route className="h-4 w-4" />{markers.length} stops</span></div>
          {mappedDays.length === 0 && <Card><CardContent className="py-10 text-center text-muted-foreground">No activities have been added yet.</CardContent></Card>}
          {mappedDays.map((day, index) => <Card key={day.id} className="glass-surface overflow-hidden border-0"><div className="h-1.5" style={{ backgroundColor: day.color }} /><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg">Day {index + 1}</CardTitle><Badge variant="outline">{day.date ? formatDate(day.date) : "Open date"}</Badge></div></CardHeader><CardContent className="space-y-5">{day.items.length === 0 ? <p className="text-sm text-muted-foreground">Open day</p> : day.items.map((item) => <div key={item.id} className="grid grid-cols-[34px_58px_1fr] gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow" style={{ backgroundColor: day.color }}>{item.order}</span><span className="pt-1.5 text-sm font-medium text-muted-foreground">{item.time || "Any"}</span><div className="border-b pb-5 last:border-0"><div className="font-semibold">{item.activity || "Untitled activity"}{item.openToCompanions && <Badge className="ml-2 bg-teal-100 text-teal-800 hover:bg-teal-100">Open</Badge>}</div><p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{item.location}{!item.coordinates&&<span> · Not located</span>}</p>{trip.organizer===profile.nickname&&<Link className="mt-3 inline-block text-sm font-semibold text-teal-800 underline" href={"/invites/create?trip="+encodeURIComponent(trip.id)+"&activity="+encodeURIComponent(item.id)}>Invite for this activity</Link>}</div></div>)}</CardContent></Card>)}
        </div>
        <div className="sticky top-24 overflow-hidden rounded-[1.75rem] bg-white p-2 shadow-[0_20px_60px_rgba(15,61,67,0.12)] ring-1 ring-border/60"><div className="flex flex-wrap gap-4 px-4 py-3">{mappedDays.map((day, index) => <span key={day.id} className="flex items-center gap-1.5 text-xs font-semibold"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: day.color }} />Day {index + 1}</span>)}</div>{markers.length ? <><p className="px-4 pb-3 text-xs text-muted-foreground">Confirmed stops only. Lines connect stops; they are not navigation routes.</p><Map center={base} zoom={11} markers={markers} routes={routes} className="h-[690px] w-full rounded-[1.35rem]" /></> : <p className="p-8 text-sm text-muted-foreground">No confirmed activity positions. Your unlocated activities stay in the itinerary; no map pins are guessed.</p>}</div>
      </div>
    </div>
  );
}
