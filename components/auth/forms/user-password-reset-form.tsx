// UserPasswordResetForm.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import Otp from "@/components/ui/otp";
// @ts-ignore
export function UserPasswordResetForm({ className }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleRequestOTP = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');

        const response = await fetch('http://127.0.0.1:5328/auth/request-reset', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (response.ok) {
            setOtpSent(true);
            setMessage('OTP sent to your email.');
        } else {
            setMessage(data.error || 'Failed to send OTP.');
        }
        setIsLoading(false);
    };

    const handleVerifyOTP = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');

        const response = await fetch('http://127.0.0.1:5328/auth/verify-otp', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, otp })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('email', email);
            localStorage.setItem('otp', otp);
            router.push('/auth/forgot-password/reset'); // Redirect to reset password page
        } else {
            setMessage(data.error || 'Failed to verify OTP.');
        }
        setIsLoading(false);
    };

    return (
        <div className={cn("grid gap-6", className)}>
            <p className="text-sm text-muted-foreground text-center">
                { otpSent ? 'The requested One-Time-Password has been sent to your email. Please enter the OTP below.'

                         : 'Enter your email below to request OTP.'}
            </p>
            <form onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP}>
                <div className="grid gap-2">
                    {!otpSent && (
                        <>
                            <Label className="sr-only" htmlFor="email">Email</Label>                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={isLoading}
                                placeholder="name@example.com"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                            />
                        </>
                    )}
                    {otpSent && (
                        <>
                            <div className="flex justify-center">
                                <Otp
                                    length={6}
                                    otp={parseInt(otp)}
                                    onOtpChange={(value) => {
                                        console.log('onChange called with value:', value);
                                        setOtp(value.toString());
                                        console.log('otp state variable:', otp);
                                    }}
                                />
                            </div>
                        </>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Loading...' : otpSent ? 'Verify OTP' : 'Request OTP'}
                    </Button>
                    {message && <p className={"text-center text-green-700"}>{message}</p>}
                </div>
            </form>
            {!otpSent && (
                <p className="px-8 text-center text-sm text-muted-foreground">
                    <Link
                        href="/auth/login"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        I remember my password
                    </Link>{" "}
                </p>
            )}
        </div>
    );
}
