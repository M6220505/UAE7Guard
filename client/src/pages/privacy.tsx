import { Shield, Lock, Eye, FileText, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-privacy-title">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">PDPL Compliant - UAE Federal Decree Law No. 45 of 2021</p>
          </div>
        </div>
        <p className="text-muted-foreground">
          UAE7Guard is committed to protecting your personal data in accordance with the UAE Personal Data Protection Law (PDPL).
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Data Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>We collect the following categories of data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Account Information:</strong> Username, email address, and encrypted authentication credentials</li>
              <li><strong>Threat Reports:</strong> Wallet addresses reported as suspicious, scam type, evidence, and amounts involved</li>
              <li><strong>Activity Logs:</strong> Security actions taken, timestamp records for audit compliance</li>
              <li><strong>Reputation Data:</strong> Trust scores, verified reports count, and rank progression</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>We implement enterprise-grade security measures:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>AES-256-GCM Encryption:</strong> All sensitive data is encrypted at rest using advanced encryption standards</li>
              <li><strong>Secure Transmission:</strong> All data is transmitted over TLS 1.3 encrypted connections</li>
              <li><strong>Access Controls:</strong> Role-based access control (RBAC) limits data access to authorized personnel</li>
              <li><strong>Audit Trails:</strong> Comprehensive logging of all security-related actions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Your Rights Under PDPL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Under UAE PDPL, you have the following rights:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Right to Access:</strong> Request a copy of your personal data held by us</li>
              <li><strong>Right to Rectification:</strong> Correct any inaccurate personal data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal requirements)</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to processing of your personal data for specific purposes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Legal Basis for Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>We process your data based on:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Contractual Necessity:</strong> To provide the threat intelligence services you requested</li>
              <li><strong>Legitimate Interest:</strong> To protect the cryptocurrency community from fraud</li>
              <li><strong>Legal Obligation:</strong> To comply with UAE laws and regulatory requirements</li>
              <li><strong>Consent:</strong> Where required, we obtain your explicit consent before processing</li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-6 border-t">
          <p>For data protection inquiries, contact: privacy@dubaiverified.com</p>
          <p className="mt-2">Last updated: January 2026</p>
        </div>
      </div>
    </div>
  );
}
