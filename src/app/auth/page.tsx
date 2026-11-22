"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Github } from "lucide-react";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSocialLogin = async (provider: 'google' | 'github') => {
        // Force demo mode for localhost/preview if no real Supabase URL is set
        // or if we explicitly want to demo the UI flow
        const isDemo = true; // Forcing demo mode for user review

        if (isDemo) {
            // Simulate a delay
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                // Redirect to dashboard for demo purposes
                router.push("/dashboard");
            }, 1000);
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : "Unable to sign in.");
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Demo mode check for email/password flow
        const isDemo = true;

        if (isDemo) {
            setTimeout(() => {
                setLoading(false);
                if (isLogin) {
                    // Simulate login -> Dashboard
                    router.push("/dashboard");
                } else {
                    // Simulate signup -> Profile creation
                    alert("Demo: Account created! Redirecting to profile setup...");
                    router.push("/profile");
                }
            }, 1000);
            return;
        }

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Check if profile exists, if not redirect to profile creation
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('nickname')
                        .eq('id', user.id)
                        .single();

                    if (!profile?.nickname) {
                        router.push("/profile");
                    } else {
                        router.push("/dashboard");
                    }
                }
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert("Check your email for the confirmation link!");
            }
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : "Unable to complete authentication.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-md py-20">
            <Card>
                <CardHeader>
                    <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
                    <CardDescription>
                        {isLogin ? "Sign in to your account" : "Sign up to get started"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <Button variant="outline" onClick={() => handleSocialLogin('google')}>
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                            Google
                        </Button>
                        <Button variant="outline" onClick={() => handleSocialLogin('github')}>
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                        </Button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary hover:underline"
                        >
                            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
