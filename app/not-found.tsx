import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Shield className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          {"The page you're looking for doesn't exist or has been moved."}
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
