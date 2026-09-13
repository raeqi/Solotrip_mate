"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { trips, messages, profile, addMessage } = useApp();
  const [value, setValue] = useState("");
  const trip = trips.find((item) => item.id === id);
  const tripMessages = messages.filter((message) => message.tripId === id);
  const send = (event: React.FormEvent) => { event.preventDefault(); if (!value.trim()) return; addMessage(id, value.trim()); setValue(""); };
  if (!trip) return <div className="p-10 text-center">Trip not found.</div>;
  return (
    <div className="container mx-auto flex h-[calc(100vh-5rem)] max-w-4xl flex-col px-4 py-6">
      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 border-b"><Link href={`/trips/${id}`}><Button aria-label="Back to trip" variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link><div><CardTitle>{trip.title}</CardTitle><p className="text-sm text-muted-foreground">{trip.participants.length} travelers</p></div></CardHeader>
        <CardContent className="flex-1 space-y-4 overflow-y-auto p-6">{tripMessages.length === 0 && <p className="text-center text-sm text-muted-foreground">Start the conversation.</p>}{tripMessages.map((message) => { const mine = message.senderName === profile.nickname; return <div key={message.id} className={cn("flex max-w-[85%] gap-3", mine && "ml-auto flex-row-reverse")}><Avatar className="h-8 w-8"><AvatarFallback>{message.senderName[0]}</AvatarFallback></Avatar><div className={cn("rounded-xl p-3 text-sm", mine ? "bg-primary text-primary-foreground" : "bg-muted")}><div className="mb-1 text-xs font-semibold opacity-70">{message.senderName}</div><p>{message.content}</p><div className="mt-1 text-right text-[10px] opacity-60">{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div></div></div>; })}</CardContent>
        <form onSubmit={send} className="flex gap-2 border-t p-4"><Input aria-label="Message" value={value} onChange={(event) => setValue(event.target.value)} placeholder="Write a message…" /><Button aria-label="Send message" type="submit" size="icon"><Send className="h-4 w-4" /></Button></form>
      </Card>
    </div>
  );
}
