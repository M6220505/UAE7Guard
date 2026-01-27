'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react'

type VerificationResult = {
  found: boolean
  data?: {
    name: string
    licenseNumber: string
    status: 'active' | 'expired' | 'suspended'
    expiryDate: string
    company: string
  }
}

export function VerifyForm() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Demo data - replace with actual database query
      if (searchQuery.toLowerCase().includes('demo') || searchQuery === '123456') {
        setResult({
          found: true,
          data: {
            name: 'Ahmed Mohammed',
            licenseNumber: 'UAE-SG-123456',
            status: 'active',
            expiryDate: '2025-12-31',
            company: 'SecureGuard UAE LLC'
          }
        })
      } else {
        setResult({ found: false })
      }
    } catch {
      setError('Failed to verify. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="search" className="text-muted-foreground">
            License Number or Emirates ID
          </Label>
          <div className="flex gap-2">
            <Input
              id="search"
              type="text"
              placeholder="Enter license number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !searchQuery.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {result && (
        <Card className={`border ${result.found ? 'border-primary/50 bg-primary/5' : 'border-destructive/50 bg-destructive/5'}`}>
          <CardContent className="pt-6">
            {result.found && result.data ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Guard Verified</span>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="text-foreground font-medium">{result.data.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License</span>
                    <span className="text-foreground font-medium">{result.data.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`font-medium ${
                      result.data.status === 'active' ? 'text-primary' : 
                      result.data.status === 'expired' ? 'text-yellow-500' : 'text-destructive'
                    }`}>
                      {result.data.status.charAt(0).toUpperCase() + result.data.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiry</span>
                    <span className="text-foreground font-medium">{result.data.expiryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company</span>
                    <span className="text-foreground font-medium">{result.data.company}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                <span className="font-semibold">No Guard Found</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Enter license number or Emirates ID to verify guard credentials.
        For demo, try "demo" or "123456".
      </p>
    </div>
  )
}
