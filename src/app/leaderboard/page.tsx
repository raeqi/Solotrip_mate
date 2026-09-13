"use client";

import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Medal, Star } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getTravelerImage } from "@/lib/travel-images";

export default function LeaderboardPage() {
  const { travelers, profile } = useApp();
  const ranked = [...travelers].sort((a, b) => b.points - a.points);

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6">
      <header className="grid gap-6 border-b pb-10 md:grid-cols-[1fr_380px] md:items-end">
        <div><p className="eyebrow">Solotrip community · Season 01</p><h1 className="font-display mt-3 text-5xl leading-none sm:text-7xl">Travelers who make the road better.</h1></div>
        <p className="text-sm leading-7 text-muted-foreground">Recognition for completed journeys, thoughtful planning, trusted reviews, and the small acts that help other solo travelers feel at home.</p>
      </header>

      <section className="grid gap-5 py-12 md:grid-cols-3">
        {ranked.slice(0, 3).map((traveler, index) => (
          <Link key={traveler.id} href={`/users/${traveler.id}`} className={`group overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_36px_rgba(15,61,67,0.08)] ring-1 ring-border/60 ${index === 0 ? "md:-translate-y-3" : ""}`}>
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${getTravelerImage(traveler.id)})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" />
              <span className="font-display absolute left-5 top-3 text-7xl text-white/90">{String(index + 1).padStart(2, "0")}</span>
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white"><div><p className="text-lg font-bold">{traveler.nickname}</p><p className="text-xs text-white/70">{traveler.homeBase}</p></div><ArrowUpRight className="h-5 w-5" /></div>
            </div>
            <div className="flex items-center justify-between p-5"><div><strong className="font-display text-3xl">{traveler.points.toLocaleString()}</strong><span className="ml-1 text-xs text-muted-foreground">pts</span></div><div className="flex items-center gap-1 text-sm font-bold"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{traveler.rating}</div></div>
          </Link>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between"><div><p className="eyebrow">All travelers</p><h2 className="font-display mt-2 text-4xl">The full table</h2></div><span className="text-sm text-muted-foreground">Updated from demo activity</span></div>
        <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_12px_40px_rgba(15,61,67,0.07)] ring-1 ring-border/60">
          <div className="grid grid-cols-[60px_1fr_90px_100px] gap-3 border-b bg-[#f0eee7] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground sm:grid-cols-[70px_1fr_120px_120px_120px]"><span>Rank</span><span>Traveler</span><span>Rating</span><span className="hidden sm:block">Journeys</span><span className="text-right">Points</span></div>
          {ranked.map((traveler, index) => (
            <Link key={traveler.id} href={`/users/${traveler.id}`} className={`grid grid-cols-[60px_1fr_90px_100px] items-center gap-3 border-b border-border/60 px-5 py-4 transition-colors last:border-0 hover:bg-[#f5faf8] sm:grid-cols-[70px_1fr_120px_120px_120px] ${traveler.nickname === profile.nickname ? "bg-[#edf7f4]" : ""}`}>
              <span className="font-display text-2xl text-muted-foreground">{index < 3 ? <Medal className={`h-5 w-5 ${index === 0 ? "text-amber-500" : index === 1 ? "text-slate-400" : "text-orange-600"}`} /> : String(index + 1).padStart(2, "0")}</span>
              <span className="flex min-w-0 items-center gap-3"><Avatar className="h-11 w-11 bg-[#edf3ef]"><AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${traveler.avatarSeed}`} /><AvatarFallback>{traveler.nickname[0]}</AvatarFallback></Avatar><span className="min-w-0"><span className="flex items-center gap-1 font-semibold">{traveler.nickname}{traveler.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-teal-600" />}</span><span className="block truncate text-xs text-muted-foreground">{traveler.homeBase} · {traveler.interests[0]}</span></span></span>
              <span className="flex items-center gap-1 font-semibold"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{traveler.rating}</span>
              <span className="hidden sm:block"><Badge variant="secondary" className="rounded-full">{traveler.tripsCompleted} trips</Badge></span>
              <strong className="text-right text-teal-800">{traveler.points.toLocaleString()}</strong>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
