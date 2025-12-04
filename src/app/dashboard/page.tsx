"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, MapPin, Calendar, Star, Globe, User, Edit, Save } from "lucide-react";
import Link from "next/link";

// Mock user data
const MOCK_USER = {
    id: "u1",
    nickname: "AlexExplorer",
    mbti: "ENFP",
    driving_ability: "yes",
    budget_sensitivity: "moderate",
    solo_experience: "intermediate",
    countries_visited: "Japan, Switzerland, France, Italy, Spain",
    level: "Globe Trotter",
    points: 1250,
    badges: ["Early Adopter", "Top Organizer", "Foodie"],
    stats: {
        countries: 12,
        trips_created: 5,
        trips_joined: 8,
        contributions: 45
    },
    recent_trips: [
        { id: "1", title: "Tokyo Foodie Tour", date: "Oct 2023", role: "Organizer" },
        { id: "2", title: "Swiss Alps Hiking", date: "Nov 2023", role: "Participant" }
    ]
};

export default function DashboardPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [nickname, setNickname] = useState(MOCK_USER.nickname);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`;

    const handleSave = () => {
        setIsEditing(false);
        // In real app, save to backend
        alert("Profile updated successfully!");
    };

    return (
        <div className="container mx-auto max-w-6xl py-10 space-y-8">
            {/* Header with Avatar and Basic Info */}
            <Card className="bg-gradient-to-r from-primary/10 to-background border-primary/20">
                <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-8">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                <AvatarImage src={avatarUrl} />
                                <AvatarFallback>{nickname[0]}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold">{nickname}</h1>
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
                        <Button
                            variant={isEditing ? "default" : "outline"}
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className="gap-2"
                        >
                            {isEditing ? (
                                <>
                                    <Save className="h-4 w-4" /> Save Profile
                                </>
                            ) : (
                                <>
                                    <Edit className="h-4 w-4" /> Edit Profile
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Global Ranking - Inline */}
                    <div className="bg-background/50 rounded-lg p-4 border">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Global Ranking</div>
                                <div className="text-2xl font-bold text-primary">#42</div>
                                <p className="text-xs text-muted-foreground">Top 5% of travelers</p>
                            </div>
                            <div className="flex-1 max-w-xs ml-8">
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[85%]" />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 text-right">150 pts to next rank</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs for Stats and Profile */}
            <Tabs defaultValue="stats" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="stats">Stats & Activity</TabsTrigger>
                    <TabsTrigger value="profile">Traveler Profile</TabsTrigger>
                </TabsList>

                {/* Stats Tab */}
                <TabsContent value="stats" className="space-y-6 mt-6">
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

                    {/* Recent Activity */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Trips</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {MOCK_USER.recent_trips.map(trip => (
                                    <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                        <div>
                                            <div className="font-medium">{trip.title}</div>
                                            <div className="text-sm text-muted-foreground">{trip.date}</div>
                                        </div>
                                        <Badge variant={trip.role === 'Organizer' ? 'default' : 'secondary'}>
                                            {trip.role}
                                        </Badge>
                                    </div>
                                ))}
                                <Link href="/trips/create">
                                    <Button className="w-full mt-2" variant="outline">Plan New Trip</Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Contribution Tasks</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-muted/30 rounded-lg border border-dashed">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <div className="font-medium text-sm">Rate "Sushi Zanmai"</div>
                                            <p className="text-xs text-muted-foreground mb-2">You visited this place in Tokyo.</p>
                                            <Button size="sm" variant="secondary">Rate Now (+50 pts)</Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-lg border border-dashed">
                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <div className="font-medium text-sm">Complete Profile</div>
                                            <p className="text-xs text-muted-foreground mb-2">Add more travel details.</p>
                                            <Button size="sm" variant="secondary" onClick={() => document.querySelector('[value="profile"]')?.click()}>
                                                Update (+20 pts)
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Traveler Information</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {isEditing ? "Edit your profile to help find better travel companions." : "Your travel preferences and capabilities."}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                    <User className="h-5 w-5" /> Basic Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nickname">Nickname</Label>
                                        {isEditing ? (
                                            <Input
                                                id="nickname"
                                                value={nickname}
                                                onChange={(e) => setNickname(e.target.value)}
                                            />
                                        ) : (
                                            <div className="p-2 bg-muted rounded-md">{nickname}</div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mbti">MBTI Type</Label>
                                        {isEditing ? (
                                            <Select defaultValue={MOCK_USER.mbti}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ENFP">ENFP</SelectItem>
                                                    <SelectItem value="INTJ">INTJ</SelectItem>
                                                    <SelectItem value="INFP">INFP</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="p-2 bg-muted rounded-md">{MOCK_USER.mbti}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Travel Capabilities */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Travel Capabilities</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Driving Ability</Label>
                                        {isEditing ? (
                                            <Select defaultValue={MOCK_USER.driving_ability}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="yes">Yes, I can drive</SelectItem>
                                                    <SelectItem value="no">No, I cannot drive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="p-2 bg-muted rounded-md">
                                                {MOCK_USER.driving_ability === "yes" ? "Yes, I can drive" : "No"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Solo Travel Experience</Label>
                                        {isEditing ? (
                                            <Select defaultValue={MOCK_USER.solo_experience}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="beginner">Beginner</SelectItem>
                                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="expert">Expert</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="p-2 bg-muted rounded-md capitalize">{MOCK_USER.solo_experience}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Preferences & History</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Budget Sensitivity</Label>
                                        {isEditing ? (
                                            <Select defaultValue={MOCK_USER.budget_sensitivity}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="budget">Budget</SelectItem>
                                                    <SelectItem value="moderate">Moderate</SelectItem>
                                                    <SelectItem value="luxury">Luxury</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="p-2 bg-muted rounded-md capitalize">{MOCK_USER.budget_sensitivity}</div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Countries Visited</Label>
                                        {isEditing ? (
                                            <Textarea
                                                defaultValue={MOCK_USER.countries_visited}
                                                placeholder="List countries you've visited..."
                                            />
                                        ) : (
                                            <div className="p-2 bg-muted rounded-md">{MOCK_USER.countries_visited}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
