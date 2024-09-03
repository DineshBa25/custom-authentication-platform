'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {cn} from "@/lib/utils";
import {Checkbox} from "@/components/ui/checkbox";
import Link from "next/link";

// @ts-ignore
export function UserPasswordResetUpdateForm({className}) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // @ts-ignore
    const email = localStorage.getItem('email');
    const otp = localStorage.getItem('otp');

    const router = useRouter();
    useEffect(() => {
        // Optional: Perform actions when searchParams changes, if needed.
        console.log("Email and OTP from URL:", { email, otp });
    }, [email, otp]);

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        const response = await fetch('http://127.0.0.1:5328/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp, password })
        });
        const data = await response.json();
        setMessage(data.message);
        if (response.ok) {
            // Navigate to login or another page
            router.push('/auth/login');
            // Ensure navigation is properly handled
        } else {
            setMessage(data.error || 'Failed to reset password.');
        }
        setIsLoading(false);
    };

    return (
        <div className={cn("grid gap-6", className)}>
        <form onSubmit={handleSubmit} className={"grid gap-1"}>
            {message && <p className={"text-center text-red-700"}>{message}</p>}
            <Label className="sr-only" htmlFor="password">Password</Label>
            <Input
                id="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
            />
            <Label className="sr-only" htmlFor="password-confirm">Confirm Password</Label>
            <Input
                id="confirmPassword"
                placeholder="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
            />
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Checkbox id="show-password" checked={showPassword} onCheckedChange={(e) => setShowPassword(!showPassword)} />
                    <label htmlFor="show-password" className="text-sm font-medium">
                        Show password
                    </label>
                </div>
            </div>
            <Button type="submit" disabled={isLoading} className={"mt-5"}>
                {isLoading ? 'Loading...' : 'Reset Password'}
            </Button>
        </form>
        </div>
    );
}
