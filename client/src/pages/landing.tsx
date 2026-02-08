import { Link } from "wouter";
import { Shield, TrendingUp, Lock, Zap, Users, Globe, CheckCircle, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">UAE7Guard</span>
            </a>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-slate-400 hover:text-white transition">Features</a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition">Pricing</a>
            <a href="#about" className="text-slate-400 hover:text-white transition">About</a>
            <Link href="/login">
              <a className="text-slate-400 hover:text-white transition">Login</a>
            </Link>
            <Link href="/signup">
              <Button className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-6">
            <Star className="w-4 h-4" />
            Trusted by 1,250+ Users
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Protect Your Crypto
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              From Scams
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Enterprise-grade fraud detection powered by AI. Real-time threat intelligence across all major blockchains.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/verify">
              <Button size="lg" variant="outline" className="text-lg px-8 border-slate-700 hover:border-green-500">
                Check Address Now
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-white mb-1">125K+</div>
              <div className="text-sm text-slate-400">Wallets Checked</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">8.5K</div>
              <div className="text-sm text-slate-400">Scams Detected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">$42M</div>
              <div className="text-sm text-slate-400">Value Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Protection</h2>
          <p className="text-slate-400 text-lg">Everything you need to stay safe in crypto</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Real-Time Detection"
            description="Check any blockchain address against 3+ scam databases instantly"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="AI-Powered Analysis"
            description="Machine learning identifies patterns from $14B+ in documented scams"
          />
          <FeatureCard
            icon={<Lock className="w-8 h-8" />}
            title="Secure Escrow"
            description="Smart contract protection for P2P transactions with dispute resolution"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Live Monitoring"
            description="Real-time alerts for suspicious transactions on your wallets"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Community Reports"
            description="Crowdsourced intelligence from verified community members"
          />
          <FeatureCard
            icon={<Globe className="w-8 h-8" />}
            title="Multi-Chain Support"
            description="Ethereum, Polygon, Arbitrum, Bitcoin, and 10+ networks"
          />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
          <p className="text-slate-400 text-lg">Choose the plan that fits your needs</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <PricingCard
            name="Free"
            price="$0"
            features={[
              "100 wallet checks/month",
              "Basic scam database",
              "Community reports",
              "Email alerts"
            ]}
          />
          <PricingCard
            name="Basic"
            price="$9.99"
            features={[
              "Unlimited wallet checks",
              "50 AI analyses/month",
              "Live monitoring (3 wallets)",
              "Transaction analysis",
              "Email + SMS alerts"
            ]}
          />
          <PricingCard
            name="Pro"
            price="$29.99"
            popular
            features={[
              "Everything in Basic",
              "Unlimited AI analysis",
              "Live monitoring (20 wallets)",
              "API access (1000/day)",
              "Priority support",
              "Advanced patterns"
            ]}
          />
          <PricingCard
            name="Enterprise"
            price="$199"
            features={[
              "Everything in Pro",
              "Unlimited everything",
              "White-label option",
              "SLA guarantee",
              "24/7 support",
              "Custom integrations"
            ]}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Protect Your Assets?
          </h2>
          <p className="text-green-50 text-lg mb-8 max-w-2xl mx-auto">
            Join 1,250+ users who trust UAE7Guard to keep their crypto safe
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-green-500" />
                <span className="font-bold text-white">UAE7Guard</span>
              </div>
              <p className="text-slate-400 text-sm">
                Enterprise-grade crypto fraud detection platform
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><Link href="/verify"><a className="hover:text-white">Verify Address</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/api-docs" className="hover:text-white">API Docs</a></li>
                <li><a href="#" className="hover:text-white">Case Studies</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="mailto:support@uae7guard.com" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400 text-sm">
            © 2026 UAE7Guard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-green-500/50 transition">
      <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, features, popular }: { name: string; price: string; features: string[]; popular?: boolean }) {
  return (
    <div className={`p-6 rounded-2xl ${popular ? 'bg-gradient-to-b from-green-600 to-emerald-600 shadow-2xl shadow-green-500/20 scale-105' : 'bg-slate-900/50 border border-slate-800'}`}>
      {popular && (
        <div className="text-xs font-semibold text-green-100 mb-2">MOST POPULAR</div>
      )}
      <h3 className={`text-2xl font-bold mb-2 ${popular ? 'text-white' : 'text-white'}`}>{name}</h3>
      <div className="mb-6">
        <span className={`text-4xl font-bold ${popular ? 'text-white' : 'text-white'}`}>{price}</span>
        <span className={`${popular ? 'text-green-100' : 'text-slate-400'}`}>/month</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle className={`w-5 h-5 flex-shrink-0 ${popular ? 'text-green-100' : 'text-green-500'}`} />
            <span className={`text-sm ${popular ? 'text-green-50' : 'text-slate-300'}`}>{feature}</span>
          </li>
        ))}
      </ul>
      <Link href="/signup">
        <Button className={`w-full ${popular ? 'bg-white text-green-600 hover:bg-green-50' : 'bg-green-600 hover:bg-green-700'}`}>
          Get Started
        </Button>
      </Link>
    </div>
  );
}
