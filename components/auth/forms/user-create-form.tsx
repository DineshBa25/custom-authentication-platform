"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserCreateForm({ className, ...props }: UserAuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setpasswordConfirm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(""); // State for storing error messages

    const router = useRouter()


    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);
        setError(""); // Clear previous errors on new submission

        if (password !== passwordConfirm) {
            setError('Passwords do not match.')
            setIsLoading(false);
            return
        }

        try {

            const response = await fetch("http://127.0.0.1:5328/auth/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            console.log(data)
            if (response.ok) {
                // @ts-ignore
                router.push('/inbox', { scroll: false })
            } else {
                setError(data.message || 'An unexpected error occurred.'); // Display specific error or a generic message
            }
        } catch (error) {
            console.error('Error fetching:', error);
            setError('Failed to connect. Please try again later.'); // Network or server error
        }
        setIsLoading(false);
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    {error && <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>}
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                        <Label className="sr-only" htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <Label className="sr-only" htmlFor="password-confirm">Confirm Password</Label>
                        <Input
                            id="password-confirm"
                            placeholder="Confirm Password"
                            type="password"
                            value={passwordConfirm}
                            onChange={(e) => setpasswordConfirm(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading ? (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            "Register"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
