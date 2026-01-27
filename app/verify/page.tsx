import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Home, LayoutDashboard, Search, BookOpen, User } from 'lucide-react'
import { SignOutButton } from '@/components/sign-out-button'
import { VerifyForm } from '@/components/verify-form'

export default async function VerifyPage() {
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
        <h1 className="text-2xl font-bold text-foreground mb-6">Verify Guard</h1>
        
        <Card className="border-border bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Search Guard Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <VerifyForm />
          </CardContent>
        </Card>
      </main>
      
      <nav className="border-t border-border bg-card">
        <div className="flex justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link href="/verify" className="flex flex-col items-center gap-1 text-primary">
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
