"use client";

import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin, Plus, Users } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDestinationImage } from "@/lib/travel-images";

const date = (value: string) => value ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`)) : "Unscheduled";

export default function TripsPage() {
  const { trips } = useApp();
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6">
      <header className="mb-10 flex flex-col justify-between gap-6 border-b pb-10 sm:flex-row sm:items-end">
        <div><p className="eyebrow">Your travel library</p><h1 className="font-display mt-3 text-6xl leading-none">Journeys, in one place.</h1><p className="mt-4 text-muted-foreground">Build for yourself. Invite company only when it fits.</p></div>
        <Link href="/trips/create"><Button size="lg"><Plus className="mr-2 h-4 w-4" />Create a journey</Button></Link>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {trips.map((trip, index) => (
          <Link key={trip.id} href={`/trips/${trip.id}`} className={`group overflow-hidden rounded-[1.75rem] bg-white shadow-[0_14px_42px_rgba(15,61,67,0.08)] ring-1 ring-border/60 ${index === 0 ? "md:col-span-2 md:grid md:grid-cols-[1.1fr_.9fr]" : ""}`}>
            <div className={`relative overflow-hidden ${index === 0 ? "min-h-[360px]" : "h-64"}`}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${getDestinationImage(trip.destination)})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <Badge className="absolute left-5 top-5 bg-white/90 text-slate-900 hover:bg-white">{trip.status}</Badge>
              <span className="absolute bottom-5 left-5 text-sm font-semibold text-white"><MapPin className="mr-1.5 inline h-4 w-4" />{trip.destination}</span>
            </div>
            <div className={`flex flex-col justify-between p-6 ${index === 0 ? "md:p-10" : ""}`}>
              <div><p className="eyebrow">Journey {String(index + 1).padStart(2, "0")}</p><h2 className={`font-display mt-3 leading-tight ${index === 0 ? "text-4xl" : "text-3xl"}`}>{trip.title}</h2><p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{trip.description}</p></div>
              <div className="mt-8 flex items-end justify-between border-t pt-5"><div className="flex flex-wrap gap-4 text-xs text-muted-foreground"><span><Calendar className="mr-1.5 inline h-3.5 w-3.5" />{date(trip.startDate)} – {date(trip.endDate)}</span><span><Users className="mr-1.5 inline h-3.5 w-3.5" />{trip.participants.length}/{trip.maxParticipants}</span></div><ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
