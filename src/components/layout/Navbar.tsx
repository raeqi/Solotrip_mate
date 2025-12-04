"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Map, User, Compass, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
    const pathname = usePathname();

    // Demo mode: Simulate logged-in state if user is on dashboard or profile
    const isLoggedIn = pathname === "/dashboard" || pathname === "/profile" || pathname?.startsWith("/trips/");

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <Compass className="h-6 w-6 text-primary" />
                        <span>Solotrip Mate</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/explore" className="transition-colors hover:text-primary">
                        Explore
                    </Link>
                    <Link href="/trips" className="transition-colors hover:text-primary">
                        My Trips
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/auth">
                                <Button>Sign In</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
