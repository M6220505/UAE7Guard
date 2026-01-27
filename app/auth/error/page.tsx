import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-card-foreground">
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {params?.error ? (
              <p className="text-sm text-muted-foreground mb-4">
                Error: {params.error}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">
                An unspecified error occurred during authentication.
              </p>
            )}
            <Link 
              href="/auth/login" 
              className="text-primary hover:underline text-sm"
            >
              Try again
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
