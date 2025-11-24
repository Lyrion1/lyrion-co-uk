/**
 * LYRĪON Email Utility
 * 
 * Centralized email sending functionality for oracle readings, order confirmations,
 * and marketing campaigns. Placeholder implementation - integrate with SendGrid, Resend, or EmailJS.
 */

/**
 * Send an email using the configured email provider
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML content of the email
 * @param {string} options.from - Sender email (optional, uses default)
 * @returns {Promise<Object>} Result of email send operation
 */
async function sendEmail({ to, subject, html, from }) {
  // Default sender
  const sender = from || 'oracle@lyrion.co.uk';
  
  console.log('📧 Sending email:', { to, subject, from: sender });
  
  // TODO: Integrate with email provider (SendGrid, Resend, or EmailJS)
  // Example with SendGrid:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to,
    from: sender,
    subject,
    html
  };
  
  return await sgMail.send(msg);
  */
  
  // Example with Resend:
  /*
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  return await resend.emails.send({
    from: sender,
    to,
    subject,
    html
  });
  */
  
  // Placeholder response for development
  return {
    success: true,
    message: 'Email queued (placeholder mode)',
    details: {
      to,
      subject,
      from: sender,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Create a beautiful HTML email template wrapper
 * @param {string} content - Main email content (HTML)
 * @param {string} preheader - Preview text shown in inbox
 * @returns {string} Complete HTML email
 */
function createEmailTemplate(content, preheader = '') {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>LYRĪON Celestial Couture</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Georgia', 'Playfair Display', serif;
      background-color: #f4efe8;
      color: #151311;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .email-header {
      text-align: center;
      padding: 40px 20px 20px;
      background: linear-gradient(135deg, #151311 0%, #2a2622 100%);
    }
    .email-logo {
      color: #C4A449;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: 2px;
    }
    .email-content {
      padding: 40px 30px;
      line-height: 1.8;
    }
    .email-footer {
      text-align: center;
      padding: 30px 20px;
      background-color: #f4efe8;
      font-size: 12px;
      color: #5a5856;
    }
    .button-gold {
      display: inline-block;
      padding: 14px 32px;
      background-color: #C4A449;
      color: #151311;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    h2 {
      color: #C4A449;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .preheader {
      display: none;
      max-height: 0;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div class="preheader">${preheader}</div>
  <div class="email-container">
    <div class="email-header">
      <div class="email-logo">LYRĪON ✧</div>
      <div style="color: #C4A449; font-size: 12px; margin-top: 10px; letter-spacing: 1px;">CELESTIAL COUTURE</div>
    </div>
    <div class="email-content">
      ${content}
    </div>
    <div class="email-footer">
      <p>LYRĪON Celestial Couture<br>
      Crafted in England, Aligned with the Stars</p>
      <p style="margin-top: 10px;">
        <a href="https://lyrion.co.uk" style="color: #C4A449; text-decoration: none;">Visit our Celestial House</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

module.exports = {
  sendEmail,
  createEmailTemplate
};
