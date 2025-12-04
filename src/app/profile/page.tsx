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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Car, Wallet, MapPin, Trophy, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [nickname, setNickname] = useState("");

    // Deterministic avatar URL based on nickname
    const avatarUrl = nickname
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`
        : "/placeholder-user.jpg";

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        // Simulate API call to save profile
        setTimeout(() => {
            setIsLoading(false);
            alert("Profile updated! You earned the 'Newcomer' badge!");
            // Redirect to dashboard would happen here
        }, 1000);
    }

    return (
        <div className="container mx-auto max-w-2xl py-10">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-20 w-20 border-2 border-primary">
                            <AvatarImage src={avatarUrl} alt="Avatar" />
                            <AvatarFallback>User</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">Traveler Profile</CardTitle>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Trophy className="h-3 w-3" /> Level 1: Novice
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Star className="h-3 w-3" /> 0 Points
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <CardDescription>
                        Complete your profile to unlock new badges and find better matches.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-8">

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                                <User className="h-5 w-5" /> Basic Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nickname">Nickname</Label>
                                    <Input
                                        id="nickname"
                                        placeholder="e.g. Alex"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Your avatar will be automatically generated from your nickname.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mbti">MBTI Type</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="intj">INTJ</SelectItem>
                                            <SelectItem value="intp">INTP</SelectItem>
                                            <SelectItem value="entj">ENTJ</SelectItem>
                                            <SelectItem value="entp">ENTP</SelectItem>
                                            <SelectItem value="infj">INFJ</SelectItem>
                                            <SelectItem value="infp">INFP</SelectItem>
                                            <SelectItem value="enfj">ENFJ</SelectItem>
                                            <SelectItem value="enfp">ENFP</SelectItem>
                                            <SelectItem value="istj">ISTJ</SelectItem>
                                            <SelectItem value="isfj">ISFJ</SelectItem>
                                            <SelectItem value="estj">ESTJ</SelectItem>
                                            <SelectItem value="esfj">ESFJ</SelectItem>
                                            <SelectItem value="istp">ISTP</SelectItem>
                                            <SelectItem value="isfp">ISFP</SelectItem>
                                            <SelectItem value="estp">ESTP</SelectItem>
                                            <SelectItem value="esfp">ESFP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Travel Preferences */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                                <Car className="h-5 w-5" /> Travel Capabilities
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="driving">Driving Ability</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Can you drive?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="yes">Yes, I can drive</SelectItem>
                                            <SelectItem value="no">No, I cannot drive</SelectItem>
                                            <SelectItem value="passenger">Prefer to be a passenger</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Solo Travel Experience</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Experience level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Beginner (First time)</SelectItem>
                                            <SelectItem value="intermediate">Intermediate (Few trips)</SelectItem>
                                            <SelectItem value="expert">Expert (Frequent solo traveler)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Budget & History */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium flex items-center gap-2">
                                <Wallet className="h-5 w-5" /> Preferences & History
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="budget">Budget Sensitivity</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="How budget conscious are you?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="budget">Budget (Save where possible)</SelectItem>
                                        <SelectItem value="moderate">Moderate (Value for money)</SelectItem>
                                        <SelectItem value="luxury">Luxury (Comfort first)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="countries">Countries Visited</Label>
                                <Textarea id="countries" placeholder="List some countries you've been to..." />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating Profile..." : "Create Profile"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
