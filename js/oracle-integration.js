/**
 * LYRĪON Oracle Email Integration
 * 
 * Helper functions to integrate email sending with oracle readings
 * Use these functions when implementing the oracle form handlers
 */

/**
 * Send complimentary oracle reading email
 * @param {string} email - User's email address
 * @param {string} reading - The oracle reading text
 * @param {string} zodiacSign - Optional zodiac sign
 * @returns {Promise<Object>} Result of email send
 */
async function sendComplimentaryOracleEmail(email, reading, zodiacSign = '') {
  try {
    const response = await fetch('/.netlify/functions/send-complimentary-oracle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        reading,
        zodiacSign
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send oracle email');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending complimentary oracle email:', error);
    throw error;
  }
}

/**
 * Send premium oracle reading email
 * @param {string} email - User's email address
 * @param {Object} reading - Reading object with themes, mantra, alignmentPath
 * @param {string} zodiacSign - Optional zodiac sign
 * @param {string} bundleUrl - Optional recommended bundle URL
 * @returns {Promise<Object>} Result of email send
 */
async function sendPremiumOracleEmail(email, reading, zodiacSign = '', bundleUrl = '') {
  try {
    const response = await fetch('/.netlify/functions/send-premium-oracle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        reading,
        zodiacSign,
        bundleUrl
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send premium oracle email');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending premium oracle email:', error);
    throw error;
  }
}

/**
 * Track abandoned oracle interaction for later follow-up
 * Store user email when they engage with complimentary oracle
 * @param {string} email - User's email address
 * @param {string} name - Optional user name
 */
async function trackOracleInteraction(email, name = '') {
  // TODO: Implement database tracking
  // This should store:
  // - email
  // - name (optional)
  // - timestamp
  // - complimentarySubmitted: true
  // - premiumPurchased: false
  // - reminderSent: false
  
  console.log('Tracking oracle interaction for:', email);
  
  // For now, store in localStorage as placeholder
  // Check if localStorage is available
  if (typeof localStorage === 'undefined') {
    console.warn('localStorage not available, skipping oracle tracking');
    return null;
  }
  
  try {
    const interaction = {
      email,
      name,
      timestamp: new Date().toISOString(),
      complimentarySubmitted: true,
      premiumPurchased: false
    };
    
    localStorage.setItem('lyrion_oracle_interaction', JSON.stringify(interaction));
    return interaction;
  } catch (error) {
    console.error('Failed to store oracle interaction in localStorage:', error);
    return null;
  }
}

/**
 * Mark premium oracle as purchased (prevents abandoned cart email)
 * @param {string} email - User's email address
 */
async function markPremiumPurchased(email) {
  // TODO: Update database record
  console.log('Marking premium oracle as purchased for:', email);
  
  // Check if localStorage is available
  if (typeof localStorage === 'undefined') {
    console.warn('localStorage not available, skipping purchase tracking');
    return;
  }
  
  try {
    // Update localStorage placeholder
    const stored = localStorage.getItem('lyrion_oracle_interaction');
    if (stored) {
      const interaction = JSON.parse(stored);
      if (interaction.email === email) {
        interaction.premiumPurchased = true;
        interaction.purchaseTimestamp = new Date().toISOString();
        localStorage.setItem('lyrion_oracle_interaction', JSON.stringify(interaction));
      }
    }
  } catch (error) {
    console.error('Failed to update oracle purchase in localStorage:', error);
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sendComplimentaryOracleEmail,
    sendPremiumOracleEmail,
    trackOracleInteraction,
    markPremiumPurchased
  };
}
