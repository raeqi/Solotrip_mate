"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, DollarSign, ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";

interface Expense {
    id: string;
    description: string;
    amount: number;
    payer: string;
    date: string;
}

interface Settlement {
    from: string;
    to: string;
    amount: number;
}

const MOCK_USERS = [
    { id: "u1", name: "You", avatar: "/placeholder-user.jpg" },
    { id: "u2", name: "Alex", avatar: "/placeholder-user.jpg" },
    { id: "u3", name: "Sam", avatar: "/placeholder-user.jpg" },
];

export default function ExpensesPage() {
    const params = useParams();
    const idCounter = useRef(2); // Start at 2 since we have 2 initial expenses
    const getNextId = () => `exp-${++idCounter.current}`;

    const [expenses, setExpenses] = useState<Expense[]>([
        { id: "1", description: "Dinner at Izakaya", amount: 120, payer: "You", date: "2023-10-15" },
        { id: "2", description: "Taxi to Hotel", amount: 45, payer: "Alex", date: "2023-10-15" },
    ]);
    const [newExpense, setNewExpense] = useState({ description: "", amount: "" });

    const addExpense = () => {
        if (!newExpense.description || !newExpense.amount) return;
        setExpenses([
            ...expenses,
            {
                id: getNextId(),
                description: newExpense.description,
                amount: parseFloat(newExpense.amount),
                payer: "You", // Default to current user for demo
                date: new Date().toISOString().split('T')[0],
            }
        ]);
        setNewExpense({ description: "", amount: "" });
    };

    // Mock settlement calculation
    const settlements: Settlement[] = [
        { from: "Alex", to: "You", amount: 37.50 },
        { from: "Sam", to: "You", amount: 40.00 },
    ];

    return (
        <div className="container mx-auto max-w-4xl py-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Trip Expenses</h1>
                <Button>Export Report</Button>
            </div>

            <div className="grid md:grid-cols-[2fr_1fr] gap-8">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Expense</CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-4">
                            <Input
                                placeholder="Description"
                                value={newExpense.description}
                                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                            />
                            <div className="relative w-32">
                                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-8"
                                    placeholder="0.00"
                                    type="number"
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                />
                            </div>
                            <Button onClick={addExpense}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {expenses.map((expense) => (
                                <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            <DollarSign className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{expense.description}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Paid by {expense.payer} • {expense.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-lg">${expense.amount.toFixed(2)}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle>Settlement</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {settlements.map((s, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback>{s.from[0]}</AvatarFallback>
                                        </Avatar>
                                        <span>{s.from}</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarFallback>{s.to[0]}</AvatarFallback>
                                        </Avatar>
                                        <span>{s.to}</span>
                                    </div>
                                    <div className="font-bold ml-auto text-green-600">
                                        ${s.amount.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full mt-4" variant="outline">
                                Settle Up
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Spend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                ${expenses.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Total for the whole trip
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
