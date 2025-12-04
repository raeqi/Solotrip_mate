"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, MapPin, Utensils, Camera } from "lucide-react";

export default function CreateInvitePage() {
    const [type, setType] = useState("meal");

    return (
        <div className="container mx-auto max-w-md py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Create Quick Invite</CardTitle>
                    <CardDescription>
                        Find someone to join you for a meal or activity right now.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant={type === "meal" ? "default" : "outline"}
                            className="h-20 flex flex-col gap-2"
                            onClick={() => setType("meal")}
                        >
                            <Utensils className="h-6 w-6" />
                            <span>Meal</span>
                        </Button>
                        <Button
                            variant={type === "activity" ? "default" : "outline"}
                            className="h-20 flex flex-col gap-2"
                            onClick={() => setType("activity")}
                        >
                            <Camera className="h-6 w-6" />
                            <span>Activity</span>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>What are you planning?</Label>
                            <Input placeholder={type === "meal" ? "e.g. Sushi at Tsukiji" : "e.g. Visit Senso-ji"} />
                        </div>

                        <div className="space-y-2">
                            <Label>When?</Label>
                            <Select defaultValue="now">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="now">Right Now</SelectItem>
                                    <SelectItem value="30min">In 30 mins</SelectItem>
                                    <SelectItem value="1hour">In 1 hour</SelectItem>
                                    <SelectItem value="custom">Custom Time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Where?</Label>
                            <div className="relative">
                                <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input className="pl-8" placeholder="Current Location or Search" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Valid Until</Label>
                            <Select defaultValue="1hour">
                                <SelectTrigger>
                                    <SelectValue placeholder="Duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30min">30 mins</SelectItem>
                                    <SelectItem value="1hour">1 hour</SelectItem>
                                    <SelectItem value="2hours">2 hours</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Invite will expire automatically after this time.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Note</Label>
                            <Textarea placeholder="Any specific preferences? (e.g. Dutch treat, No smoking)" />
                        </div>

                        <Button className="w-full" size="lg">
                            Post Invite
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
