import PDFDocument from "pdfkit";
import { SovereignReport } from "./sovereign-report";

function getRiskColorHex(riskLevel: string): string {
  switch (riskLevel.toLowerCase()) {
    case "critical":
      return "#ef4444";
    case "high":
      return "#f97316";
    case "moderate":
      return "#eab308";
    case "low":
      return "#22c55e";
    default:
      return "#6b7280";
  }
}

export function generatePDFReport(report: SovereignReport): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        info: {
          Title: `UAE7Guard Report - ${report.reportId}`,
          Author: "UAE7Guard",
          Subject: "Wallet Verification Report",
          Keywords: "blockchain, verification, risk, UAE7Guard",
        },
      });

      const buffers: Buffer[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      const pageWidth = 595.28;
      const contentWidth = pageWidth - 100;
      const riskColor = getRiskColorHex(report.riskAssessment.riskLevel);

      doc
        .rect(0, 0, pageWidth, 120)
        .fill("#1a1a2e");

      doc
        .fontSize(28)
        .fillColor("#ffffff")
        .text("UAE7GUARD", 50, 40, { align: "center" });

      doc
        .fontSize(14)
        .fillColor("#a0a0a0")
        .text("SOVEREIGN VERIFICATION REPORT", 50, 75, { align: "center" });

      doc
        .fontSize(10)
        .fillColor("#666666")
        .text(`Report ID: ${report.reportId}`, 50, 140);

      const generatedDate = new Date(report.generatedAt).toLocaleString("en-AE", {
        timeZone: "Asia/Dubai",
        dateStyle: "full",
        timeStyle: "short",
      });
      doc.text(`Generated: ${generatedDate} (UAE Time)`, 50, 155);

      const expiresDate = new Date(report.expiresAt).toLocaleString("en-AE", {
        timeZone: "Asia/Dubai",
        dateStyle: "medium",
      });
      doc.text(`Valid Until: ${expiresDate}`, 50, 170);

      doc
        .rect(50, 195, contentWidth, 80)
        .fill(riskColor);

      doc
        .fontSize(16)
        .fillColor("#ffffff")
        .text("RISK ASSESSMENT", 70, 210);

      doc
        .fontSize(36)
        .text(`${report.riskAssessment.riskScore}/100`, 70, 230);

      doc
        .fontSize(14)
        .text(report.riskAssessment.riskLevel.toUpperCase(), 200, 240);

      let yPos = 295;

      doc
        .fontSize(14)
        .fillColor("#1a1a2e")
        .text("SUBJECT WALLET", 50, yPos);

      yPos += 25;
      doc
        .fontSize(10)
        .fillColor("#333333")
        .text(`Address: ${report.subject.walletAddress}`, 50, yPos);

      yPos += 15;
      doc.text(`Transaction Value: AED ${report.subject.transactionValueAED.toLocaleString()}`, 50, yPos);

      yPos += 15;
      doc.text(`Network: ${report.subject.network.toUpperCase()}`, 50, yPos);

      yPos += 30;
      doc
        .moveTo(50, yPos)
        .lineTo(50 + contentWidth, yPos)
        .strokeColor("#e0e0e0")
        .stroke();

      yPos += 20;
      doc
        .fontSize(14)
        .fillColor("#1a1a2e")
        .text("BLOCKCHAIN INTELLIGENCE", 50, yPos);

      yPos += 25;
      doc
        .fontSize(10)
        .fillColor("#333333")
        .text(`Balance: ${report.blockchainIntelligence.balance}`, 50, yPos);

      yPos += 15;
      doc.text(`Transaction Count: ${report.blockchainIntelligence.transactionCount}`, 50, yPos);

      yPos += 15;
      doc.text(`Smart Contract: ${report.blockchainIntelligence.isSmartContract ? "Yes" : "No"}`, 50, yPos);

      yPos += 15;
      doc.text(`Data Source: ${report.blockchainIntelligence.dataSource}`, 50, yPos);

      yPos += 30;
      doc
        .moveTo(50, yPos)
        .lineTo(50 + contentWidth, yPos)
        .strokeColor("#e0e0e0")
        .stroke();

      yPos += 20;
      doc
        .fontSize(14)
        .fillColor("#1a1a2e")
        .text("RISK ANALYSIS BREAKDOWN", 50, yPos);

      yPos += 25;
      doc
        .fontSize(10)
        .fillColor("#333333")
        .text(`Formula: ${report.riskAssessment.formula}`, 50, yPos);

      yPos += 15;
      doc.text(`History Score: ${report.riskAssessment.components.historyScore}`, 50, yPos);

      yPos += 15;
      doc.text(`Association Score: ${report.riskAssessment.components.associationScore}`, 50, yPos);

      yPos += 15;
      doc.text(`Wallet Age Factor: ${report.riskAssessment.components.walletAgeFactor.toFixed(2)}`, 50, yPos);

      if (report.aiIntelligence) {
        yPos += 30;
        doc
          .moveTo(50, yPos)
          .lineTo(50 + contentWidth, yPos)
          .strokeColor("#e0e0e0")
          .stroke();

        yPos += 20;
        doc
          .fontSize(14)
          .fillColor("#1a1a2e")
          .text("AI INTELLIGENCE", 50, yPos);

        yPos += 25;
        doc
          .fontSize(10)
          .fillColor("#333333")
          .text(`Model: ${report.aiIntelligence.modelUsed}`, 50, yPos);

        yPos += 15;
        doc.text("Analysis:", 50, yPos);
        yPos += 15;
        doc.text(report.aiIntelligence.analysis, 60, yPos, { width: contentWidth - 20 });

        yPos = doc.y + 15;
        doc.text("Recommendation:", 50, yPos);
        yPos += 15;
        doc.text(report.aiIntelligence.recommendation, 60, yPos, { width: contentWidth - 20 });
      }

      yPos = doc.y + 30;
      doc
        .moveTo(50, yPos)
        .lineTo(50 + contentWidth, yPos)
        .strokeColor("#e0e0e0")
        .stroke();

      yPos += 20;
      doc
        .fontSize(14)
        .fillColor("#1a1a2e")
        .text("THREAT DATABASE", 50, yPos);

      yPos += 25;
      doc
        .fontSize(10)
        .fillColor("#333333")
        .text(`Verified Threats: ${report.threatDatabase.verifiedThreats}`, 50, yPos);

      yPos += 15;
      doc.text(`Database: ${report.threatDatabase.database}`, 50, yPos);

      yPos += 30;
      doc
        .moveTo(50, yPos)
        .lineTo(50 + contentWidth, yPos)
        .strokeColor("#e0e0e0")
        .stroke();

      yPos += 20;
      doc
        .fontSize(14)
        .fillColor("#1a1a2e")
        .text("AUDIT TRAIL", 50, yPos);

      yPos += 25;
      doc
        .fontSize(8)
        .fillColor("#666666")
        .text(`Transaction Hash: ${report.auditTrail.transactionHash}`, 50, yPos);

      yPos += 12;
      doc.text(`Data Hash: ${report.auditTrail.dataHash}`, 50, yPos);

      yPos += 12;
      doc.text(`Encrypted At: ${report.auditTrail.encryptedAt}`, 50, yPos);

      yPos += 12;
      doc.text(`Storage: ${report.auditTrail.storageLocation}`, 50, yPos);

      yPos += 30;
      doc
        .rect(50, yPos, contentWidth, 80)
        .fill("#f5f5f5");

      yPos += 10;
      doc
        .fontSize(8)
        .fillColor("#666666")
        .text("LEGAL DISCLAIMER", 60, yPos);

      yPos += 12;
      doc
        .fontSize(7)
        .fillColor("#888888")
        .text(report.legalDisclaimer.en, 60, yPos, {
          width: contentWidth - 20,
          align: "justify",
        });

      const footerY = 800;
      doc
        .moveTo(50, footerY)
        .lineTo(50 + contentWidth, footerY)
        .strokeColor("#e0e0e0")
        .stroke();

      doc
        .fontSize(8)
        .fillColor("#999999")
        .text(
          "This report is cryptographically signed and stored in UAE7Guard Encrypted Vault",
          50,
          footerY + 10,
          { align: "center" }
        );

      doc
        .fontSize(8)
        .text("www.uae7guard.com | support@uae7guard.com", 50, footerY + 22, {
          align: "center",
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
