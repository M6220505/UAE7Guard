import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-card-foreground">
              Thank you for signing up!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Check your email to confirm
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {"You've successfully signed up. Please check your email to confirm your account before signing in."}
            </p>
            <Link 
              href="/auth/login" 
              className="text-primary hover:underline text-sm"
            >
              Return to login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
