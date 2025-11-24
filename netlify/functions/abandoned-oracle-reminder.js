/**
 * Netlify Scheduled Function: Abandoned Oracle Reminder
 * 
 * Tracks users who opened the free oracle but didn't purchase premium reading
 * Sends a reminder after 24 hours with a £2 discount offer
 * 
 * To activate: Add this to netlify.toml:
 * [[functions]]
 *   path = "/functions/abandoned-oracle-reminder"
 *   schedule = "0 */6 * * *"  # Runs every 6 hours
 */

const { sendEmail, createEmailTemplate } = require('../../lib/email');

exports.handler = async (event, context) => {
  try {
    console.log('Running abandoned oracle reminder check...');
    
    // Get users who abandoned the oracle (placeholder)
    const abandonedUsers = await getAbandonedOracleUsers();
    
    const results = [];
    for (const user of abandonedUsers) {
      const emailResult = await sendAbandonedOracleEmail(user.email, user.name);
      results.push(emailResult);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Abandoned oracle reminders sent',
        count: results.length,
        results
      })
    };
    
  } catch (error) {
    console.error('Error in abandoned oracle reminder:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send reminders',
        details: error.message 
      })
    };
  }
};

/**
 * Get users who abandoned the oracle
 * Placeholder - integrate with your database
 */
async function getAbandonedOracleUsers() {
  // TODO: Query database for users who:
  // - Captured email on complimentary oracle 24+ hours ago
  // - Haven't purchased premium oracle yet
  // - Haven't been sent this reminder yet
  
  // Placeholder return
  return [];
  
  // Example with database:
  /*
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  
  const fortyEightHoursAgo = new Date();
  fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);
  
  return await db.collection('oracle_interactions')
    .find({
      complimentarySubmittedAt: {
        $gte: fortyEightHoursAgo,
        $lt: twentyFourHoursAgo
      },
      premiumPurchased: false,
      reminderSent: false
    })
    .toArray();
  */
}

/**
 * Send abandoned oracle reminder email with discount
 */
async function sendAbandonedOracleEmail(email, name = '') {
  const greeting = name ? `Dear ${name},` : 'Celestial Seeker,';
  
  // Generate a unique discount code (placeholder - integrate with Stripe)
  const discountCode = 'DEEPER2';
  
  const content = `
    <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
      ✦ A Deeper Alignment Awaits ✦
    </h2>
    
    <p style="color: #151311; margin-bottom: 20px;">
      ${greeting}
    </p>
    
    <p style="color: #5a5856; line-height: 1.8; margin-bottom: 20px;">
      Yesterday, you sought wisdom from our Complimentary Oracle. We hope the celestial guidance 
      offered you a glimpse of clarity and alignment.
    </p>
    
    <p style="color: #5a5856; line-height: 1.8; margin-bottom: 30px;">
      But the cosmos whispers that there is more to reveal — deeper insights waiting to illuminate 
      your path. Our <strong style="color: #C4A449;">Premium Oracle Reading</strong> offers a 
      comprehensive journey through your celestial themes, sacred mantra, and alignment path.
    </p>
    
    <div style="background: linear-gradient(135deg, rgba(196, 164, 73, 0.15) 0%, rgba(244, 239, 232, 0.4) 100%); 
                padding: 30px; 
                border-radius: 12px; 
                margin: 30px 0;
                text-align: center;
                border: 2px solid #C4A449;">
      <h3 style="color: #C4A449; font-size: 24px; margin-bottom: 15px;">
        ✧ Special Cosmic Offer ✧
      </h3>
      <p style="color: #151311; font-size: 18px; font-weight: 600; margin-bottom: 10px;">
        Save £2 on Your Premium Reading
      </p>
      <p style="color: #5a5856; font-size: 14px; margin-bottom: 20px;">
        This exclusive offer is valid for the next 24 hours only.
      </p>
      <div style="background-color: rgba(21, 19, 17, 0.05); 
                  padding: 15px; 
                  border-radius: 8px; 
                  display: inline-block;
                  margin: 15px 0;">
        <p style="color: #C4A449; font-size: 20px; font-weight: 600; letter-spacing: 2px; margin: 0;">
          ${discountCode}
        </p>
      </div>
      <p style="color: #5a5856; font-size: 12px; margin-top: 10px;">
        Use this code at checkout
      </p>
    </div>
    
    <div style="margin: 40px 0;">
      <h4 style="color: #C4A449; font-size: 18px; margin-bottom: 15px;">
        Your Premium Reading Includes:
      </h4>
      <ul style="color: #5a5856; line-height: 2; list-style: none; padding: 0;">
        <li style="margin-bottom: 10px;">✦ In-depth Celestial Themes analysis</li>
        <li style="margin-bottom: 10px;">✦ Personalized Sacred Mantra for daily practice</li>
        <li style="margin-bottom: 10px;">✦ Detailed Alignment Path guidance</li>
        <li style="margin-bottom: 10px;">✦ Curated product recommendations</li>
        <li style="margin-bottom: 10px;">✦ Delivered to your inbox for reflection</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="https://lyrion.co.uk/oracle/premium.html?code=${discountCode}" 
         class="button-gold" 
         style="display: inline-block; 
                padding: 14px 32px; 
                background-color: #C4A449; 
                color: #151311; 
                text-decoration: none; 
                border-radius: 6px; 
                font-weight: 600;">
        Claim Your Reading ✧
      </a>
    </div>
    
    <p style="color: #5a5856; text-align: center; font-size: 13px; margin-top: 40px; font-style: italic;">
      This offer expires in 24 hours. The stars align but once.
    </p>
  `;
  
  const html = createEmailTemplate(content, 'Unlock deeper cosmic wisdom with £2 off your Premium Oracle Reading');
  
  return await sendEmail({
    to: email,
    subject: 'A Deeper Alignment Awaits — £2 Off Premium Oracle ✧',
    html
  });
}

// Export for testing
module.exports.sendAbandonedOracleEmail = sendAbandonedOracleEmail;
