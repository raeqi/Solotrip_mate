"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, MapPin, Users, Plus } from "lucide-react";

const MOCK_TRIPS = [
    {
        id: "1",
        title: "Weekend Foodie Tour in Tokyo",
        destination: "Tokyo, Japan",
        startDate: "Oct 15",
        endDate: "Oct 18",
        participants: 2,
        maxParticipants: 4,
        status: "recruiting",
    },
    {
        id: "2",
        title: "Hiking in Swiss Alps",
        destination: "Switzerland",
        startDate: "Nov 1",
        endDate: "Nov 7",
        participants: 3,
        maxParticipants: 4,
        status: "confirmed",
    },
];

export default function TripsPage() {
    return (
        <div className="container mx-auto max-w-4xl py-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Trips</h1>
                <Link href="/trips/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" /> Create Trip
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {MOCK_TRIPS.map((trip) => (
                    <Link key={trip.id} href={`/trips/${trip.id}`}>
                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-xl">{trip.title}</CardTitle>
                                    <Badge variant={trip.status === "recruiting" ? "default" : "secondary"}>
                                        {trip.status === "recruiting" ? "Recruiting" : "Confirmed"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {trip.destination}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {trip.startDate} - {trip.endDate}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        {trip.participants}/{trip.maxParticipants}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
