import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
        <Link href="/auth/login">
            <Button variant="outline">Go to login</Button>
        </Link>
    </main>
  )
}
