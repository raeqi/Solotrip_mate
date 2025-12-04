"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamically import Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/map/Map"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-lg">
            <span className="text-muted-foreground">Loading Map...</span>
        </div>
    ),
});

const DEMO_MARKERS = [
    {
        id: "1",
        position: [51.505, -0.09] as [number, number],
        title: "London Eye Meetup",
        description: "Looking for 2 people to share a pod!",
        type: "group",
    },
    {
        id: "2",
        position: [51.51, -0.1] as [number, number],
        title: "British Museum Tour",
        description: "Join me for a guided tour this afternoon.",
        type: "group",
    },
    {
        id: "3",
        position: [51.515, -0.09] as [number, number],
        title: "Dinner at Dishoom",
        description: "Solo traveler looking for dinner companions.",
        type: "group",
    },
    {
        id: "4",
        position: [51.52, -0.11] as [number, number],
        title: "Quiet Reading Cafe",
        description: "Perfect for solo reading. Single seats available.",
        type: "solo",
    },
    {
        id: "5",
        position: [51.50, -0.12] as [number, number],
        title: "Ramen Bar",
        description: "Counter seating only. Great for quick solo meals.",
        type: "solo",
    },
];

export default function ExplorePage() {
    const [filter, setFilter] = useState<"all" | "solo" | "group">("all");

    const filteredMarkers = DEMO_MARKERS.filter(
        (m) => filter === "all" || m.type === filter
    );

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-96 border-r bg-background p-4 flex flex-col gap-4 overflow-y-auto">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Explore</h1>
                    <p className="text-sm text-muted-foreground">
                        Find companions and solo-friendly spots near you.
                    </p>
                </div>

                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search location..." className="pl-8" />
                </div>

                <div className="flex gap-2">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("all")}
                        className="flex-1"
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "group" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("group")}
                        className="flex-1"
                    >
                        Groups
                    </Button>
                    <Button
                        variant={filter === "solo" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("solo")}
                        className="flex-1"
                    >
                        Solo Spots
                    </Button>
                </div>

                <div className="space-y-4">
                    <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                        {filter === "solo" ? "Solo-Friendly Spots" : "Nearby Opportunities"}
                    </h2>

                    {filteredMarkers.map((marker) => (
                        <Card key={marker.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-base flex justify-between items-start">
                                    {marker.title}
                                    <span className={cn(
                                        "text-xs font-normal px-2 py-1 rounded-full",
                                        marker.type === "group" ? "bg-primary/10 text-primary" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    )}>
                                        {marker.type === "group" ? "Recruiting" : "Solo Friendly"}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-2">
                                <p className="text-sm text-muted-foreground">{marker.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> 0.5km
                                    </div>
                                    {marker.type === "group" && (
                                        <>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> Today
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3 w-3" /> 2/4
                                            </div>
                                        </>
                                    )}
                                </div>
                                {marker.type === "group" && (
                                    <Link href={`/trips/${marker.id}`} className="w-full mt-2 block">
                                        <Button size="sm" className="w-full" variant="outline">
                                            View Details
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 p-4 bg-muted/10">
                <Map markers={filteredMarkers} className="h-full w-full rounded-xl shadow-sm border" />
            </div>
        </div>
    );
}
