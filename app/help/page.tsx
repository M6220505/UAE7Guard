import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, ArrowLeft, Mail, Phone, MessageCircle, FileQuestion, ChevronRight } from 'lucide-react'

const faqs = [
  {
    question: 'How do I verify a security guard?',
    answer: 'Go to the Verify tab, enter the guard\'s license number or Emirates ID, and click search.'
  },
  {
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot password?" on the login page, enter your email, and follow the instructions sent to your inbox.'
  },
  {
    question: 'How do I complete training courses?',
    answer: 'Navigate to the Learn tab, select a course, and complete all modules to earn your certificate.'
  },
  {
    question: 'Who can I contact for support?',
    answer: 'You can email us at support@uae7guard.ae or call our hotline during business hours.'
  }
]

export default function HelpPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b border-border bg-card p-4">
        <div className="flex items-center gap-4">
          <Link href="/account" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">Help & Support</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">How can we help?</h1>
        
        <Card className="border-border bg-card mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {faqs.map((faq, index) => (
                <details key={index} className="group">
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <span className="text-foreground font-medium pr-4">{faq.question}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform flex-shrink-0" />
                  </summary>
                  <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start bg-transparent" asChild>
              <a href="mailto:support@uae7guard.ae">
                <Mail className="mr-3 h-4 w-4 text-primary" />
                support@uae7guard.ae
              </a>
            </Button>
            <Button variant="outline" className="justify-start bg-transparent" asChild>
              <a href="tel:+97142345678">
                <Phone className="mr-3 h-4 w-4 text-primary" />
                +971 4 234 5678
              </a>
            </Button>
            <Button variant="outline" className="justify-start bg-transparent" asChild>
              <a href="https://wa.me/97142345678" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-3 h-4 w-4 text-primary" />
                WhatsApp Support
              </a>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
