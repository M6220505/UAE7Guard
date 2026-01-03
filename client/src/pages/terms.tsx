import { FileText, Shield, AlertTriangle, Scale, Users, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-terms-title">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Effective Date: January 2026</p>
          </div>
        </div>
        <p className="text-muted-foreground">
          By accessing CryptoGuard, you agree to these terms and conditions governing the use of our threat intelligence platform.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Service Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>CryptoGuard provides:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Real-time cryptocurrency address threat lookup</li>
              <li>Community-driven scam report submission and verification</li>
              <li>Reputation-based investigator network</li>
              <li>Emergency security protocols and audit logging</li>
              <li>Alert notifications for watchlisted addresses</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>As a user of CryptoGuard, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Accurate Reporting:</strong> Submit only truthful and verifiable information in scam reports</li>
              <li><strong>Evidence Standards:</strong> Provide credible evidence when reporting suspicious addresses</li>
              <li><strong>No False Reports:</strong> Not submit malicious or false reports to harm legitimate parties</li>
              <li><strong>Confidentiality:</strong> Protect sensitive information accessed through the platform</li>
              <li><strong>Compliance:</strong> Adhere to all applicable UAE laws and regulations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Disclaimers & Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Please be aware of the following:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>No Financial Advice:</strong> CryptoGuard does not provide financial, legal, or investment advice</li>
              <li><strong>Information Only:</strong> Threat data is provided for informational purposes and requires independent verification</li>
              <li><strong>No Guarantee:</strong> We do not guarantee the accuracy or completeness of all threat intelligence</li>
              <li><strong>Human Verification:</strong> All reports undergo human review but may contain errors</li>
              <li><strong>Third-Party Actions:</strong> We are not responsible for actions taken based on platform data</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Investigator Accountability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>For users with Investigator or Sentinel ranks:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Higher standards of evidence are expected for submitted reports</li>
              <li>Reputation points may be deducted for reports found to be inaccurate</li>
              <li>Repeated false reports will result in account suspension</li>
              <li>All investigator activities are logged for audit purposes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-primary" />
              Prohibited Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>The following activities are strictly prohibited:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Submitting false or misleading scam reports</li>
              <li>Attempting to manipulate reputation scores</li>
              <li>Unauthorized access to other users' data</li>
              <li>Using the platform to facilitate illegal activities</li>
              <li>Scraping or automated data extraction without permission</li>
              <li>Impersonating other users or CryptoGuard personnel</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Governing Law
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              These terms are governed by the laws of the United Arab Emirates. Any disputes arising from the use 
              of CryptoGuard shall be subject to the exclusive jurisdiction of the courts of the UAE.
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-6 border-t">
          <p>For legal inquiries, contact: legal@cryptoguard.ae</p>
          <p className="mt-2">Last updated: January 2026</p>
        </div>
      </div>
    </div>
  );
}
