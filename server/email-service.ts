/**
 * Email Service for UAE7Guard
 * Supports Gmail SMTP and SendGrid
 */

import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Email configuration
const EMAIL_CONFIG = {
  provider: process.env.EMAIL_PROVIDER || 'gmail',
  gmail: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || '',
    },
  },
  from: process.env.EMAIL_FROM || 'noreply@uae7guard.com',
  support: process.env.EMAIL_SUPPORT || 'support@uae7guard.com',
  admin: process.env.EMAIL_ADMIN || 'admin@uae7guard.com',
};

// Create transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport(EMAIL_CONFIG.gmail);
  }
  return transporter;
}

/**
 * Send email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transport = getTransporter();
    
    await transport.sendMail({
      from: `UAE7Guard <${EMAIL_CONFIG.from}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || stripHtml(options.html),
    });
    
    console.log(`[EMAIL] Sent to ${options.to}: ${options.subject}`);
    return true;
  } catch (error) {
    console.error('[EMAIL] Error sending:', error);
    return false;
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  const subject = 'Welcome to UAE7Guard! 🛡️';
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛡️ Welcome to UAE7Guard!</h1>
    </div>
    <div class="content">
      <h2>Hi ${name},</h2>
      <p>Welcome to UAE7Guard - your trusted partner in crypto security! 🎉</p>
      
      <p>You now have access to:</p>
      <ul>
        <li>✅ Real-time scam detection across 10+ blockchains</li>
        <li>✅ AI-powered risk analysis</li>
        <li>✅ Live wallet monitoring & alerts</li>
        <li>✅ Secure escrow for P2P transactions</li>
      </ul>
      
      <p style="text-align: center;">
        <a href="https://uae7guard.com/dashboard" class="button">Go to Dashboard →</a>
      </p>
      
      <p><strong>Next Steps:</strong></p>
      <ol>
        <li>Verify your first wallet address</li>
        <li>Set up live monitoring</li>
        <li>Explore our Learning Center</li>
      </ol>
      
      <p>Need help? Reply to this email or contact <a href="mailto:${EMAIL_CONFIG.support}">${EMAIL_CONFIG.support}</a></p>
      
      <p>Stay safe,<br><strong>The UAE7Guard Team</strong></p>
    </div>
    <div class="footer">
      <p>UAE7Guard - Enterprise Crypto Fraud Detection</p>
      <p>🌐 <a href="https://uae7guard.com">uae7guard.com</a></p>
    </div>
  </div>
</body>
</html>
  `;
  
  return sendEmail({ to, subject, html });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string
): Promise<boolean> {
  const resetUrl = `https://uae7guard.com/reset-password?token=${resetToken}`;
  const subject = 'Reset Your UAE7Guard Password';
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 10px; }
    .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h2>🔐 Reset Your Password</h2>
      <p>We received a request to reset your UAE7Guard password.</p>
      
      <p style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset Password →</a>
      </p>
      
      <p>Or copy this link: <code>${resetUrl}</code></p>
      
      <div class="warning">
        <strong>⚠️ Security Notice:</strong><br>
        - This link expires in 1 hour<br>
        - If you didn't request this, ignore this email<br>
        - Never share this link with anyone
      </div>
      
      <p>Need help? Contact <a href="mailto:${EMAIL_CONFIG.support}">${EMAIL_CONFIG.support}</a></p>
      
      <p>Best regards,<br><strong>UAE7Guard Security Team</strong></p>
    </div>
  </div>
</body>
</html>
  `;
  
  return sendEmail({ to, subject, html });
}

/**
 * Send scam alert email
 */
export async function sendScamAlertEmail(
  to: string,
  address: string,
  network: string,
  riskLevel: string
): Promise<boolean> {
  const subject = `🚨 Scam Alert: Suspicious Activity Detected`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .alert { background: #fee2e2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .details { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; font-family: monospace; }
    .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="alert">
      <h2>🚨 Scam Alert!</h2>
      <p><strong>Suspicious activity detected on monitored wallet</strong></p>
    </div>
    
    <div class="details">
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Network:</strong> ${network}</p>
      <p><strong>Risk Level:</strong> <span style="color: #ef4444;">${riskLevel}</span></p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    </div>
    
    <p><strong>Recommended Actions:</strong></p>
    <ul>
      <li>🛑 Do not interact with this address</li>
      <li>🔍 Review transaction history</li>
      <li>📝 Report if you have additional information</li>
      <li>🔒 Secure your assets immediately</li>
    </ul>
    
    <p style="text-align: center;">
      <a href="https://uae7guard.com/verification?address=${address}" class="button">View Details →</a>
    </p>
    
    <p>Stay vigilant,<br><strong>UAE7Guard Security Team</strong></p>
  </div>
</body>
</html>
  `;
  
  return sendEmail({ to, subject, html });
}

/**
 * Send subscription confirmation
 */
export async function sendSubscriptionEmail(
  to: string,
  plan: string,
  amount: number
): Promise<boolean> {
  const subject = `✅ Subscription Confirmed - ${plan} Plan`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .details { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="success">
      <h2>✅ Subscription Activated!</h2>
      <p>Thank you for upgrading to <strong>${plan}</strong></p>
    </div>
    
    <div class="details">
      <p><strong>Plan:</strong> ${plan}</p>
      <p><strong>Amount:</strong> $${amount}/month</p>
      <p><strong>Billing Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Next Billing:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
    </div>
    
    <p><strong>You now have access to:</strong></p>
    <ul>
      <li>✅ Unlimited wallet verification</li>
      <li>✅ AI-powered analysis</li>
      <li>✅ Live monitoring</li>
      <li>✅ Priority support</li>
    </ul>
    
    <p>Manage your subscription: <a href="https://uae7guard.com/dashboard">Dashboard</a></p>
    
    <p>Thank you for trusting UAE7Guard!<br><strong>The Team</strong></p>
  </div>
</body>
</html>
  `;
  
  return sendEmail({ to, subject, html });
}

/**
 * Test email configuration
 */
export async function testEmailConnection(): Promise<boolean> {
  try {
    const transport = getTransporter();
    await transport.verify();
    console.log('[EMAIL] Connection verified successfully');
    return true;
  } catch (error) {
    console.error('[EMAIL] Connection failed:', error);
    return false;
  }
}

/**
 * Strip HTML tags from text
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
