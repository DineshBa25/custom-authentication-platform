// pages/app/auth/forgot-password/reset/page.tsx

import React from 'react';
import { UserPasswordResetUpdateForm } from "@/components/auth/forms/user-password-reset-update-form";
import Link from "next/link";

const PasswordResetPage = () => {
    return (
        <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">

                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Reset your password
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your new password below
                    </p>
                </div>
                 <UserPasswordResetUpdateForm className={undefined} />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    <Link
                        href="/help/making-a-secure-password"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Learn how to make a secure password
                    </Link>{" "}
                </p>
            </div>
        </div>
    );
};

export default PasswordResetPage;
