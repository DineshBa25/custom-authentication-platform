import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import UserAuthForm from "@/components/auth/forms/user-auth-form"

export const metadata: Metadata = {
    title: "Login",
    description: "Login to MailTC using email or by logging in with google.",
}

export default function AuthenticationPage() {
    return (
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Sign in to your account
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your email and password below
                            </p>
                        </div>
                        <UserAuthForm className={undefined} />
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            <Link
                                href="/auth/create"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Dont have an account? Sign up
                            </Link>{" "}
                        </p>
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