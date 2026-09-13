"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, CalendarDays, Clock3, MapPin, Search, Star, Users } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getDestinationImage, getTravelerImage } from "@/lib/travel-images";

const Map = dynamic(() => import("@/components/map/Map"), { ssr: false, loading: () => <div className="flex h-full items-center justify-center bg-[#e8efeb] text-sm text-muted-foreground">Loading the world…</div> });

export default function ExplorePage() {
  const { trips, invites, travelers } = useApp();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"trips" | "invites" | "travelers">("trips");
  const normalized = query.trim().toLowerCase();
  const publicTrips = trips.filter((trip) => trip.status === "recruiting" && (!normalized || `${trip.title} ${trip.destination}`.toLowerCase().includes(normalized)));
  const publicInvites = invites.filter((invite) => !normalized || `${invite.title} ${invite.location}`.toLowerCase().includes(normalized));
  const people = travelers.filter((traveler) => !normalized || `${traveler.nickname} ${traveler.homeBase} ${traveler.interests.join(" ")}`.toLowerCase().includes(normalized));
  const markers = (view === "trips" ? publicTrips : view === "invites" ? publicInvites : []).map((item) => ({ id: item.id, position: item.coordinates ?? [35.6812, 139.7671], title: item.title, description: "destination" in item ? item.destination : item.location, isSoloFriendly: false }));

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6">
      <header className="mb-9 grid gap-7 border-b border-border/80 pb-9 lg:grid-cols-[1fr_420px] lg:items-end">
        <div>
          <p className="eyebrow">Explore the world together</p>
          <h1 className="font-display mt-3 max-w-3xl text-5xl leading-[0.95] sm:text-6xl">Find a journey that already feels like yours.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Meet around a shared route, a table, or a few hours in the same city. Your solo trip remains the center of the plan.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-14 rounded-full border-border bg-white pl-12 pr-5 shadow-[0_10px_30px_rgba(15,61,67,0.07)]" placeholder="Search a city, interest, or traveler" />
        </div>
      </header>

      <div className="mb-6 flex gap-1 overflow-x-auto border-b">
        {([
          ["trips", "Journeys", publicTrips.length],
          ["invites", "Meet along the way", publicInvites.length],
          ["travelers", "Travelers", people.length],
        ] as const).map(([key, label, count]) => (
          <button key={key} onClick={() => setView(key)} className={`relative whitespace-nowrap px-5 pb-4 pt-2 text-sm font-semibold transition-colors ${view === key ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {label}<span className="ml-2 text-xs opacity-50">{count}</span>
            {view === key && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-7 lg:grid-cols-[540px_1fr]">
        <div className="max-h-[720px] space-y-4 overflow-y-auto pr-1">
          {view === "trips" && publicTrips.map((trip) => {
            const organizer = travelers.find((person) => person.nickname === trip.organizer);
            return (
              <article key={trip.id} className="group grid min-h-56 overflow-hidden rounded-[1.5rem] bg-white shadow-[0_10px_32px_rgba(15,61,67,0.065)] ring-1 ring-border/60 sm:grid-cols-[210px_1fr]">
                <Link href={`/trips/${trip.id}`} className="relative min-h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${getDestinationImage(trip.destination)})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <Badge className="absolute left-4 top-4 bg-white/90 text-slate-800 hover:bg-white">Open trip</Badge>
                  <span className="absolute bottom-4 left-4 text-xs font-semibold text-white"><MapPin className="mr-1 inline h-3.5 w-3.5" />{trip.destination}</span>
                </Link>
                <div className="flex flex-col justify-between p-5">
                  <div>
                    <Link href={`/trips/${trip.id}`}><h2 className="text-xl font-bold leading-snug transition-colors group-hover:text-primary">{trip.title}</h2></Link>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{trip.description}</p>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-600">
                      <span><CalendarDays className="mr-1.5 inline h-3.5 w-3.5 text-teal-700" />{trip.startDate}</span>
                      <span><Users className="mr-1.5 inline h-3.5 w-3.5 text-teal-700" />{trip.participants.length}/{trip.maxParticipants}</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <Link href={organizer ? `/users/${organizer.id}` : "#"} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8"><AvatarImage src={organizer ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${organizer.avatarSeed}` : undefined} /><AvatarFallback>{trip.organizer[0]}</AvatarFallback></Avatar>
                      <span className="text-xs font-semibold">{trip.organizer}</span>{organizer?.verified && <BadgeCheck className="h-3.5 w-3.5 text-teal-600" />}
                    </Link>
                    <Link href={`/trips/${trip.id}`} aria-label={`View ${trip.title}`}><ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
                  </div>
                </div>
              </article>
            );
          })}

          {view === "invites" && publicInvites.map((invite) => (
            <article key={invite.id} className="group overflow-hidden rounded-[1.5rem] bg-white p-6 shadow-[0_10px_32px_rgba(15,61,67,0.065)] ring-1 ring-border/60">
              <div className="flex items-start justify-between gap-4"><Badge variant="secondary" className="rounded-full capitalize">{invite.type}</Badge><ArrowUpRight className="h-5 w-5 text-muted-foreground" /></div>
              <h2 className="mt-5 text-2xl font-bold">{invite.title}</h2>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-teal-700" />{invite.location}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="h-4 w-4 text-teal-700" />{new Date(invite.scheduledTime).toLocaleString()}</p>
              <p className="mt-5 border-t pt-5 text-sm leading-6 text-slate-700">{invite.note}</p>
              <p className="mt-4 text-xs text-muted-foreground">Hosted by <strong className="text-foreground">{invite.creator}</strong></p>
            </article>
          ))}

          {view === "travelers" && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">{people.map((traveler) => (
            <Link key={traveler.id} href={`/users/${traveler.id}`} className="group overflow-hidden rounded-[1.5rem] bg-white shadow-[0_10px_32px_rgba(15,61,67,0.065)] ring-1 ring-border/60">
              <div className="relative h-32 overflow-hidden"><div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${getTravelerImage(traveler.id)})` }} /><div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" /></div>
              <div className="relative p-5 pt-9"><Avatar className="absolute -top-8 h-16 w-16 border-4 border-white bg-white"><AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${traveler.avatarSeed}`} /><AvatarFallback>{traveler.nickname[0]}</AvatarFallback></Avatar><span className="absolute right-5 top-3 flex items-center gap-1 text-xs font-bold"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{traveler.rating}</span><div className="flex items-center gap-1"><h2 className="font-bold">{traveler.nickname}</h2>{traveler.verified && <BadgeCheck className="h-4 w-4 text-teal-600" />}</div><p className="mt-1 text-xs text-muted-foreground">{traveler.homeBase} · {traveler.tripsCompleted} trips</p><p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-700">{traveler.bio}</p>
              </div>
            </Link>
          ))}</div>}
        </div>

        <aside className="sticky top-24 hidden overflow-hidden rounded-[1.75rem] bg-white p-2 shadow-[0_20px_60px_rgba(15,61,67,0.12)] ring-1 ring-border/60 lg:block">
          <div className="absolute left-6 top-6 z-[500] rounded-full bg-white/90 px-4 py-2 text-xs font-semibold shadow-md backdrop-blur">{markers.length} places to explore</div>
          <Map center={[20, 0]} zoom={2} markers={markers} className="h-[700px] w-full rounded-[1.35rem]" />
        </aside>
      </div>
    </div>
  );
}
