/**
 * LYRION Referral System
 * Simple referral link generator with celestial credits
 */

/**
 * Generate unique referral code for user
 * @param {string} userId - User ID or email
 * @returns {string} Referral code
 */
function generateReferralCode(userId) {
  // Create a simple hash of the user ID
  const hash = btoa(userId).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase();
  return `STAR${hash}`;
}

/**
 * Get referral link for user
 * @param {string} userId - User ID or email
 * @param {string} baseUrl - Base URL of site (optional, defaults to current origin)
 * @returns {string} Full referral link
 */
function getReferralLink(userId, baseUrl = null) {
  const code = generateReferralCode(userId);
  const base = baseUrl || window.location.origin;
  return `${base}/?ref=${code}`;
}

/**
 * Track referral from URL parameter
 * @returns {string|null} Referral code if present, null otherwise
 */
function trackReferralFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  
  if (refCode) {
    // Store in localStorage for tracking through purchase
    localStorage.setItem('lyrion-referral-code', refCode);
    localStorage.setItem('lyrion-referral-timestamp', Date.now());
    return refCode;
  }
  
  return null;
}

/**
 * Get stored referral code (if user came via referral link)
 * @returns {string|null} Referral code or null
 */
function getStoredReferralCode() {
  const code = localStorage.getItem('lyrion-referral-code');
  const timestamp = localStorage.getItem('lyrion-referral-timestamp');
  
  // Expire referral after 30 days
  if (code && timestamp) {
    const age = Date.now() - parseInt(timestamp);
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    
    if (age < thirtyDays) {
      return code;
    } else {
      // Clear expired referral
      localStorage.removeItem('lyrion-referral-code');
      localStorage.removeItem('lyrion-referral-timestamp');
    }
  }
  
  return null;
}

/**
 * Display referral section on account/profile page
 * @param {HTMLElement} container - Container element
 * @param {string} userId - User ID or email
 */
