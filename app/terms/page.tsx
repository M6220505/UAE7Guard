import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b border-border bg-card p-4">
        <div className="flex items-center gap-4">
          <Link href="/account" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">Terms & Privacy</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-2xl font-bold text-foreground mb-6">Terms of Service</h1>
          
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              By accessing and using UAE7Guard, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Use of Service</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              UAE7Guard is a security guard verification platform designed for authorized users in the United Arab Emirates. 
              You agree to use this service only for lawful purposes and in accordance with UAE regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3">3. User Account</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. 
              You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <h1 className="text-2xl font-bold text-foreground mb-6 mt-12">Privacy Policy</h1>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We collect information you provide directly to us, such as your name, email address, and any other information you choose to provide. 
              We also collect usage data to improve our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, 
              to communicate with you, and to comply with legal obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Data Security</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, 
              alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Contact Us</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              If you have any questions about these Terms or our Privacy Policy, please contact us at privacy@uae7guard.ae
            </p>
          </section>

          <p className="text-xs text-muted-foreground mt-8">
            Last updated: January 2026
          </p>
        </div>
      </main>
    </div>
  )
}
