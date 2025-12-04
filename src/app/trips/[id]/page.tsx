"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Clock, Share2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function TripDetailsPage() {
    const params = useParams();
    const id = params.id;

    return (
        <div className="container mx-auto max-w-4xl py-10 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-sm">Recruiting</Badge>
                        <span className="text-sm text-muted-foreground">Posted 2 hours ago</span>
                    </div>
                    <h1 className="text-4xl font-bold">Weekend Foodie Tour in Tokyo</h1>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> Tokyo, Japan
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> Oct 15 - Oct 18
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" /> 2/4 Spots Left
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                    <Button size="lg" className="w-full">Request to Join</Button>
                    <Button variant="outline" className="w-full gap-2">
                        <Share2 className="h-4 w-4" /> Share Trip
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-[2fr_1fr] gap-8">
                {/* Main Content */}
                <div className="space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">About this Trip</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Hi everyone! I'm planning a weekend trip to Tokyo focused mainly on street food and hidden ramen spots.
                            I'm an INTJ who loves photography. Looking for chill companions who enjoy walking and eating.
                            We'll split accommodation costs (Airbnb) and go dutch on meals.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Itinerary</h2>
                        <div className="space-y-6">
                            {[1, 2, 3].map((day) => (
                                <Card key={day}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-sm">
                                                {day}
                                            </span>
                                            Day {day}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex gap-4 items-start">
                                            <div className="min-w-[60px] text-sm text-muted-foreground pt-1">10:00 AM</div>
                                            <div>
                                                <h4 className="font-medium">Meet at Shinjuku Station</h4>
                                                <p className="text-sm text-muted-foreground">South Exit, near the penguin statue.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-start">
                                            <div className="min-w-[60px] text-sm text-muted-foreground pt-1">12:00 PM</div>
                                            <div>
                                                <h4 className="font-medium">Lunch at Omoide Yokocho</h4>
                                                <p className="text-sm text-muted-foreground">Yakitori and drinks.</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Organizer</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">John Doe</div>
                                <div className="text-xs text-muted-foreground">Expert Traveler • 12 Trips</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm font-medium mb-1">Budget</div>
                                <Badge variant="outline">Moderate</Badge>
                            </div>
                            <div>
                                <div className="text-sm font-medium mb-1">Pace</div>
                                <Badge variant="outline">Relaxed</Badge>
                            </div>
                            <div>
                                <div className="text-sm font-medium mb-1">Language</div>
                                <Badge variant="outline">English</Badge>
                                <Badge variant="outline" className="ml-2">Japanese (Basic)</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
