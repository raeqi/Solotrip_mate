"use client";

import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin, MessageCircle, Plus, Receipt, RotateCcw } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDestinationImage } from "@/lib/travel-images";

export default function DashboardPage() {
  const { profile, trips, invites, expenses, resetDemo } = useApp();
  const myTrips = trips.filter((trip) => trip.organizer === profile.nickname || trip.participants.includes(profile.nickname));
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.nickname)}`;

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6">
      <header className="flex flex-col justify-between gap-6 border-b pb-9 sm:flex-row sm:items-end">
        <div className="flex items-center gap-5"><Avatar className="h-16 w-16 border-4 border-white bg-white shadow-md"><AvatarImage src={avatar} /><AvatarFallback>{profile.nickname[0]}</AvatarFallback></Avatar><div><p className="eyebrow">Your travel space</p><h1 className="font-display mt-1 text-5xl">Welcome back, {profile.nickname}</h1><p className="mt-2 text-sm capitalize text-muted-foreground">{profile.soloExperience} traveler · {profile.budgetSensitivity} budget</p></div></div>
        <div className="flex gap-2"><Link href="/invites"><Button variant="outline">My invites</Button></Link><Link href="/profile"><Button variant="outline">Edit profile</Button></Link><Button variant="ghost" onClick={resetDemo}><RotateCcw className="mr-2 h-4 w-4" />Reset demo</Button></div>
      </header>

      <section className="grid grid-cols-3 divide-x border-b py-9">
        <div className="px-4 first:pl-0"><Calendar className="mb-4 h-5 w-5 text-teal-700" /><strong className="font-display text-5xl">{myTrips.length}</strong><p className="mt-1 text-xs text-muted-foreground">Trips in your orbit</p></div>
        <div className="px-6"><MessageCircle className="mb-4 h-5 w-5 text-teal-700" /><strong className="font-display text-5xl">{invites.length}</strong><p className="mt-1 text-xs text-muted-foreground">Open plans</p></div>
        <div className="px-6"><Receipt className="mb-4 h-5 w-5 text-teal-700" /><strong className="font-display text-5xl">${total.toFixed(0)}</strong><p className="mt-1 text-xs text-muted-foreground">Expenses tracked</p></div>
      </section>

      <section className="py-12">
        <div className="mb-7 flex items-end justify-between"><div><p className="eyebrow">Coming up</p><h2 className="font-display mt-2 text-4xl">Your journeys</h2></div><Link href="/trips/create"><Button><Plus className="mr-2 h-4 w-4" />New journey</Button></Link></div>
        <div className="grid gap-6 md:grid-cols-2">{myTrips.map((trip) => <Link key={trip.id} href={`/trips/${trip.id}`} className="group overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_36px_rgba(15,61,67,0.08)] ring-1 ring-border/60"><div className="relative h-60 overflow-hidden"><div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${getDestinationImage(trip.destination)})` }} /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" /><Badge className="absolute left-5 top-5 bg-white/90 text-slate-900 hover:bg-white">{trip.status}</Badge><p className="absolute bottom-5 left-5 flex items-center gap-1.5 text-sm font-semibold text-white"><MapPin className="h-4 w-4" />{trip.destination}</p></div><div className="flex items-start justify-between gap-4 p-6"><div><h3 className="font-display text-2xl">{trip.title}</h3><p className="mt-2 text-sm text-muted-foreground">{trip.startDate} – {trip.endDate}</p></div><ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></div></Link>)}</div>
      </section>
    </div>
  );
}
