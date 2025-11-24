/**
 * Netlify Function: Send Complimentary Oracle Reading Email
 * 
 * Triggered after generating a complimentary oracle reading
 * Sends the user an email with their poetic response and links to zodiac products
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
    const { email, reading, zodiacSign } = JSON.parse(event.body);
    
    // Validate required fields
    if (!email || !reading) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and reading are required' })
      };
    }
    
    // Build the email content
    const zodiacUrl = zodiacSign 
      ? `https://lyrion.co.uk/zodiac/${escapeHtml(zodiacSign.toLowerCase())}.html`
      : 'https://lyrion.co.uk/shop.html?collection=zodiac-wardrobe';
    
    const content = `
      <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
        ✦ Your Celestial Whisper Awaits ✦
      </h2>
      
      <p style="color: #5a5856; margin-bottom: 24px;">
        The Oracle has spoken. Below is your complimentary reading, crafted from the cosmic energies 
        surrounding your question.
      </p>
      
      <div style="background: linear-gradient(135deg, rgba(196, 164, 73, 0.1) 0%, rgba(244, 239, 232, 0.3) 100%); 
                  padding: 30px; 
                  border-radius: 12px; 
                  border-left: 4px solid #C4A449; 
                  margin: 30px 0;">
        <p style="color: #151311; line-height: 1.9; font-size: 16px; font-style: italic;">
          ${escapeHtml(reading)}
        </p>
      </div>
      
      <p style="color: #5a5856; margin: 30px 0 20px;">
        This reading is but a glimpse into the celestial wisdom available to you. 
        Deepen your alignment with offerings designed for your cosmic journey.
      </p>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="${zodiacUrl}" 
           class="button-gold" 
           style="display: inline-block; 
                  padding: 14px 32px; 
                  background-color: #C4A449; 
                  color: #151311; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: 600;
                  margin: 10px;">
          View ${zodiacSign ? escapeHtml(zodiacSign) : 'Zodiac'} Collection ✧
        </a>
        
        <a href="https://lyrion.co.uk/oracle/premium.html" 
           class="button-gold" 
           style="display: inline-block; 
                  padding: 14px 32px; 
                  background-color: #151311; 
                  color: #C4A449; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  font-weight: 600;
                  margin: 10px;">
          Unlock Premium Reading
        </a>
      </div>
      
      <p style="color: #5a5856; text-align: center; font-size: 14px; margin-top: 40px;">
        May the stars guide your path.
      </p>
    `;
    
    const html = createEmailTemplate(content, 'Your complimentary oracle reading has arrived');
    
    // Send the email
    const result = await sendEmail({
      to: email,
      subject: 'Your Celestial Whisper Awaits ✧',
      html
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Oracle reading email sent',
        result 
      })
    };
    
  } catch (error) {
    console.error('Error sending oracle email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      })
    };
  }
};
