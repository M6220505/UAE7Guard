import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Home, LayoutDashboard, Search, BookOpen, User, FileText, Video, Award, ChevronRight } from 'lucide-react'
import { SignOutButton } from '@/components/sign-out-button'

const learningResources = [
  {
    id: 1,
    title: 'Security Guard Fundamentals',
    description: 'Basic training for security personnel',
    type: 'course',
    icon: FileText,
    modules: 8,
    duration: '4 hours'
  },
  {
    id: 2,
    title: 'Emergency Response Protocol',
    description: 'How to handle emergency situations',
    type: 'video',
    icon: Video,
    modules: 5,
    duration: '2 hours'
  },
  {
    id: 3,
    title: 'UAE Security Regulations',
    description: 'Legal requirements and compliance',
    type: 'course',
    icon: FileText,
    modules: 6,
    duration: '3 hours'
  },
  {
    id: 4,
    title: 'Certification Preparation',
    description: 'Prepare for your certification exam',
    type: 'exam',
    icon: Award,
    modules: 10,
    duration: '5 hours'
  }
]

export default async function LearnPage() {
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
        <h1 className="text-2xl font-bold text-foreground mb-2">Learning Center</h1>
        <p className="text-muted-foreground mb-6">Access training materials and resources</p>
        
        <div className="grid gap-4">
          {learningResources.map((resource) => {
            const IconComponent = resource.icon
            return (
              <Card key={resource.id} className="border-border bg-card hover:bg-card/80 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{resource.description}</p>
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{resource.modules} modules</span>
                        <span className="text-xs text-muted-foreground">{resource.duration}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="border-border bg-card mt-6">
          <CardHeader>
            <CardTitle className="text-base text-card-foreground">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed Courses</span>
                <span className="text-foreground font-medium">0 / 4</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }} />
              </div>
              <p className="text-xs text-muted-foreground">
                Complete all courses to earn your certificate
              </p>
            </div>
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
          <Link href="/verify" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
            <span className="text-xs">Verify</span>
          </Link>
          <Link href="/learn" className="flex flex-col items-center gap-1 text-primary">
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
