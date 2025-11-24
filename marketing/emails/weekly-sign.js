/**
 * LYRION Weekly Email Automation
 * Sends weekly emails featuring rotating zodiac sign
 * Minimal cosmic tone with product recommendations
 */

/**
 * Weekly Sign Email Template
 * Dynamically features one zodiac sign per week
 */
export function generateWeeklySignEmail(sign, signDetails, products) {
  const { traits, dates, element } = signDetails;
  
  return {
    subject: `This Week's Sign: ${sign} ${signDetails.icon || ''}`,
    preheader: `Explore ${sign} energy through celestial couture`,
    
    body: `Dear Celestial Soul,

This week, the cosmos highlights ${sign}.

**${sign} • ${dates} • ${element} Sign**

${traits}

Whether this is your sign or simply an energy you're drawn to, ${sign} season invites us all to embody its essence. 

**This Week's ${sign} Alignment:**

${formatProductRecommendations(products)}

These pieces carry ${sign} energy — from the ${sign} Zodiac Hoodie to complementary items that honor this constellation's unique frequency.

**Cosmic Guidance**

The Oracle is always available for deeper insight into how ${sign} energy intersects with your personal chart. Submit your questions. Receive written cosmic counsel.

[Consult the Oracle]

May this week bring you ${getWeeklyBlessing(sign)}.

With celestial intention,  
The LYRĪON Conclave

P.S. Next week features ${getNextSign(sign)}. The wheel continues turning.`,

    cta: {
      primary: `Explore ${sign}`,
      primaryUrl: `/zodiac/${sign.toLowerCase()}.html`,
      secondary: 'Consult the Oracle',
      secondaryUrl: '/oracle.html'
    }
  };
}

/**
 * Format product recommendations for email
 * @param {Array} products - Array of product objects
 * @returns {string} Formatted product list
 */
function formatProductRecommendations(products) {
  if (!products || products.length === 0) {
    return '• Zodiac Hoodie\n• Celestial Candle\n• Sign-Aligned Home Item';
  }
  
  return products.map(product => `• **${product.name}** - ${product.description}`).join('\n');
}

/**
 * Get weekly blessing based on sign
 * @param {string} sign - Zodiac sign
 * @returns {string} Blessing message
 */
function getWeeklyBlessing(sign) {
  const blessings = {
    Aries: 'courage in your pursuits',
    Taurus: 'grounded abundance',
    Gemini: 'clarity in communication',
    Cancer: 'emotional sanctuary',
    Leo: 'radiant confidence',
    Virgo: 'purposeful precision',
    Libra: 'harmonious balance',
    Scorpio: 'transformative depth',
    Sagittarius: 'expansive wisdom',
    Capricorn: 'disciplined achievement',
    Aquarius: 'visionary freedom',
    Pisces: 'intuitive flow'
  };
  
  return blessings[sign] || 'cosmic alignment';
}

/**
 * Get next sign in rotation
 * @param {string} currentSign - Current zodiac sign
 * @returns {string} Next zodiac sign
 */
function getNextSign(currentSign) {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  const currentIndex = signs.indexOf(currentSign);
  const nextIndex = (currentIndex + 1) % 12;
  return signs[nextIndex];
}

/**
 * Get recommended products for a zodiac sign
 * This would connect to your product catalog in production
 * @param {string} sign - Zodiac sign
 * @returns {Array} Array of recommended products
 */
export function getSignProducts(sign) {
  // Placeholder - in production, this would query your actual product catalog
  return [
    {
      name: `${sign} Zodiac Hoodie`,
      description: `Luxury hoodie featuring ${sign} constellation`,
      price: '£65',
      url: `/product.html?sku=${sign.toLowerCase()}-hoodie`
    },
    {
      name: `${sign} Celestial Candle`,
      description: `Hand-poured candle aligned with ${sign} energy`,
      price: '£28',
      url: `/product.html?sku=${sign.toLowerCase()}-candle`
    },
    {
      name: `${sign} Home Collection`,
      description: `Curated home items for ${sign} souls`,
      price: '£35',
      url: `/shop.html?collection=cosmic-home&sign=${sign.toLowerCase()}`
    }
  ];
}

/**
 * Weekly email sending schedule
 * @returns {object} Recommended timing
 */
export function getWeeklyEmailSchedule() {
  return {
    day: 'Monday',
    time: '10:00 AM GMT',
    frequency: 'Weekly',
    note: 'Send at the start of each week to introduce the featured sign'
  };
}

/**
 * Generate complete weekly email with current sign
 * Uses marketing.js getWeeklySign() function
 * @returns {object} Complete email object
 */
export function generateCurrentWeeklyEmail() {
  // Import getWeeklySign from lib/marketing.js
  // In browser environment, this function should be available globally
  let currentSign;
  
  if (typeof getWeeklySign === 'function') {
    currentSign = getWeeklySign();
  } else {
    // Fallback calculation if marketing.js not loaded
    const signs = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const daysSinceStart = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(daysSinceStart / 7);
    const signIndex = weekNumber % 12;
    currentSign = signs[signIndex];
  }
  
  const signDetails = {
    traits: getSignTraits(currentSign),
    dates: getSignDates(currentSign),
    element: getSignElement(currentSign),
    icon: getSignIcon(currentSign)
  };
  
  const products = getSignProducts(currentSign);
  
  return generateWeeklySignEmail(currentSign, signDetails, products);
}

// Helper functions for sign details
function getSignTraits(sign) {
  const traits = {
    Aries: 'The pioneer spirit. Bold, courageous, and driven by pure intention.',
    Taurus: 'The keeper of earthly wisdom. Grounded, sensual, and connected to beauty.',
    Gemini: 'The cosmic storyteller. Curious, adaptable, endlessly communicative.',
    Cancer: 'The celestial nurturer. Emotional depth meets protective grace.',
    Leo: 'The radiant sovereign. Confident, generous, born to shine.',
    Virgo: 'The cosmic perfectionist. Precise, analytical, devoted to refinement.',
    Libra: 'The harmonist of the zodiac. Balanced, diplomatic, aesthetically driven.',
    Scorpio: 'The cosmic alchemist. Intense, transformative, mysteriously magnetic.',
    Sagittarius: 'The eternal seeker. Adventurous, philosophical, optimistically free.',
    Capricorn: 'The celestial architect. Ambitious, disciplined, timelessly patient.',
    Aquarius: 'The cosmic visionary. Innovative, independent, humanitarianly focused.',
    Pisces: 'The celestial dreamer. Intuitive, empathetic, ethereally creative.'
  };
  return traits[sign] || '';
}

function getSignDates(sign) {
  const dates = {
    Aries: 'March 21 - April 19',
    Taurus: 'April 20 - May 20',
    Gemini: 'May 21 - June 20',
    Cancer: 'June 21 - July 22',
    Leo: 'July 23 - August 22',
    Virgo: 'August 23 - September 22',
    Libra: 'September 23 - October 22',
    Scorpio: 'October 23 - November 21',
    Sagittarius: 'November 22 - December 21',
    Capricorn: 'December 22 - January 19',
    Aquarius: 'January 20 - February 18',
    Pisces: 'February 19 - March 20'
  };
  return dates[sign] || '';
}

function getSignElement(sign) {
  const elements = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
  };
  return elements[sign] || '';
}

function getSignIcon(sign) {
  const icons = {
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
    Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
    Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
  };
  return icons[sign] || '';
}
