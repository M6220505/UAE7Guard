import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Home, LayoutDashboard, Search, BookOpen, User } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">UAE7Guard</h1>
          <p className="text-muted-foreground mb-8">
            Your trusted security guard verification app
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <nav className="border-t border-border bg-card">
        <div className="flex justify-around py-3">
          <Link href="/" className="flex flex-col items-center gap-1 text-primary">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
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
