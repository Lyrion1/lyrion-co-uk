/**
 * Minimal email helpers.
 * If RESEND_API_KEY is set, send via Resend; otherwise log (DRY-RUN).
 */

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Send an email using Resend API or log in DRY-RUN mode
 * @param {Object} options - Email options
 * @param {string|string[]} options.to - Recipient email(s)
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @param {string} [options.from] - Sender email
 * @returns {Promise<Object>} - Result object
 */
async function sendEmail({ to, subject, html, from }) {
  const sender = from || process.env.EMAIL_FROM || "LYRĪON <no-reply@lyrion.co.uk>";
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({ from: sender, to: Array.isArray(to) ? to : [to], subject, html })
      });
      if (!res.ok) {
        console.error("Resend error:", await res.text());
        return { success: false, error: "Resend API error" };
      }
      return { success: true };
    } catch (e) {
      console.error("Email send failure:", e.message);
      return { success: false, error: e.message };
    }
  } else {
    console.log("DRY-RUN email →", { to, subject });
    return { success: true, dryRun: true };
  }
}

/**
 * Create a styled HTML email template
 * @param {string|Object} content - Email content (string or object with title/lines)
 * @param {string} [preheader] - Optional preheader text
 * @returns {string} - Complete HTML email
 */
function createEmailTemplate(content, preheader = '') {
  // Handle legacy object format { title, lines }
  let bodyContent = content;
  if (typeof content === 'object' && content !== null) {
    const { title, lines = [] } = content;
    const body = lines.map(l => `<p>${escapeHtml(l)}</p>`).join("");
    bodyContent = `<h2>${escapeHtml(title || '')}</h2>${body}`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LYRĪON</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Georgia', serif; background-color: #f4efe8;">
  ${preheader ? `<span style="display: none; font-size: 0; max-height: 0; overflow: hidden;">${escapeHtml(preheader)}</span>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4efe8;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #151311 0%, #2a2826 100%);">
              <h1 style="color: #C4A449; font-size: 32px; margin: 0; letter-spacing: 3px;">LYRĪON</h1>
              <p style="color: #f4efe8; font-size: 12px; margin-top: 10px; letter-spacing: 2px;">CELESTIAL ALIGNMENT</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              ${bodyContent}
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f4efe8;">
              <p style="color: #5a5856; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} LYRĪON · Celestial Alignment
              </p>
              <p style="color: #5a5856; font-size: 11px; margin-top: 10px;">
                <a href="https://lyrion.co.uk" style="color: #C4A449; text-decoration: none;">lyrion.co.uk</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { sendEmail, createEmailTemplate, escapeHtml };
