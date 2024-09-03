import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserPasswordResetForm } from "@/components/auth/forms/user-password-reset-form"

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset password using email."
}

export default function ForgotPasswordPage() {
    return (
        <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Reset your password
                    </h1>
                </div>
                <UserPasswordResetForm className={undefined} />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    <Link
                        href="/sign-in-help"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Get help signing in
                    </Link>{" "}
                </p>
            </div>
        </div>
    )
}