"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, MapPin, Calendar, Star, Globe, MessageCircle } from "lucide-react";
import Link from "next/link";

// Mock user data - in real app, fetch based on [id]
const MOCK_USER = {
    id: "u2",
    nickname: "TravelBuddy",
    mbti: "INTJ",
    driving_ability: "yes",
    solo_experience: "expert",
    budget_sensitivity: "budget",
    countries_visited: "Thailand, Vietnam, Cambodia, Indonesia",
    level: "Seasoned Explorer",
    points: 850,
    badges: ["Backpacker", "Budget Master"],
    stats: {
        countries: 8,
        trips_created: 3,
        trips_joined: 12,
        contributions: 28
    },
    recent_trips: [
        { id: "1", title: "Southeast Asia Backpacking", date: "Sep 2023", role: "Organizer" },
        { id: "2", title: "Bali Surf Trip", date: "Aug 2023", role: "Participant" }
    ]
};

export default function UserProfilePage({ params }: { params: { id: string } }) {
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${MOCK_USER.nickname}`;

    return (
        <div className="container mx-auto max-w-6xl py-10 space-y-8">
            {/* Header with Avatar and Basic Info */}
            <Card className="bg-gradient-to-r from-primary/10 to-background border-primary/20">
                <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-8">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                <AvatarImage src={avatarUrl} />
                                <AvatarFallback>{MOCK_USER.nickname[0]}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold">{MOCK_USER.nickname}</h1>
                                <div className="flex flex-wrap gap-2">
                                    <Badge className="text-sm px-3 py-1 bg-primary text-primary-foreground">
                                        <Trophy className="h-4 w-4 mr-1" /> Level: {MOCK_USER.level}
                                    </Badge>
                                    <Badge variant="secondary" className="text-sm px-3 py-1">
                                        <Star className="h-4 w-4 mr-1" /> {MOCK_USER.points} Points
                                    </Badge>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    {MOCK_USER.badges.map(badge => (
                                        <Badge key={badge} variant="outline" className="text-xs">
                                            {badge}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Button className="gap-2">
                            <MessageCircle className="h-4 w-4" /> Send Message
                        </Button>
                    </div>

                    {/* Global Ranking */}
                    <div className="bg-background/50 rounded-lg p-4 border mt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Global Ranking</div>
                                <div className="text-2xl font-bold text-primary">#128</div>
                                <p className="text-xs text-muted-foreground">Top 15% of travelers</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                        <Globe className="h-8 w-8 text-blue-500" />
                        <div className="text-2xl font-bold">{MOCK_USER.stats.countries}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Countries</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                        <MapPin className="h-8 w-8 text-green-500" />
                        <div className="text-2xl font-bold">{MOCK_USER.stats.trips_created}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Trips Created</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                        <Calendar className="h-8 w-8 text-purple-500" />
                        <div className="text-2xl font-bold">{MOCK_USER.stats.trips_joined}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Trips Joined</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                        <Star className="h-8 w-8 text-yellow-500" />
                        <div className="text-2xl font-bold">{MOCK_USER.stats.contributions}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Contributions</div>
                    </CardContent>
                </Card>
            </div>

            {/* Traveler Profile (Read-only) */}
            <Card>
                <CardHeader>
                    <CardTitle>Traveler Profile</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Public travel preferences and experience
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">MBTI Type</div>
                            <div className="text-lg">{MOCK_USER.mbti}</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Driving Ability</div>
                            <div className="text-lg">{MOCK_USER.driving_ability === "yes" ? "✓ Can drive" : "Cannot drive"}</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Solo Travel Experience</div>
                            <div className="text-lg capitalize">{MOCK_USER.solo_experience}</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Budget Preference</div>
                            <div className="text-lg capitalize">{MOCK_USER.budget_sensitivity}</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Countries Visited</div>
                        <div className="text-lg">{MOCK_USER.countries_visited}</div>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Trips */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Trips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {MOCK_USER.recent_trips.map(trip => (
                        <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <div className="font-medium">{trip.title}</div>
                                <div className="text-sm text-muted-foreground">{trip.date}</div>
                            </div>
                            <Badge variant={trip.role === 'Organizer' ? 'default' : 'secondary'}>
                                {trip.role}
                            </Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
