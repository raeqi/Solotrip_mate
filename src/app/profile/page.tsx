"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers/AppProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { TravelerProfile } from "@/lib/types";

export default function ProfilePage() {
  const { profile, saveProfile } = useApp();
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const set = <K extends keyof TravelerProfile>(field: K, value: TravelerProfile[K]) => setForm((current) => ({ ...current, [field]: value }));
  const submit = (event: React.FormEvent) => { event.preventDefault(); saveProfile({ ...form, nickname: form.nickname.trim() }); setSaved(true); window.setTimeout(() => router.push("/dashboard"), 500); };
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(form.nickname || "traveler")}`;
  return (
    <div className="container mx-auto max-w-2xl px-4 py-10"><Card><CardHeader><div className="mb-4 flex items-center gap-4"><Avatar className="h-20 w-20"><AvatarImage src={avatar} /><AvatarFallback>{form.nickname[0] || "T"}</AvatarFallback></Avatar><div><CardTitle>Traveler profile</CardTitle><CardDescription>These preferences help people decide whether a shared activity is a good fit.</CardDescription></div></div></CardHeader><CardContent><form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="nickname">Nickname</Label><Input id="nickname" required value={form.nickname} onChange={(event) => set("nickname", event.target.value)} /></div><div className="space-y-2"><Label>MBTI</Label><Select value={form.mbti} onValueChange={(value) => set("mbti", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["ENFP", "INFP", "INTJ", "ENTJ", "ISFP", "ESFP", "ISTJ", "ESTJ"].map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></div></div>
      <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Driving</Label><Select value={form.drivingAbility} onValueChange={(value: TravelerProfile["drivingAbility"]) => set("drivingAbility", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="yes">I can drive</SelectItem><SelectItem value="no">I cannot drive</SelectItem><SelectItem value="passenger">Prefer to be a passenger</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Travel experience</Label><Select value={form.soloExperience} onValueChange={(value: TravelerProfile["soloExperience"]) => set("soloExperience", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="intermediate">Intermediate</SelectItem><SelectItem value="expert">Expert</SelectItem></SelectContent></Select></div></div>
      <div className="space-y-2"><Label>Budget style</Label><Select value={form.budgetSensitivity} onValueChange={(value: TravelerProfile["budgetSensitivity"]) => set("budgetSensitivity", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="budget">Budget</SelectItem><SelectItem value="moderate">Moderate</SelectItem><SelectItem value="luxury">Comfort first</SelectItem></SelectContent></Select></div>
      <div className="space-y-2"><Label htmlFor="countries">Countries visited</Label><Textarea id="countries" value={form.countriesVisited} onChange={(event) => set("countriesVisited", event.target.value)} /></div>
      {saved && <p className="text-sm text-green-600">Profile saved.</p>}<Button className="w-full" type="submit">Save profile</Button>
    </form></CardContent></Card></div>
  );
}
