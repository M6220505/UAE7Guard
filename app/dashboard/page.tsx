import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Home, LayoutDashboard, Search, BookOpen, User, LogOut } from 'lucide-react'
import { SignOutButton } from '@/components/sign-out-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">UAE7Guard</span>
          </div>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>
        
        <Card className="border-border bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Welcome back!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Signed in as: {user.email}
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-card-foreground flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                Verify Guards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Search and verify security guard credentials
              </p>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/verify">Start Verification</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base text-card-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Learning Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Access training materials and resources
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href="/learn">Browse Resources</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <nav className="border-t border-border bg-card">
        <div className="flex justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-primary">
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link href="/verify" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
            <span className="text-xs">Verify</span>
          </Link>
          <Link href="/learn" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Learn</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
            <User className="h-5 w-5" />
            <span className="text-xs">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
