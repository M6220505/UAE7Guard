// SendGrid Email Service Integration
// Used for sending threat alerts, report confirmations, and registration emails

import sgMail from '@sendgrid/mail';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=sendgrid',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key || !connectionSettings.settings.from_email)) {
    throw new Error('SendGrid not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, email: connectionSettings.settings.from_email };
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
export async function getUncachableSendGridClient() {
  const { apiKey, email } = await getCredentials();
  sgMail.setApiKey(apiKey);
  return {
    client: sgMail,
    fromEmail: email
  };
}

// Email Templates
interface ThreatAlertEmail {
  to: string;
  walletAddress: string;
  threatLevel: 'safe' | 'suspicious' | 'dangerous';
  details: string;
}

interface ReportConfirmationEmail {
  to: string;
  reportId: number;
  walletAddress: string;
  status: 'pending' | 'verified' | 'rejected';
}

interface WelcomeEmail {
  to: string;
  firstName: string;
}

interface PasswordResetEmail {
  to: string;
  resetToken: string;
  firstName?: string;
}

// Send threat alert notification
export async function sendThreatAlert(data: ThreatAlertEmail): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableSendGridClient();
    
    const threatColors = {
      safe: '#22c55e',
      suspicious: '#eab308',
      dangerous: '#ef4444'
    };

    const threatLabels = {
      safe: 'آمن / Safe',
      suspicious: 'مشبوه / Suspicious',
      dangerous: 'خطير / Dangerous'
    };

    const msg = {
      to: data.to,
      from: fromEmail,
      subject: `🚨 UAE7Guard - تنبيه تهديد جديد / New Threat Alert`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1a1a2e;">UAE7Guard</h1>
            <p style="color: #666;">نظام حماية العملات المشفرة</p>
          </div>
          
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">تنبيه تهديد جديد / New Threat Alert</h2>
            
            <div style="background: white; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
              <p style="margin: 0 0 10px 0;"><strong>عنوان المحفظة / Wallet Address:</strong></p>
              <p style="font-family: monospace; background: #eee; padding: 10px; border-radius: 4px; word-break: break-all;">
                ${data.walletAddress}
              </p>
            </div>
            
            <div style="background: ${threatColors[data.threatLevel]}; color: white; padding: 10px 15px; border-radius: 6px; text-align: center; margin-bottom: 15px;">
              <strong>مستوى التهديد / Threat Level: ${threatLabels[data.threatLevel]}</strong>
            </div>
            
            <div style="background: white; border-radius: 6px; padding: 15px;">
              <p style="margin: 0 0 10px 0;"><strong>التفاصيل / Details:</strong></p>
              <p style="margin: 0; color: #555;">${data.details}</p>
            </div>
          </div>
          
          <div style="text-align: center; color: #888; font-size: 12px;">
            <p>هذا البريد تم إرساله تلقائياً من UAE7Guard</p>
            <p>This email was sent automatically from UAE7Guard</p>
          </div>
        </div>
      `
    };

    await client.send(msg);
    console.log('Threat alert email sent to:', data.to);
    return true;
  } catch (error) {
    console.error('Failed to send threat alert email:', error);
    return false;
  }
}

// Send report status confirmation
export async function sendReportConfirmation(data: ReportConfirmationEmail): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableSendGridClient();
    
    const statusMessages = {
      pending: {
        ar: 'قيد المراجعة',
        en: 'Under Review',
        color: '#eab308'
      },
      verified: {
        ar: 'تم التحقق',
        en: 'Verified',
        color: '#22c55e'
      },
      rejected: {
        ar: 'مرفوض',
        en: 'Rejected',
        color: '#ef4444'
      }
    };

    const status = statusMessages[data.status];

    const msg = {
      to: data.to,
      from: fromEmail,
      subject: `UAE7Guard - تحديث حالة البلاغ #${data.reportId} / Report Status Update`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1a1a2e;">UAE7Guard</h1>
            <p style="color: #666;">نظام حماية العملات المشفرة</p>
          </div>
          
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">تحديث حالة البلاغ / Report Status Update</h2>
            
            <div style="background: white; border-radius: 6px; padding: 15px; margin-bottom: 15px;">
              <p style="margin: 0 0 10px 0;"><strong>رقم البلاغ / Report ID:</strong> #${data.reportId}</p>
              <p style="margin: 0 0 10px 0;"><strong>عنوان المحفظة / Wallet Address:</strong></p>
              <p style="font-family: monospace; background: #eee; padding: 10px; border-radius: 4px; word-break: break-all;">
                ${data.walletAddress}
              </p>
            </div>
            
            <div style="background: ${status.color}; color: white; padding: 10px 15px; border-radius: 6px; text-align: center;">
              <strong>الحالة / Status: ${status.ar} / ${status.en}</strong>
            </div>
          </div>
          
          <div style="text-align: center; color: #888; font-size: 12px;">
            <p>شكراً لمساهمتك في حماية المجتمع</p>
            <p>Thank you for helping protect the community</p>
          </div>
        </div>
      `
    };

    await client.send(msg);
    console.log('Report confirmation email sent to:', data.to);
    return true;
  } catch (error) {
    console.error('Failed to send report confirmation email:', error);
    return false;
  }
}

// Send welcome email after registration
export async function sendWelcomeEmail(data: WelcomeEmail): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableSendGridClient();

    const msg = {
      to: data.to,
      from: fromEmail,
      subject: `مرحباً بك في UAE7Guard / Welcome to UAE7Guard`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1a1a2e;">UAE7Guard</h1>
            <p style="color: #666;">نظام حماية العملات المشفرة</p>
          </div>
          
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">مرحباً ${data.firstName}! / Welcome ${data.firstName}!</h2>
            
            <p style="color: #555; line-height: 1.6;">
              شكراً لانضمامك إلى UAE7Guard. نحن سعداء بوجودك معنا في مهمتنا لحماية مجتمع العملات المشفرة.
            </p>
            <p style="color: #555; line-height: 1.6;">
              Thank you for joining UAE7Guard. We're glad to have you with us in our mission to protect the crypto community.
            </p>
            
            <div style="background: white; border-radius: 6px; padding: 15px; margin-top: 20px;">
              <h3 style="color: #333; margin-bottom: 10px;">ماذا يمكنك فعله الآن؟ / What can you do now?</h3>
              <ul style="color: #555; padding-left: 20px;">
                <li>التحقق من عناوين المحافظ / Verify wallet addresses</li>
                <li>الإبلاغ عن العناوين المشبوهة / Report suspicious addresses</li>
                <li>تعلم المزيد عن أنواع الاحتيال / Learn about scam types</li>
                <li>مراقبة محافظك المفضلة / Monitor your favorite wallets</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="https://uae7guard.com" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              ابدأ الآن / Get Started
            </a>
          </div>
          
          <div style="text-align: center; color: #888; font-size: 12px; margin-top: 30px;">
            <p>UAE7Guard - حماية مجتمع العملات المشفرة</p>
          </div>
        </div>
      `
    };

    await client.send(msg);
    console.log('Welcome email sent to:', data.to);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

// Send password reset email
export async function sendPasswordResetEmail(data: PasswordResetEmail): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableSendGridClient();

    const resetLink = `${process.env.APP_URL || 'https://uae7guard.com'}/reset-password?token=${data.resetToken}`;
    const greeting = data.firstName ? `${data.firstName}` : 'User';

    const msg = {
      to: data.to,
      from: fromEmail,
      subject: `UAE7Guard - إعادة تعيين كلمة المرور / Password Reset`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #1a1a2e;">UAE7Guard</h1>
            <p style="color: #666;">نظام حماية العملات المشفرة</p>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">مرحباً ${greeting}! / Hello ${greeting}!</h2>

            <p style="color: #555; line-height: 1.6;">
              لقد طلبت إعادة تعيين كلمة المرور الخاصة بك. اضغط على الزر أدناه لإعادة تعيين كلمة المرور.
            </p>
            <p style="color: #555; line-height: 1.6;">
              You requested to reset your password. Click the button below to reset your password.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display: inline-block; background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                إعادة تعيين كلمة المرور / Reset Password
              </a>
            </div>

            <p style="color: #888; font-size: 13px; line-height: 1.5;">
              إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.
            </p>
            <p style="color: #888; font-size: 13px; line-height: 1.5;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>

            <div style="background: white; border-radius: 6px; padding: 15px; margin-top: 20px;">
              <p style="margin: 0; color: #666; font-size: 12px;">
                <strong>رابط إعادة التعيين / Reset Link:</strong><br/>
                <span style="word-break: break-all; font-family: monospace; font-size: 11px;">${resetLink}</span>
              </p>
            </div>

            <p style="color: #ef4444; font-size: 12px; margin-top: 15px;">
              ⚠️ هذا الرابط صالح لمدة ساعة واحدة فقط / This link expires in 1 hour
            </p>
          </div>

          <div style="text-align: center; color: #888; font-size: 12px;">
            <p>UAE7Guard - حماية مجتمع العملات المشفرة</p>
            <p>Protecting the crypto community</p>
          </div>
        </div>
      `
    };

    await client.send(msg);
    console.log('Password reset email sent to:', data.to);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}

// Send generic notification email
export async function sendNotificationEmail(
  to: string, 
  subject: string, 
  htmlContent: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableSendGridClient();

    const msg = {
      to,
      from: fromEmail,
      subject,
      html: htmlContent
    };

    await client.send(msg);
    console.log('Notification email sent to:', to);
    return true;
  } catch (error) {
    console.error('Failed to send notification email:', error);
    return false;
  }
}
