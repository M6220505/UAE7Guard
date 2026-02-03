"use client"

import { useState } from "react"
import { Header } from "@/components/ui/header"
import { BottomNav } from "@/components/ui/bottom-nav"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-8 pb-24">
        <div className="mx-auto max-w-lg space-y-8">
          {/* Hero */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold leading-tight">
              Instant <span className="text-blue-500">Crypto</span>
              <br />Safety.
            </h1>
            <h2 className="text-xl font-semibold">
              Protect Yourself from
              <br />Crypto Scams
            </h2>
            <p className="text-sm text-muted-foreground">
              Verify wallet addresses against known scam reports. Check before you send.
            </p>
          </div>

          {/* Wallet Check */}
          <div className="space-y-3">
            <p className="text-center text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Check Wallet Address
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <Input
                  type="text"
                  placeholder="Enter wallet address (0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
              </Button>
            </div>
          </div>

          {/* Security Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>UAE Data Protection Compliant</span>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
