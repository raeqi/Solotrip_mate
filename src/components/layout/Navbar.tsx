"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApp } from "@/components/providers/AppProvider";

export function Navbar() {
    const { profile } = useApp();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.nickname)}`;

    return (
        <><header className="sticky top-0 z-50 w-full border-b border-teal-950/10 bg-[#faf8f2]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2.5 text-xl">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-900/20 bg-white text-teal-800"><Compass className="h-[18px] w-[18px]" /></span>
                        <span className="font-display text-[1.55rem] font-semibold tracking-tight">Solotrip Mate</span>
                    </Link>
                </div>

                <nav className="hidden items-center gap-4 text-[13px] font-semibold lg:flex">
                    <Link href="/explore" className="transition-colors hover:text-primary">
                        Explore
                    </Link>
                    <Link href="/trips" className="transition-colors hover:text-primary">
                        My Trips
                    </Link>
                    <Link href="/invites" className="transition-colors hover:text-primary">My invites</Link>
                    <Link href="/leaderboard" className="transition-colors hover:text-primary">
                        Leaderboard
                    </Link>
                    <Link href="/invites/create" className="transition-colors hover:text-primary">
                        Quick Invite
                    </Link>
                </nav>

                <div className="flex items-center gap-2">
                    <Link href="/trips/create" className="hidden sm:block"><Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" />Plan a trip</Button></Link>
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="gap-2 px-2">
                            <Avatar className="h-8 w-8 border border-white shadow-sm"><AvatarImage src={avatar} /><AvatarFallback>{profile.nickname[0]}</AvatarFallback></Avatar>
                            <span className="hidden lg:inline">{profile.nickname}</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </header><nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-[1000] grid grid-cols-5 border-t bg-[#faf8f2] px-1 pb-[env(safe-area-inset-bottom)] lg:hidden">{[["/explore","Explore"],["/trips","My trips"],["/trips/create","Plan"],["/invites/create","Invite"],["/invites","My invites"]].map(([href,label])=><Link key={href} href={href} className="flex min-h-14 items-center justify-center rounded px-1 text-center text-xs font-semibold focus-visible:outline-2">{label}</Link>)}</nav></>
    );
}
