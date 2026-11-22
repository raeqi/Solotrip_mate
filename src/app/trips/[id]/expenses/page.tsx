"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, DollarSign, Plus } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ExpensesPage() {
  const { id } = useParams<{ id: string }>();
  const { trips, expenses, addExpense } = useApp();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const trip = trips.find((item) => item.id === id);
  const tripExpenses = expenses.filter((expense) => expense.tripId === id);
  const total = useMemo(() => tripExpenses.reduce((sum, expense) => sum + expense.amount, 0), [tripExpenses]);
  const add = () => { const numericAmount = Number(amount); if (!description.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) { setError("Enter a description and a positive amount."); return; } addExpense(id, description.trim(), numericAmount); setDescription(""); setAmount(""); setError(""); };
  if (!trip) return <div className="p-10 text-center">Trip not found.</div>;
  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="flex items-center gap-3"><Link href={`/trips/${id}`}><Button aria-label="Back to trip" variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link><div><h1 className="text-3xl font-bold">Trip expenses</h1><p className="text-muted-foreground">{trip.title}</p></div></div>
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6"><Card><CardHeader><CardTitle>Add expense</CardTitle></CardHeader><CardContent><div className="flex gap-3"><Input aria-label="Expense description" placeholder="Dinner" value={description} onChange={(event) => setDescription(event.target.value)} /><Input aria-label="Expense amount" className="w-32" type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} /><Button aria-label="Add expense" onClick={add}><Plus className="h-4 w-4" /></Button></div>{error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}</CardContent></Card><Card><CardHeader><CardTitle>Activity</CardTitle></CardHeader><CardContent className="space-y-3">{tripExpenses.length === 0 && <p className="text-sm text-muted-foreground">No expenses yet.</p>}{tripExpenses.map((expense) => <div key={expense.id} className="flex items-center justify-between rounded-lg border p-4"><div><div className="font-medium">{expense.description}</div><div className="text-sm text-muted-foreground">Paid by {expense.payer} · {expense.date}</div></div><strong>${expense.amount.toFixed(2)}</strong></div>)}</CardContent></Card></div>
        <Card className="h-fit"><CardHeader><CardTitle>Total spend</CardTitle></CardHeader><CardContent><DollarSign className="mb-2 h-7 w-7 text-primary" /><div className="text-3xl font-bold">${total.toFixed(2)}</div><p className="mt-2 text-sm text-muted-foreground">Across {tripExpenses.length} expenses</p></CardContent></Card>
      </div>
    </div>
  );
}
