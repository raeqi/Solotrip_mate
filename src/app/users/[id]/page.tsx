"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowUpRight, BadgeCheck, Car, Globe2, Languages, MapPin, MessageCircle, Star } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDestinationImage, getTravelerImage } from "@/lib/travel-images";

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { travelers, trips } = useApp();
  const traveler = travelers.find((person) => person.id === id);

  if (!traveler) {
    return <div className="container mx-auto max-w-xl py-20 text-center"><h1 className="font-display text-4xl">Traveler not found</h1><Link href="/explore"><Button className="mt-6">Explore travelers</Button></Link></div>;
  }

  const theirTrips = trips.filter((trip) => trip.organizer === traveler.nickname || trip.participants.includes(traveler.nickname));
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${traveler.avatarSeed}`;
  const countries = traveler.countriesVisited.split(",").map((country) => country.trim());

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 sm:py-10">
      <section className="editorial-card overflow-hidden">
        <div className="grid min-h-[520px] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-[340px] overflow-hidden lg:min-h-full">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-[1.02]" style={{ backgroundImage: `url(${getTravelerImage(traveler.id)})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-800 shadow-lg backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />Open to meeting on the road
            </div>
          </div>

          <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">
            <div>
              <div className="flex items-start justify-between gap-4">
                <Avatar className="h-20 w-20 border-4 border-white bg-[#e9f5f2] shadow-md">
                  <AvatarImage src={avatar} /><AvatarFallback>{traveler.nickname[0]}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-900">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />{traveler.rating}
                </div>
              </div>
              <p className="eyebrow mt-8">Traveler profile</p>
              <div className="mt-2 flex items-center gap-2">
                <h1 className="font-display text-5xl leading-none sm:text-6xl">{traveler.nickname}</h1>
                {traveler.verified && <BadgeCheck className="h-6 w-6 shrink-0 text-teal-600" />}
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />Based in {traveler.homeBase}</p>
              <p className="mt-8 max-w-xl text-lg leading-8 text-slate-700">{traveler.bio}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {traveler.interests.map((interest) => <Badge key={interest} variant="secondary" className="rounded-full border-0 px-3.5 py-1.5 font-medium">{interest}</Badge>)}
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border/70 pt-7">
              <Button size="lg"><MessageCircle className="mr-2 h-4 w-4" />Say hello</Button>
              <span className="text-sm text-muted-foreground">Usually replies within a day</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-10 py-14 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="eyebrow">Journeys</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl sm:text-5xl">Trips our paths may cross</h2>
            <span className="hidden text-sm text-muted-foreground sm:block">{theirTrips.length} upcoming</span>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {theirTrips.map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}`} className="group overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_36px_rgba(15,61,67,0.08)] ring-1 ring-border/60">
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${getDestinationImage(trip.destination)})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
                  <Badge className="absolute left-4 top-4 bg-white/90 text-slate-800 hover:bg-white">{trip.status}</Badge>
                  <p className="absolute bottom-4 left-4 text-sm font-semibold text-white"><MapPin className="mr-1 inline h-4 w-4" />{trip.destination}</p>
                </div>
                <div className="flex items-start justify-between gap-3 p-5">
                  <div><h3 className="text-lg font-bold leading-snug">{trip.title}</h3><p className="mt-2 text-sm text-muted-foreground">{trip.startDate} · {trip.itinerary.length} days</p></div>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
            {theirTrips.length === 0 && <div className="rounded-3xl border border-dashed p-10 text-muted-foreground">No public journeys yet.</div>}
          </div>
        </div>

        <aside className="lg:border-l lg:pl-10">
          <p className="eyebrow">Travel at a glance</p>
          <div className="mt-6 grid grid-cols-3 gap-2 border-b pb-8">
            <div><strong className="font-display block text-4xl">{traveler.tripsCompleted}</strong><span className="text-xs text-muted-foreground">trips</span></div>
            <div><strong className="font-display block text-4xl">{countries.length}</strong><span className="text-xs text-muted-foreground">countries</span></div>
            <div><strong className="font-display block text-4xl">{traveler.points.toLocaleString()}</strong><span className="text-xs text-muted-foreground">points</span></div>
          </div>
          <dl className="space-y-6 py-8 text-sm">
            <div className="flex gap-4"><Globe2 className="mt-0.5 h-5 w-5 text-teal-700" /><div><dt className="font-semibold">Travel style</dt><dd className="mt-1 capitalize text-muted-foreground">{traveler.soloExperience} · {traveler.budgetSensitivity} budget</dd></div></div>
            <div className="flex gap-4"><Languages className="mt-0.5 h-5 w-5 text-teal-700" /><div><dt className="font-semibold">Languages</dt><dd className="mt-1 text-muted-foreground">{traveler.languages.join(" · ")}</dd></div></div>
            <div className="flex gap-4"><Car className="mt-0.5 h-5 w-5 text-teal-700" /><div><dt className="font-semibold">On the road</dt><dd className="mt-1 capitalize text-muted-foreground">{traveler.drivingAbility === "yes" ? "Comfortable driving" : traveler.drivingAbility}</dd></div></div>
          </dl>
          <div className="rounded-2xl bg-[#eaf4f1] p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-teal-800">Travel signature</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{countries.slice(0, 4).join(" · ")}</p>
            <p className="mt-2 text-xs text-muted-foreground">Personality {traveler.mbti}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