function displayReferralSection(container, userId) {
  if (!container || !userId) return;
  
  const referralLink = getReferralLink(userId);
  const referralCode = generateReferralCode(userId);
  
  // Get referral stats from localStorage (in production, this would be from backend)
  const stats = getReferralStats(userId);
  
  const referralSection = document.createElement('div');
  referralSection.id = 'referral-section';
  referralSection.style.cssText = `
    padding: 2.5rem;
    background: linear-gradient(135deg, rgba(244, 239, 232, 0.4) 0%, rgba(252, 250, 250, 0.8) 100%);
    border: 2px solid var(--color-gold);
    border-radius: 12px;
    margin: 2rem 0;
  `;
  
  referralSection.innerHTML = `
    <div style="text-align: center; margin-bottom: 2rem;">
      <div style="font-size: 2rem; color: var(--color-gold); margin-bottom: 1rem;">✧</div>
      <h3 style="font-family: 'Playfair Display', serif; font-size: 1.8rem; color: #151311; margin-bottom: 0.5rem; font-weight: 600;">
        Share the Constellation
      </h3>
      <p style="font-size: 1rem; color: #5a5856; line-height: 1.6;">
        Invite friends to LYRĪON. When they make their first purchase, you both receive £5 Celestial Credit.
      </p>
    </div>
    
    <div style="background: white; border: 1px solid #e0ddd9; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
      <label style="display: block; font-size: 0.9rem; color: #5a5856; margin-bottom: 0.5rem; font-weight: 600;">Your Referral Link:</label>
      <div style="display: flex; gap: 0.5rem; align-items: stretch;">
        <input 
          type="text" 
          id="referral-link-input" 
          value="${referralLink}" 
          readonly
          style="flex: 1; padding: 0.8rem; border: 2px solid #e0ddd9; border-radius: 6px; font-size: 0.95rem; font-family: monospace; background: #f5f3ef;"
        >
        <button 
          id="copy-referral-btn"
          style="padding: 0.8rem 1.5rem; background: var(--color-gold); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.3s ease; white-space: nowrap;"
        >
          Copy Link
        </button>
      </div>
      <p style="font-size: 0.85rem; color: #8a8886; margin-top: 0.5rem;">
        Your code: <strong style="color: var(--color-gold);">${referralCode}</strong>
      </p>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
      <div style="background: white; border: 1px solid #e0ddd9; border-radius: 8px; padding: 1.5rem; text-align: center;">
        <div style="font-size: 2rem; color: var(--color-gold); font-weight: 600; margin-bottom: 0.3rem;">
          ${stats.referrals}
        </div>
        <div style="font-size: 0.9rem; color: #5a5856;">
          Successful Referrals
        </div>
      </div>
      
      <div style="background: white; border: 1px solid #e0ddd9; border-radius: 8px; padding: 1.5rem; text-align: center;">
        <div style="font-size: 2rem; color: var(--color-gold); font-weight: 600; margin-bottom: 0.3rem;">
          £${stats.creditsEarned.toFixed(2)}
        </div>
        <div style="font-size: 0.9rem; color: #5a5856;">
          Credits Earned
        </div>
      </div>
      
      <div style="background: white; border: 1px solid #e0ddd9; border-radius: 8px; padding: 1.5rem; text-align: center;">
        <div style="font-size: 2rem; color: var(--color-gold); font-weight: 600; margin-bottom: 0.3rem;">
          £${stats.creditsAvailable.toFixed(2)}
        </div>
        <div style="font-size: 0.9rem; color: #5a5856;">
          Available Balance
        </div>
      </div>
    </div>
    
    <div style="background: rgba(196, 164, 73, 0.05); border: 1px solid rgba(196, 164, 73, 0.2); border-radius: 6px; padding: 1rem;">
      <h4 style="font-size: 1rem; color: #151311; margin: 0 0 0.5rem 0; font-weight: 600;">How it works:</h4>
      <ol style="margin: 0; padding-left: 1.5rem; color: #5a5856; font-size: 0.9rem; line-height: 1.7;">
        <li>Share your unique referral link with friends</li>
        <li>When they make their first purchase, they get £5 off</li>
        <li>You receive £5 Celestial Credit to use on future purchases</li>
        <li>No limit on referrals — share the cosmic love freely</li>
      </ol>
    </div>
  `;
  
  container.appendChild(referralSection);
  
  // Add copy button functionality
  const copyBtn = document.getElementById('copy-referral-btn');
  const linkInput = document.getElementById('referral-link-input');
  
  if (copyBtn && linkInput) {
    copyBtn.addEventListener('click', () => {
      linkInput.select();
      document.execCommand('copy');
      
      // Show feedback
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.style.background = '#27AE60';
      
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '';
      }, 2000);
    });
  }
}

/**
 * Get referral statistics for user
 * In production, this would fetch from backend
 * @param {string} userId - User ID
 * @returns {Object} Stats object
 */
function getReferralStats(userId) {
  // Get from localStorage (mock data for now)
  const storageKey = `lyrion-referral-stats-${userId}`;
  const stored = localStorage.getItem(storageKey);
  
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default stats
  return {
    referrals: 0,
    creditsEarned: 0,
    creditsAvailable: 0,
    creditsUsed: 0
  };
}

/**
 * Update referral stats (mock function for development)
 * In production, this would call backend API
 * @param {string} userId - User ID
 * @param {Object} updates - Stats to update
 */
function updateReferralStats(userId, updates) {
  const storageKey = `lyrion-referral-stats-${userId}`;
  const current = getReferralStats(userId);
  const updated = { ...current, ...updates };
  localStorage.setItem(storageKey, JSON.stringify(updated));
}

/**
 * Award referral credit
 * @param {string} referrerUserId - ID of user who referred
 * @param {number} amount - Credit amount (default £5)
 */
function awardReferralCredit(referrerUserId, amount = 5.00) {
  const stats = getReferralStats(referrerUserId);
  updateReferralStats(referrerUserId, {
    referrals: stats.referrals + 1,
    creditsEarned: stats.creditsEarned + amount,
    creditsAvailable: stats.creditsAvailable + amount
  });
}

/**
 * Initialize referral tracking on page load
 */
function initReferralTracking() {
  // Track referral code from URL
  trackReferralFromUrl();
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', initReferralTracking);

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateReferralCode,
    getReferralLink,
    trackReferralFromUrl,
    getStoredReferralCode,
    displayReferralSection,
    getReferralStats,
    updateReferralStats,
    awardReferralCredit
  };
}
