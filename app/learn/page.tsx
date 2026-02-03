"use client"

import { Header } from "@/components/ui/header"
import { BottomNav } from "@/components/ui/bottom-nav"

const articles = [
  {
    title: "Know the Signs. Avoid the Scams",
    description: "Learn how to identify common cryptocurrency scam patterns",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
  },
  {
    title: "Trusted. Compliant. Secure",
    description: "Understanding UAE7Guard's security measures",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
  },
  {
    title: "How Blockchain Verification Works",
    description: "Deep dive into Alchemy Supernode integration",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
    ),
  },
  {
    title: "AI-Powered Risk Analysis",
    description: "How GPT-4o detects suspicious activity",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ),
  },
]

const securityFeatures = [
  { label: "AES-256 Encrypted", icon: "lock" },
  { label: "UAE Data Protection Compliant", icon: "shield" },
  { label: "Real-Time Protection", icon: "zap" },
  { label: "Know Your Customer (KYC)", icon: "user" },
]

export default function LearnPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-6 pb-24">
        <div className="mx-auto max-w-lg space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Learn</h1>
            <p className="text-sm text-muted-foreground">Educational resources about crypto safety</p>
          </div>

          {/* Articles */}
          <div className="space-y-3">
            {articles.map((article) => (
              <button
                key={article.title}
                className="flex w-full items-start gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  {article.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">{article.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Security Features */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-4 font-semibold">UAE7Guard Security</h3>
            <div className="space-y-3">
              {securityFeatures.map((feature) => (
                <div key={feature.label} className="flex items-center gap-3 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    {feature.icon === "lock" && (
                      <>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </>
                    )}
                    {feature.icon === "shield" && (
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    )}
                    {feature.icon === "zap" && (
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    )}
                    {feature.icon === "user" && (
                      <>
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </>
                    )}
                  </svg>
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
