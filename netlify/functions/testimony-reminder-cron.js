/**
 * Netlify Scheduled Function: Testimony Reminder for Chamber of Echoes
 * 
 * Runs daily to check for premium oracle purchases made 7 days ago
 * Sends reminder email to share their experience in the Chamber of Echoes
 * 
 * To activate: Add this to netlify.toml:
 * [[functions]]
 *   path = "/functions/testimony-reminder-cron"
 *   schedule = "0 10 * * *"
 *   (Runs daily at 10 AM UTC)
 */

const { sendEmail, createEmailTemplate } = require('../../lib/email');

exports.handler = async (event, context) => {
  try {
    // In production, this would:
    // 1. Query database for premium oracle purchases from 7 days ago
    // 2. Filter for users who haven't left testimony yet
    // 3. Send reminder emails
    
    // Placeholder implementation
    console.log('Running testimony reminder cron job...');
    
    // Example: Get users from database (placeholder)
    const usersToRemind = await getUsersForReminder();
    
    const results = [];
    for (const user of usersToRemind) {
      const emailResult = await sendTestimonyReminder(user.email, user.name);
      results.push(emailResult);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Testimony reminders sent',
        count: results.length,
        results
      })
    };
    
  } catch (error) {
    console.error('Error in testimony reminder cron:', error);
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
 * Get users who need testimony reminders
 * Placeholder - integrate with your database
 */
async function getUsersForReminder() {
  // TODO: Query database for users who:
  // - Purchased premium oracle reading exactly 7 days ago
  // - Haven't submitted a testimony yet
  
  // Placeholder return
  return [];
  
  // Example with database:
  /*
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return await db.collection('oracle_purchases')
    .find({
      purchaseDate: {
        $gte: sevenDaysAgo,
        $lt: new Date(sevenDaysAgo.getTime() + 24 * 60 * 60 * 1000)
      },
      testimonySubmitted: false
    })
    .toArray();
  */
}

/**
 * Send testimony reminder email
 */
async function sendTestimonyReminder(email, name = '') {
  const greeting = name ? `Dear ${name},` : 'Celestial Seeker,';
  
  const content = `
    <h2 style="color: #C4A449; font-size: 28px; text-align: center; margin-bottom: 30px;">
      ✦ Has the Universe Spoken? ✦
    </h2>
    
    <p style="color: #151311; margin-bottom: 20px;">
      ${greeting}
    </p>
    
    <p style="color: #5a5856; line-height: 1.8; margin-bottom: 20px;">
      Seven days have passed since you received your Premium Oracle Reading. 
      We hope the cosmic wisdom has illuminated your path and brought clarity to your journey.
    </p>
    
    <p style="color: #5a5856; line-height: 1.8; margin-bottom: 30px;">
      If the Oracle's guidance has resonated with you, we invite you to share your experience 
      in our <strong style="color: #C4A449;">Chamber of Echoes</strong> — a sacred space where seekers 
      reflect on how celestial wisdom has manifested in their lives.
    </p>
    
    <div style="background: linear-gradient(135deg, rgba(196, 164, 73, 0.1) 0%, rgba(244, 239, 232, 0.3) 100%); 
                padding: 25px; 
                border-radius: 12px; 
                margin: 30px 0;
                text-align: center;">
      <p style="color: #C4A449; font-size: 18px; font-weight: 600; margin-bottom: 15px;">
        Your voice matters in the cosmic tapestry
      </p>
      <p style="color: #5a5856; font-size: 14px; line-height: 1.7;">
        By sharing your testimony, you contribute to the collective wisdom that guides 
        others on their celestial journey.
      </p>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="https://lyrion.co.uk/oracle/chamber-of-echoes.html" 
         class="button-gold" 
         style="display: inline-block; 
                padding: 14px 32px; 
                background-color: #C4A449; 
                color: #151311; 
                text-decoration: none; 
                border-radius: 6px; 
                font-weight: 600;">
        Share Your Experience ✧
      </a>
    </div>
    
    <p style="color: #5a5856; text-align: center; font-size: 14px; margin-top: 40px; font-style: italic;">
      With gratitude and celestial blessings.
    </p>
  `;
  
  const html = createEmailTemplate(content, 'Share your oracle experience with the community');
  
  return await sendEmail({
    to: email,
    subject: 'Has the Universe Spoken? ✧',
    html
  });
}

// Export for testing
module.exports.sendTestimonyReminder = sendTestimonyReminder;
