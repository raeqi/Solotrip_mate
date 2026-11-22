"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
    const [isPaying, setIsPaying] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const router = useRouter();

    const handlePayment = async () => {
        setIsPaying(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsPaying(false);
            setPaymentComplete(true);
        }, 2000);
    };

    if (paymentComplete) {
        return (
            <div className="container mx-auto max-w-md py-20">
                <Card className="text-center">
                    <CardContent className="pt-10 pb-10">
                        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                        <p className="text-muted-foreground mb-6">
                            Your settlement has been processed.
                        </p>
                        <Button onClick={() => router.push("/trips/1")}>
                            Back to Trip
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-md py-20">
            <Card>
                <CardHeader>
                    <CardTitle>Settle Payment</CardTitle>
                    <CardDescription>
                        Complete your payment to settle expenses
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">Pay Alex</div>
                                <div className="text-sm text-muted-foreground">Trip expenses</div>
                            </div>
                        </div>
                        <div className="text-2xl font-bold">$37.50</div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                            <CreditCard className="h-5 w-5" />
                            <div className="flex-1">
                                <div className="font-medium">Credit Card</div>
                                <div className="text-sm text-muted-foreground">•••• 4242</div>
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handlePayment}
                        disabled={isPaying}
                    >
                        {isPaying ? "Processing..." : "Pay $37.50"}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        Powered by Stripe. Your payment is secure.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
