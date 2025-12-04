"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Paperclip, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    isMe: boolean;
}

const MOCK_MESSAGES: Message[] = [
    {
        id: "1",
        senderId: "u2",
        senderName: "Alex",
        content: "Hey everyone! Really excited for the Tokyo trip.",
        timestamp: "10:00 AM",
        isMe: false,
    },
    {
        id: "2",
        senderId: "u1",
        senderName: "You",
        content: "Me too! I've booked the Airbnb.",
        timestamp: "10:05 AM",
        isMe: true,
    },
    {
        id: "3",
        senderId: "u3",
        senderName: "Sam",
        content: "Awesome. Shall we meet at Shinjuku station?",
        timestamp: "10:10 AM",
        isMe: false,
    },
];

export default function ChatPage() {
    const idCounter = useRef(3); // Start at 3 since we have 3 initial messages
    const getNextId = () => `msg-${++idCounter.current}`;

    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: getNextId(),
            senderId: "u1",
            senderName: "You",
            content: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
        };

        setMessages([...messages, newMessage]);
        setInputValue("");
    };

    return (
        <div className="container mx-auto max-w-4xl py-6 h-[calc(100vh-4rem)] flex flex-col">
            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader className="border-b px-6 py-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Trip Chat: Tokyo Foodie Tour</CardTitle>
                        <p className="text-sm text-muted-foreground">3 Members • Online</p>
                    </div>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex gap-3 max-w-[80%]",
                                message.isMe ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                            </Avatar>
                            <div
                                className={cn(
                                    "rounded-lg p-3 text-sm",
                                    message.isMe
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}
                            >
                                <div className="font-semibold text-xs mb-1 opacity-70">
                                    {message.senderName}
                                </div>
                                {message.content}
                                <div className="text-[10px] mt-1 opacity-50 text-right">
                                    {message.timestamp}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </CardContent>

                <div className="p-4 border-t bg-background">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Button type="button" variant="ghost" size="icon">
                            <Paperclip className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <Input
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
