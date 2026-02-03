"use client"

import { useState } from "react"
import { Header } from "@/components/ui/header"
import { BottomNav } from "@/components/ui/bottom-nav"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function VerifyPage() {
  const [walletAddress, setWalletAddress] = useState("")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-6 pb-24">
        <div className="mx-auto max-w-lg space-y-6">
          {/* AI Scam Prediction */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                <h2 className="font-semibold">AI Scam Prediction</h2>
                <p className="text-xs text-muted-foreground">Advanced AI-powered fraud detection and risk analysis</p>
              </div>
              <span className="ml-auto rounded bg-blue-500/10 px-2 py-1 text-xs text-blue-500">
                Powered by GPT-4
              </span>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">1. Analyze Wallet</p>
                    <p className="text-sm font-medium">Take time to process to get AI-powered prediction</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Real-time Certifications</p>
                    <p className="text-sm font-medium">Instant verification results</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Input */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Wallet Address</h3>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="0x.. or bc1.. or similar"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono text-sm"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                Verify
              </Button>
            </div>
          </div>

          {/* Verification Phases */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Verification Process</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Phase 1: Raw Data</p>
                  <p className="text-sm font-medium">Alchemy Supernode</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Phase 2: AI Analysis</p>
                  <p className="text-sm font-medium">GPT-4o Model</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
