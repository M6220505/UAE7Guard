import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">UAE7Guard</h1>
        <p className="mt-4 text-muted-foreground">
          Production-ready security and monitoring system
        </p>
      </div>

      <div className="flex gap-4">
        {user ? (
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/api/health">Health Check</Link>
        </Button>
      </div>

      <div className="mt-8 grid max-w-2xl gap-4 text-center sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Security</h3>
          <p className="text-sm text-muted-foreground">Headers, CORS, rate limiting</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Monitoring</h3>
          <p className="text-sm text-muted-foreground">Logging, metrics, health checks</p>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="font-semibold">Auth</h3>
          <p className="text-sm text-muted-foreground">Sessions, roles, protection</p>
        </div>
      </div>
    </main>
  )
}
