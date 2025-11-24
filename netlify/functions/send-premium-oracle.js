/**
 * Netlify Function: Send Premium Oracle Reading Email
 * 
 * Triggered after successful Stripe checkout for premium oracle
 * Sends a comprehensive long-form reading with themes, mantra, and alignment path
 */

const { sendEmail, createEmailTemplate, escapeHtml } = require('../../lib/email');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    const { email, reading, zodiacSign, bundleUrl } = JSON.parse(event.body);
    
    // Validate required fields
    if (!email || !reading) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and reading are required' })
      };
    }
    
    // Default reading sections if not provided
    const defaultReading = {
      themes: escapeHtml(reading.themes || 'The cosmos reveals patterns of transformation and growth in your current journey.'),
      mantra: escapeHtml(reading.mantra || 'I align with the celestial flow and trust the wisdom of the universe.'),
      alignmentPath: escapeHtml(reading.alignmentPath || 'Your path forward is illuminated by the stars. Move with intention and grace.')
    };
    
    const recommendedBundle = bundleUrl || 'https://lyrion.co.uk/bundles/index.html';
    
    const content = `
      <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
        ✦ Your Premium Oracle Reading Has Arrived ✦
      </h2>
      
      <p style="color: #5a5856; margin-bottom: 30px; text-align: center;">
        Thank you for seeking deeper alignment. The Oracle has prepared this comprehensive reading, 
        channeling cosmic wisdom specifically for your journey.
      </p>
      
      <div style="margin: 40px 0;">
        <h3 style="color: #C4A449; font-size: 22px; margin-bottom: 15px; border-bottom: 2px solid #C4A449; padding-bottom: 10px;">
          ⋆ Celestial Themes
        </h3>
        <div style="background: linear-gradient(135deg, rgba(196, 164, 73, 0.05) 0%, rgba(244, 239, 232, 0.2) 100%); 
                    padding: 25px; 
                    border-radius: 10px; 
                    margin-bottom: 30px;">
          <p style="color: #151311; line-height: 1.9; font-size: 16px;">
            ${defaultReading.themes}
          </p>
        </div>
        
        <h3 style="color: #C4A449; font-size: 22px; margin-bottom: 15px; border-bottom: 2px solid #C4A449; padding-bottom: 10px;">
          ⋆ Your Sacred Mantra
        </h3>
        <div style="background: linear-gradient(135deg, rgba(196, 164, 73, 0.05) 0%, rgba(244, 239, 232, 0.2) 100%); 
                    padding: 25px; 
                    border-radius: 10px; 
                    margin-bottom: 30px;
                    text-align: center;">
          <p style="color: #C4A449; line-height: 1.9; font-size: 18px; font-style: italic; font-weight: 600;">
            "${defaultReading.mantra}"
          </p>
          <p style="color: #5a5856; font-size: 14px; margin-top: 15px;">
            Speak this aloud during your morning or evening ritual.
          </p>
        </div>
        
        <h3 style="color: #C4A449; font-size: 22px; margin-bottom: 15px; border-bottom: 2px solid #C4A449; padding-bottom: 10px;">
          ⋆ The Alignment Path
        </h3>
        <div style="background: linear-gradient(135deg, rgba(196, 164, 73, 0.05) 0%, rgba(244, 239, 232, 0.2) 100%); 
                    padding: 25px; 
                    border-radius: 10px; 
                    margin-bottom: 30px;">
          <p style="color: #151311; line-height: 1.9; font-size: 16px;">
            ${defaultReading.alignmentPath}
          </p>
        </div>
      </div>
      
      <div style="background-color: #f4efe8; padding: 30px; border-radius: 12px; margin: 40px 0; text-align: center;">
        <h3 style="color: #C4A449; font-size: 20px; margin-bottom: 15px;">
          Continue Your Alignment
        </h3>
        <p style="color: #5a5856; margin-bottom: 20px;">
          Deepen your cosmic journey with offerings aligned to your celestial path.
        </p>
        <a href="${recommendedBundle}" 
           class="button-gold" 
           style="display: inline-block; 
                  padding: 14px 32px; 
                  background-color: #C4A449; 
                  color: #151311; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: 600;">
          View Recommended Bundle ✧
        </a>
      </div>
      
      <p style="color: #5a5856; text-align: center; font-size: 14px; margin-top: 40px; font-style: italic;">
        May this reading illuminate your path and align you with the cosmic flow.
      </p>
    `;
    
    const html = createEmailTemplate(content, 'Your premium oracle reading is ready');
    
    // Send the email
    const result = await sendEmail({
      to: email,
      subject: 'Your Premium Oracle Reading Has Arrived ✧',
      html
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Premium oracle reading email sent',
        result 
      })
    };
    
  } catch (error) {
    console.error('Error sending premium oracle email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      })
    };
  }
};
