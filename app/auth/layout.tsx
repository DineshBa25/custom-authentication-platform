// app/auth/layout.tsx
import Image from "next/image"
import Link from "next/link"
import {ModeToggle} from "@/components/app-utils/theme-switcher";
import {Button} from "@/components/ui/button";

// @ts-ignore
export default function Layout({ children }) {
    return (
        <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="absolute right-4 top-4 md:right-8 md:top-8 flex items-center space-x-4">
                <ModeToggle />
                <Button asChild variant={"secondary"}>
                    <Link href="/auth/login">
                        Login
                    </Link>
                </Button>
            </div>
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900 auth-bg-image" />
                <div className="relative z-20 flex items-center text-lg font-medium gap-2">
                    <Image src={"/brand/TCMS Complicated Logo Only.png"} alt={"TCMS Logo"} width={50} height={50} className={"pl-3"}/>
                    <span className="text-main-color text-3xl font-bold">Mail</span>
                    <span className="text-gray-400 text-lg">by Total Control</span>
                </div>
            </div>
            {children}
        </div>
    )
}