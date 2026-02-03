"use client"

import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          {/* UAE7Guard Logo */}
          <div className="relative h-10 w-10">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="url(#logoGradient)" />
              <path d="M20 8L28 13V22L20 27L12 22V13L20 8Z" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M20 12L25 15V21L20 24L15 21V15L20 12Z" stroke="#22D3EE" strokeWidth="1.5" fill="none" />
              <circle cx="20" cy="18" r="2" fill="#22D3EE" />
              <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0EA5E9" />
                  <stop offset="1" stopColor="#0891B2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-xl font-bold">UAE7Guard</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>العربية</span>
          </button>

          {/* Theme Toggle */}
          <button className="text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
