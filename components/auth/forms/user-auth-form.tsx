'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from 'next/navigation';

// @ts-ignore
export default function UserAuthForm({ className, ...props }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const validateEmail = (email: string) => {
        // Simple email validation regex
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    async function onSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        if (!email || !password) {
            setError('Please enter your email and password.');
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5328/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                if (data.redirect !== false) {
                    router.push('/inbox');  // Redirect to inbox after successful login
                } else {
                    setError('Login successful');
                }
            } else {
                console.log(data);
                setError(data.message || 'Login failed. Please try again.');  // Show error message from server
            }
        } catch (error) {
            console.error('Login error:', error);
            // @ts-ignore
            setError(error.message || 'Network error. Please try again.');
        }

        setIsLoading(false);
    }

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');  // Reset error message when typing after error
        setter(e.target.value);
    };

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            value={email}
                            onChange={handleInputChange(setEmail)}
                            disabled={isLoading}
                        />
                        <Label className="sr-only" htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            placeholder="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handleInputChange(setPassword)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="show-password" checked={showPassword} onCheckedChange={(e) => setShowPassword(!showPassword)} />
                            <label htmlFor="show-password" className="text-sm font-medium">
                                Show password
                            </label>
                        </div>
                        <Link href="/auth/forgot-password" className="text-sm text-blue-500 hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <Button disabled={isLoading} className={"mt-3"}>
                        {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            "Sign In with Email"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
