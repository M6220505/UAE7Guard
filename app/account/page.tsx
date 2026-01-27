import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Home, LayoutDashboard, Search, BookOpen, User, Mail, Calendar, Bell, Lock, HelpCircle, FileText } from 'lucide-react'
import { SignOutButton } from '@/components/sign-out-button'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString('en-AE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown'

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
        <h1 className="text-2xl font-bold text-foreground mb-6">Account</h1>
        
        <Card className="border-border bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">Member since {createdAt}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined:</span>
                <span className="text-foreground">{createdAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              <Link href="/account/notifications" className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground flex-1">Notifications</span>
              </Link>
              <Link href="/auth/forgot-password" className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground flex-1">Change Password</span>
              </Link>
              <Link href="/help" className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground flex-1">Help & Support</span>
              </Link>
              <Link href="/terms" className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-foreground flex-1">Terms & Privacy</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6">
          UAE7Guard v1.0.0
        </p>
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
          <Link href="/verify" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
            <span className="text-xs">Verify</span>
          </Link>
          <Link href="/learn" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">Learn</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center gap-1 text-primary">
            <User className="h-5 w-5" />
            <span className="text-xs">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
