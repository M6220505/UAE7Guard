import { Link } from "wouter";
import { Shield, Lock, Eye, Users, Award, FileCheck, ChevronRight, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThreatSearch } from "@/components/threat-search";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    icon: Eye,
    title: "Real-Time Intelligence",
    description: "Instant address lookup against our verified threat database with sub-second response times.",
  },
  {
    icon: Lock,
    title: "AES-256 Encryption",
    description: "Enterprise-grade Galois/Counter Mode encryption protecting all sensitive data and API keys.",
  },
  {
    icon: Users,
    title: "Sovereign Network",
    description: "Reputation-based community of verified investigators ranking from Novice to Sentinel.",
  },
  {
    icon: Award,
    title: "Human Verification",
    description: "Every threat report undergoes admin verification before blacklist inclusion.",
  },
  {
    icon: FileCheck,
    title: "Audit Trail",
    description: "Complete forensic documentation of all security actions for compliance and legal purposes.",
  },
  {
    icon: Zap,
    title: "Emergency Protocol",
    description: "Step-by-step crisis management SOP with automated documentation for rapid response.",
  },
];

const trustIndicators = [
  { label: "AES-256 Encrypted", icon: Lock },
  { label: "PDPL Compliant", icon: FileCheck },
  { label: "Real-Time Intelligence", icon: Zap },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight">DubaiVerified</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/reports" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Reports
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Leaderboard
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button data-testid="button-enter-platform">
                Enter Platform
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="container relative mx-auto px-4 text-center">
            <Badge className="mb-6" variant="secondary">
              <Globe className="mr-1 h-3 w-3" />
              Institutional Digital Asset Protection
            </Badge>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Sovereign Crypto
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Intelligence Platform
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Enterprise-grade threat detection and fraud prevention for institutional investors.
              Real-time intelligence. Verified network. Absolute security.
            </p>

            <div className="mx-auto mt-10 max-w-xl">
              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Threat Lookup
                  </h3>
                  <ThreatSearch />
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              {trustIndicators.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Institutional-Grade Protection
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Built for investors, institutions, and enterprises requiring sovereign security and regulatory compliance.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="group transition-all hover-elevate">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Ready to Secure Your Assets?</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join the sovereign intelligence network protecting institutional crypto investments across the UAE.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" data-testid="button-access-dashboard">
                  Access Dashboard
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/reports">
                <Button size="lg" variant="outline" data-testid="button-submit-intelligence">
                  Submit Intelligence
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">DubaiVerified</span>
          </div>
          <p className="text-sm text-muted-foreground">
            PDPL Compliant. UAE Federal Decree-Law No. 45 of 2021.
          </p>
        </div>
      </footer>
    </div>
  );
}
